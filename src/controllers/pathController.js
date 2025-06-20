// src/controllers/pathController.js
const supabase = require("../config/supabaseClient");
const Joi = require("joi"); // Biblioteca para validar dados de entrada
const axios = require("axios"); // Para chamar a API do YouTube
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Sua chave da API do YouTube

// Converte a duração do YouTube (formato ISO 8601, ex: PT1H30M5S) para minutos
function convertYoutubeDurationToMinutes(isoDuration) {
  if (!isoDuration) return 0;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || 0) * 60;
  const minutes = parseInt(match[2] || 0);
  const seconds = Math.ceil(parseInt(match[3] || 0) / 60); // Arredonda segundos para o minuto mais próximo
  return hours + minutes + seconds;
}

// --- Esquemas de Validação com Joi ---

const getAllPathsSchema = Joi.object({
  search: Joi.string()
    .trim()
    .allow("")
    .messages({ "string.base": "A busca deve ser um texto." }),
  category: Joi.string()
    .trim()
    .allow("All", "")
    .messages({ "string.base": "A categoria deve ser um texto." }),
  level: Joi.string()
    .trim()
    .allow("All", "")
    .messages({ "string.base": "O nível deve ser um texto." }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "A página deve ser um número.",
    "number.integer": "A página deve ser um número inteiro.",
    "number.min": "A página deve ser no mínimo 1.",
  }),
  limit: Joi.number().integer().min(1).max(100).default(9).messages({
    "number.base": "O limite deve ser um número.",
    "number.integer": "O limite deve ser um número inteiro.",
    "number.min": "O limite deve ser no mínimo 1.",
    "number.max": "O limite máximo é 100.",
  }),
});

const getPathByIdSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "string.empty": "ID da trilha é obrigatório.",
    "any.required": "ID da trilha é obrigatório.",
  }),
});

const upsertYoutubeContentSchema = Joi.object({
  id: Joi.number().integer().optional(), // ID opcional para atualizar conteúdo existente
  module_id: Joi.string().trim().required().messages({
    "string.empty": "ID do módulo é obrigatório.",
    "any.required": "ID do módulo é obrigatório.",
  }),
  title: Joi.string().trim().required().messages({
    "string.empty": "O título do conteúdo é obrigatório.",
    "any.required": "O título do conteúdo é obrigatório.",
  }),
  youtube_video_id: Joi.string().trim().length(11).required().messages({
    "string.empty": "O ID do vídeo do YouTube é obrigatório.",
    "string.length": "O ID do vídeo do YouTube deve ter 11 caracteres.",
    "any.required": "O ID do vídeo do YouTube é obrigatório.",
  }),
  description: Joi.string().trim().allow(""), // Descrição pode ser vazia
  estimated_duration_minutes: Joi.number().integer().min(0).optional(), // Duração opcional
  content_order: Joi.number().integer().min(0).optional(), // Ordem opcional
});

// --- Funções do Controlador ---

// Lista todas as trilhas com filtros, paginação e progresso do usuário
exports.getAllPaths = async (req, res) => {
  const { error: validationError, value } = getAllPathsSchema.validate(
    req.query
  );
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }
  const { search, category, level, page, limit } = value;
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from("paths_with_stats") // VIEW que já inclui 'modules_count'
      .select(
        "id, title, description, category, difficulty_level, cover_image_url, modules_count",
        { count: "exact" }
      );

    // Aplica filtros
    if (search)
      query = query.or(
        `title.ilike.%<span class="math-inline">\{search\}%,description\.ilike\.%</span>{search}%`
      );
    if (category && category !== "All") query = query.eq("category", category);
    if (level && level !== "All") query = query.eq("difficulty_level", level);

    // Aplica paginação e ordenação
    query = query
      .range(offset, offset + limit - 1)
      .order("title", { ascending: true });

    const { data: pathsData, error, count } = await query;
    if (error) {
      console.error("Erro Supabase ao buscar trilhas:", error.message);
      throw new Error("Falha ao buscar as trilhas de aprendizado.");
    }

    let finalData = pathsData.map((path) => ({ ...path, userProgress: null })); // Inicializa progresso

    // Se o usuário estiver logado, busca o progresso via função RPC
    if (req.user) {
      const userId = req.user.id;
      const pathIds = pathsData.map((p) => p.id);

      const { data: progressSummary, error: progressError } =
        await supabase.rpc("get_user_paths_progress", {
          p_user_id: userId,
          p_path_ids: pathIds,
        });

      if (progressError) {
        console.error("Erro RPC ao buscar progresso:", progressError.message);
      } else {
        const progressMap = new Map();
        if (progressSummary) {
          progressSummary.forEach((item) => {
            progressMap.set(item.path_id, {
              completed: item.completed_count,
              total: item.total_count,
              percentage:
                item.total_count > 0
                  ? Math.round((item.completed_count / item.total_count) * 100)
                  : 0,
            });
          });
        }

        finalData = finalData.map((path) => ({
          ...path,
          userProgress: progressMap.get(path.id) || {
            completed: 0,
            total: 0,
            percentage: 0,
          },
        }));
      }
    }

    res.status(200).json({
      data: finalData,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Erro inesperado ao buscar trilhas:", error.message);
    res.status(500).json({
      error: error.message || "Erro ao buscar as trilhas de aprendizado.",
    });
  }
};

// Busca uma trilha específica pelo seu ID, incluindo módulos e conteúdos
exports.getPathById = async (req, res) => {
  const { error: validationError, value } = getPathByIdSchema.validate(
    req.params
  );
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }
  const { id } = value;

  try {
    // Busca a trilha com módulos e conteúdos aninhados, incluindo metadados do YouTube
    const { data, error } = await supabase
      .from("paths")
      .select(
        `
        id, title, description, category, difficulty_level, cover_image_url,
        long_description, skills_array, career_opportunities_array,
        modules (
            id, title, module_order,
            contents (
                id, title, content_type, url, description, estimated_duration_minutes, content_order,
                youtube_video_id, thumbnail_url, channel_name
            )
        )
        `
      )
      .eq("id", id)
      .order("module_order", { foreignTable: "modules", ascending: true })
      .order("content_order", {
        foreignTable: "modules.contents",
        ascending: true,
      })
      .single();

    if (error && error.code === "PGRST116") {
      return res.status(404).json({ error: "Trilha não encontrada." });
    }
    if (error) {
      console.error(`Erro Supabase ao buscar trilha ${id}:`, error.message);
      throw new Error("Falha ao buscar os detalhes da trilha.");
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(`Erro inesperado ao buscar trilha ${id}:`, error.message);
    res.status(500).json({
      error: error.message || "Erro ao buscar os detalhes da trilha.",
    });
  }
};

// --- Funções (Para Uso Administrativo) - Curadoria de Conteúdo ---
// Estas funções devem ser acessíveis apenas por usuários com permissão de admin.
// Implemente um middleware de autorização nas rotas que as utilizam.

// Adiciona ou atualiza um conteúdo de vídeo do YouTube
exports.upsertYoutubeContent = async (req, res) => {
  const { error: validationError, value } = upsertYoutubeContentSchema.validate(
    req.body
  );
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }

  const {
    id,
    module_id,
    title,
    youtube_video_id,
    description,
    estimated_duration_minutes,
    content_order,
  } = value;

  try {
    // Verifica a chave da API do YouTube
    if (!YOUTUBE_API_KEY) {
      return res
        .status(500)
        .json({
          error: "A chave da API do YouTube não está configurada no servidor.",
        });
    }

    // Chama a API do YouTube para obter metadados do vídeo
    const youtubeResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          id: youtube_video_id,
          key: YOUTUBE_API_KEY,
          part: "snippet,contentDetails",
        },
      }
    );

    const videoData = youtubeResponse.data.items[0];
    if (!videoData) {
      return res
        .status(404)
        .json({ error: "Vídeo do YouTube não encontrado com o ID fornecido." });
    }

    const snippet = videoData.snippet;
    const contentDetails = videoData.contentDetails;

    // Calcula a duração final (prioriza a fornecida, senão a do YouTube)
    const finalDurationMinutes =
      estimated_duration_minutes ||
      convertYoutubeDurationToMinutes(contentDetails.duration);

    // Dados a serem salvos na tabela 'contents'
    const contentData = {
      module_id: module_id,
      title: title, // Prioriza o título fornecido pelo admin
      content_type: "video",
      url: `https://www.youtube.com/watch?v=${youtube_video_id}`, // URL completa do YouTube
      youtube_video_id: youtube_video_id,
      description: description || snippet.description, // Prioriza a descrição fornecida
      estimated_duration_minutes: finalDurationMinutes,
      thumbnail_url: snippet.thumbnails.high.url,
      channel_name: snippet.channelTitle,
      content_order: content_order || 0,
    };

    let result;
    if (id) {
      // Atualiza um conteúdo existente
      result = await supabase
        .from("contents")
        .update(contentData)
        .eq("id", id)
        .select()
        .single();
    } else {
      // Insere um novo conteúdo
      result = await supabase
        .from("contents")
        .insert(contentData)
        .select()
        .single();
    }

    if (result.error) {
      console.error(
        "Erro Supabase ao upsertar conteúdo de vídeo:",
        result.error.message
      );
      throw new Error(
        `Falha ao salvar o conteúdo de vídeo: ${result.error.message}`
      );
    }

    res.status(id ? 200 : 201).json({
      message: id
        ? "Conteúdo de vídeo atualizado com sucesso!"
        : "Conteúdo de vídeo adicionado com sucesso!",
      content: result.data,
    });
  } catch (error) {
    console.error(
      "Erro ao processar conteúdo de vídeo do YouTube:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        error.message ||
        "Erro ao processar conteúdo de vídeo.",
    });
  }
};
