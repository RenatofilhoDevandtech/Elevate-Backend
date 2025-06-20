// src/controllers/forumController.js
const supabase = require("../config/supabaseClient");
const slugify = require("slugify"); // Para criar URLs amigáveis
const Joi = require("joi"); // Para validação de entrada

// Esquemas de validação Joi para diferentes operações do fórum
const createTopicSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required().messages({
    "string.empty": "O título do tópico é obrigatório.",
    "string.min": "O título deve ter pelo menos 5 caracteres.",
    "string.max": "O título não pode exceder 200 caracteres.",
    "any.required": "O título do tópico é obrigatório.",
  }),
  category: Joi.string().trim().allow("").messages({
    "string.base": "A categoria deve ser um texto.",
  }),
});

const createPostSchema = Joi.object({
  content: Joi.string().trim().min(10).required().messages({
    "string.empty": "O conteúdo do post é obrigatório.",
    "string.min": "O post deve ter pelo menos 10 caracteres.",
    "any.required": "O conteúdo do post é obrigatório.",
  }),
});

const updatePostSchema = Joi.object({
  content: Joi.string().trim().min(10).required().messages({
    "string.empty": "O conteúdo do post não pode ser vazio.",
    "string.min": "O post deve ter pelo menos 10 caracteres.",
    "any.required": "O conteúdo do post é obrigatório.",
  }),
});

// --- Funções do Controlador ---

// Lista todos os tópicos do fórum, incluindo informações básicas do criador e contagem de posts.
// Usa a VIEW 'forum_topics_with_post_count' para eficiência.
exports.listForumTopics = async (req, res) => {
  try {
    // 1. Busca os tópicos da VIEW, selecionando APENAS o user_id.
    // Evita inferências de JOIN complexas diretamente da VIEW para maior robustez.
    const { data: topicsData, error: topicsError } = await supabase
      .from("forum_topics_with_post_count") // Usa a VIEW que já tem 'post_count' e 'user_id'
      .select("id, created_at, title, slug, category, last_activity_at, post_count, user_id")
      .order("last_activity_at", { ascending: false }); // Ordena pelos tópicos mais recentes/ativos

    if (topicsError) {
      console.error("Erro Supabase ao buscar tópicos do fórum (apenas tópicos):", topicsError.message);
      throw new Error("Falha ao buscar tópicos do fórum.");
    }

    // 2. Coleta todos os user_ids únicos dos tópicos para buscar seus nomes em lote.
    const uniqueUserIds = [...new Set(topicsData.map(topic => topic.user_id))];

    let usersMap = new Map();
    if (uniqueUserIds.length > 0) {
      // 3. Busca os nomes completos dos usuários a partir da tabela 'auth.users'.
      // É CRÍTICO que a Service Role Key no seu backend tenha permissão de SELECT em 'auth.users'.
      const { data: usersData, error: usersError } = await supabase
        .from("users") // 'users' é a tabela 'auth.users' no Supabase
        .select("id, raw_user_meta_data->>full_name") // Extrai o 'full_name' do JSONB 'raw_user_meta_data'
        .in("id", uniqueUserIds); // Busca apenas os usuários relevantes para os tópicos

      if (usersError) {
        console.warn("Aviso: Erro Supabase ao buscar nomes de usuários para tópicos:", usersError.message);
        // Não causa um erro fatal na API se os nomes não puderem ser buscados.
      } else if (usersData) {
        usersData.forEach(user => {
          usersMap.set(user.id, user.raw_user_meta_data); // Mapeia o ID do usuário ao seu full_name
        });
      }
    }

    // 4. Combina os dados dos tópicos com os nomes dos usuários no Node.js.
    const finalTopics = topicsData.map(topic => ({
      ...topic,
      users: { // Constrói o objeto 'users' no formato que o frontend espera (topic.users.full_name)
        id: topic.user_id,
        full_name: usersMap.get(topic.user_id) || 'Usuário Desconhecido' // Fallback para nomes não encontrados
      }
    }));

    res.status(200).json(finalTopics);
  } catch (error) {
    console.error("Erro inesperado ao listar tópicos:", error.message);
    res.status(500).json({
      error: error.message || "Ocorreu um erro interno ao listar tópicos.",
    });
  }
};

// Cria um novo tópico no fórum (rota protegida, exige login).
exports.createForumTopic = async (req, res) => {
  const userId = req.user.id; // ID do usuário vem do middleware de autenticação

  const { error: validationError, value } = createTopicSchema.validate(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }

  const { title, category } = value;
  // Gera um slug único e amigável para a URL do tópico.
  const slug = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });

  try {
    const { data, error: supabaseError } = await supabase
      .from("forum_topics")
      .insert({
        user_id: userId,
        title,
        slug,
        category,
        last_activity_at: new Date(), // Define a data de última atividade como a criação
      })
      .select(`
        id, created_at, title, slug, category, last_activity_at, user_id,
        users!inner(id, raw_user_meta_data->>full_name) -- Inclui dados do usuário criador
      `) // Retorna os dados do tópico recém-criado + infos do usuário
      .single();

    if (supabaseError) {
      if (
        supabaseError.code === "23505" && // Erro de violação de UNIQUE constraint (slug duplicado)
        supabaseError.message.includes("slug")
      ) {
        return res.status(409).json({
          error: "Já existe um tópico com um título muito parecido. Tente um título diferente.",
        });
      }
      console.error("Erro Supabase ao criar tópico:", supabaseError.message);
      throw new Error("Falha ao criar o tópico do fórum.");
    }
    res.status(201).json(data); // 201 Created - Tópico criado com sucesso
  } catch (error) {
    console.error("Erro inesperado ao criar tópico:", error.message);
    res.status(500).json({
      error: error.message || "Ocorreu um erro interno ao criar o tópico.",
    });
  }
};

// Obtém detalhes de um tópico específico e todos os seus posts.
exports.getForumTopicAndPosts = async (req, res) => {
  const { topicSlug } = req.params; // O slug do tópico vem da URL

  try {
    // 1. Busca o tópico pelo slug, incluindo dados do usuário criador.
    const { data: topic, error: topicError } = await supabase
      .from("forum_topics")
      .select(
        "id, created_at, title, slug, category, last_activity_at, users!inner(id, raw_user_meta_data->>full_name)"
      )
      .eq("slug", topicSlug)
      .single();

    if (topicError || !topic) {
      if (topicError && topicError.code === "PGRST116") { // PGRST116 = no rows found
        return res.status(404).json({ error: "Tópico não encontrado." });
      }
      console.error("Erro Supabase ao buscar tópico:", topicError?.message);
      throw new Error("Falha ao buscar o tópico do fórum.");
    }

    // 2. Busca os posts relacionados a esse tópico, incluindo dados do usuário autor.
    const { data: posts, error: postsError } = await supabase
      .from("forum_posts")
      .select(
        "id, created_at, updated_at, content, users!inner(id, raw_user_meta_data->>full_name)"
      )
      .eq("topic_id", topic.id)
      .order("created_at", { ascending: true }); // Ordena posts por data de criação

    if (postsError) {
      console.error("Erro Supabase ao buscar posts do tópico:", postsError.message);
      throw new Error("Falha ao buscar posts do fórum.");
    }

    // 3. Retorna o tópico com seus posts aninhados.
    res.status(200).json({
      ...topic,
      posts: posts,
    });
  } catch (error) {
    console.error("Erro inesperado ao buscar tópico e posts:", error.message);
    res.status(500).json({
      error: error.message || "Ocorreu um erro interno ao buscar o tópico.",
    });
  }
};

// Cria um novo post em um tópico (rota protegida, exige login).
exports.createForumPost = async (req, res) => {
  const userId = req.user.id;
  const { topicId } = req.params; // ID do tópico pai do post

  const { error: validationError, value } = createPostSchema.validate(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }
  const { content } = value;

  try {
    const { data, error: supabaseError } = await supabase
      .from("forum_posts")
      .insert({
        user_id: userId,
        topic_id: topicId,
        content,
        updated_at: new Date().toISOString(),
      })
      .select(`
        id, created_at, updated_at, content, user_id,
        users!inner(id, raw_user_meta_data->>full_name) -- Inclui dados do usuário autor do post
      `) // Retorna o post criado + infos do autor
      .single();

    if (supabaseError) {
      console.error("Erro Supabase ao criar post:", supabaseError.message);
      throw new Error("Falha ao criar o post no fórum.");
    }
    res.status(201).json(data); // 201 Created - Post criado com sucesso
  } catch (error) {
    console.error("Erro inesperado ao criar post:", error.message);
    res.status(500).json({
      error: error.message || "Ocorreu um erro interno ao criar o post.",
    });
  }
};

// Atualiza um post existente (rota protegida, só o criador pode atualizar).
exports.updateForumPost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  const { error: validationError, value } = updatePostSchema.validate(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }
  const { content } = value;

  try {
    const { data, error: supabaseError } = await supabase
      .from("forum_posts")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", postId)
      .eq("user_id", userId) // Garante que o usuário só pode atualizar seu próprio post
      .select(`
        id, created_at, updated_at, content, user_id,
        users!inner(id, raw_user_meta_data->>full_name) -- Inclui dados do usuário autor do post
      `) // Retorna o post atualizado + infos do autor
      .single();

    if (supabaseError) {
      if (supabaseError.code === "PGRST116") { // PGRST116 = no rows found (post não existe ou não pertence ao usuário)
        return res.status(404).json({
          error: "Post não encontrado ou você não tem permissão para editá-lo.",
        });
      }
      console.error("Erro Supabase ao atualizar post:", supabaseError.message);
      throw new Error("Falha ao atualizar o post.");
    }
    res.status(200).json(data); // 200 OK - Post atualizado com sucesso
  } catch (error) {
    console.error("Erro inesperado ao atualizar post:", error.message);
    res.status(500).json({
      error: error.message || "Ocorreu um erro interno ao atualizar o post.",
    });
  }
};

// Deleta um post existente (rota protegida, só o criador pode deletar).
exports.deleteForumPost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const { error: supabaseError } = await supabase
      .from("forum_posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId); // Garante que o usuário só pode deletar seu próprio post

    if (supabaseError) {
      if (supabaseError.code === "PGRST116") { // PGRST116 = no rows found
        return res.status(404).json({
          error: "Post não encontrado ou você não tem permissão para deletá-lo.",
        });
      }
      console.error("Erro Supabase ao deletar post:", supabaseError.message);
      throw new Error("Falha ao deletar o post.");
    }
    res.status(204).send(); // 204 No Content - Sucesso sem corpo de resposta
  } catch (error) {
    console.error("Erro inesperado ao deletar post:", error.message);
    res.status(500).json({
      error: error.message || "Ocorreu um erro interno ao deletar o post.",
    });
  }
};