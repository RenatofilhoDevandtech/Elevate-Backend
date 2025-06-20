// src/controllers/progressController.js
const supabase = require("../config/supabaseClient");
const Joi = require("joi"); // Biblioteca para validação de entrada

// Esquema de validação para marcar/atualizar progresso
const updateProgressSchema = Joi.object({
  content_id: Joi.number().integer().required().messages({
    "number.base": "O ID do conteúdo deve ser um número.",
    "number.integer": "O ID do conteúdo deve ser um número inteiro.",
    "any.required": "O ID do conteúdo é obrigatório.",
  }),
  status: Joi.string()
    .valid("started", "in_progress", "completed")
    .default("completed")
    .messages({
      "any.only": 'Status inválido. Use "started", "in_progress" ou "completed".',
    }),
});

// Marca/atualiza o progresso de um conteúdo para o usuário logado
exports.updateContentProgress = async (req, res) => {
  const userId = req.user.id; // ID do usuário logado (do middleware de autenticação)

  const { error: validationError, value } = updateProgressSchema.validate(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }
  const { content_id, status } = value;

  try {
    const { error: supabaseError } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: userId,
          content_id: content_id,
          status: status,
          completed_at: status === "completed" ? new Date().toISOString() : null,
        },
        {
          // CORREÇÃO: onConflict usa os NOMES das colunas da restrição UNIQUE,
          // que são 'user_id' e 'content_id', e não o nome da constraint.
          onConflict: 'user_id,content_id',
          ignoreDuplicates: false // Pode manter ou remover (default é false)
        }
      );

    if (supabaseError) {
      console.error("Erro Supabase ao atualizar progresso:", supabaseError.message);
      throw new Error("Falha ao salvar o progresso.");
    }

    res.status(200).json({ message: "Progresso atualizado com sucesso." });
  } catch (error) {
    console.error("Erro inesperado ao atualizar progresso:", error.message);
    res.status(500).json({ error: error.message || "Erro ao salvar o progresso." });
  }
};

// Busca todos os IDs de conteúdos concluídos e/ou em progresso pelo usuário logado
exports.getCompletionStatus = async (req, res) => {
  const userId = req.user.id; // ID do usuário logado (do middleware de autenticação)

  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("content_id, status")
      .eq("user_id", userId);

    if (error) {
      console.error("Erro Supabase ao buscar status de conclusão:", error.message);
      throw new Error("Falha ao buscar o progresso do usuário.");
    }

    // Retorna um mapa para fácil acesso no frontend (Ex: { 101: 'completed', 205: 'in_progress' })
    const userProgressMap = data.reduce((acc, item) => {
      acc[item.content_id] = item.status;
      return acc;
    }, {});

    res.status(200).json({ userProgress: userProgressMap });
  } catch (error) {
    console.error("Erro inesperado ao buscar status de conclusão:", error.message);
    res.status(500).json({ error: error.message || "Erro ao buscar o progresso do usuário." });
  }
};

// Deleta um registro de progresso específico (protegida)
exports.deleteContentProgress = async (req, res) => {
  const userId = req.user.id; // ID do usuário logado (do middleware de autenticação)
  const { content_id } = req.params; // ID do conteúdo (parâmetro de URL)

  if (!content_id) {
    return res.status(400).json({ error: "O ID do conteúdo é obrigatório." });
  }

  try {
    const { error: supabaseError } = await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", userId)
      .eq("content_id", content_id); // Garante que o usuário só delete seu próprio progresso

    if (supabaseError) {
      if (supabaseError.code === "PGRST116") {
        return res.status(404).json({ error: "Progresso não encontrado ou você não tem permissão para removê-lo." });
      }
      console.error("Erro Supabase ao deletar progresso:", supabaseError.message);
      throw new Error("Falha ao deletar o progresso.");
    }

    res.status(200).json({ message: "Progresso do conteúdo removido com sucesso." });
  } catch (error) {
    console.error("Erro inesperado ao deletar progresso:", error.message);
    res.status(500).json({
      error: error.message || "Ocorreu um erro interno ao remover o progresso do usuário.",
    });
  }
};