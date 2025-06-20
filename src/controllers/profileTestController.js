// src/controllers/profileTestController.js
const supabase = require("../config/supabaseClient");
const {
  profileTestQuestions,
  calculateProfileResult, // Importa a função de cálculo atualizada
} = require("../data/profileTestData");
const Joi = require("joi"); // Biblioteca para validar dados de entrada

// Esquema de validação para as respostas do teste de perfil
const submitAnswersSchema = Joi.object({
  answers: Joi.object()
    .pattern(
      Joi.string().trim().required(),
      Joi.alternatives()
        .try(
          Joi.string().trim().required(),
          Joi.array().items(Joi.string().trim().required()).min(1)
        )
        .required()
    )
    .min(1)
    .required()
    .messages({
      "object.min": "Pelo menos uma resposta é obrigatória.",
      "any.required": "As respostas do teste são obrigatórias.",
      "object.pattern.match": "Formato de resposta inválido para uma ou mais perguntas.",
    }),
});

// Envia as perguntas do teste para o frontend (sem as pontuações internas)
exports.getTestQuestions = (req, res) => {
  const questionsForFrontend = profileTestQuestions.map((q) => {
    const optionsForFrontend = q.options.map((o) => {
      const { value, ...optionData } = o; // Remove a propriedade 'value' da opção
      return optionData;
    });
    return { ...q, options: optionsForFrontend };
  });

  res.status(200).json(questionsForFrontend);
};

// Recebe as respostas, calcula o perfil, salva e retorna a recomendação
exports.submitTestAnswers = async (req, res) => {
  const userId = req.user.id; // ID do usuário logado

  const { error: validationError, value } = submitAnswersSchema.validate(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }

  const { answers } = value;

  try {
    // 1. Calcula os IDs e títulos das trilhas recomendadas (usando a nova lógica)
    const recommendedPathsInitial = calculateProfileResult(answers); // Agora retorna [{ id, name }, ...]

    // Extrai apenas os IDs para buscar os detalhes completos do banco de dados
    const recommendedPathIds = recommendedPathsInitial.map(p => p.id);

    // 2. Salva ou atualiza a submissão do teste no banco de dados
    const { error: submissionError } = await supabase
      .from("profile_test_submissions")
      .upsert(
        {
          user_id: userId,
          answers: answers,
          recommended_path_ids: recommendedPathIds, // Salva APENAS os IDs
          submitted_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (submissionError) {
      console.error("Erro Supabase ao salvar submissão do teste de perfil:", submissionError.message);
      throw new Error("Falha ao salvar o resultado do teste de perfil.");
    }

    // 3. Busca os detalhes COMPLETOS das trilhas recomendadas do banco de dados
    // Isso é crucial para que o frontend (TestResultPage) possa renderizar PathCard.
    const { data: recommendedPathsFullDetails, error: pathError } = await supabase
      .from("paths")
      .select(
        "id, title, description, category, difficulty_level, cover_image_url"
      )
      .in("id", recommendedPathIds); // Busca todas as trilhas pelos IDs

    if (pathError || !recommendedPathsFullDetails || recommendedPathsFullDetails.length === 0) {
      console.error("Erro Supabase ao buscar trilha(s) recomendada(s) completa(s):", pathError?.message || "Trilha(s) não encontrada(s).");
      // Se não encontrou as trilhas (erro nos dados), retorne um 500
      return res.status(500).json({ error: "Trilha(s) recomendada(s) não encontrada(s) no banco de dados." });
    }

    // Mapeia os dados completos para garantir que a ordem e a estrutura sejam as esperadas
    const finalRecommendations = recommendedPathIds.map(id => 
        recommendedPathsFullDetails.find(path => path.id === id)
    ).filter(Boolean); // Remove qualquer nulo caso uma trilha não tenha sido encontrada

    res.status(200).json({ recommendation: finalRecommendations }); // Retorna um ARRAY de OBJETOS DE TRILHA COMPLETOS
  } catch (error) {
    console.error("Erro inesperado ao processar o teste de perfil:", error.message);
    res.status(500).json({ error: error.message || "Erro ao processar o resultado do teste." });
  }
};