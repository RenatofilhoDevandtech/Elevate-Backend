// src/controllers/subscribeController.js
const supabase = require("../config/supabaseClient");
const Joi = require("joi"); // Biblioteca para validação de entrada

// Esquema de validação para a inscrição em funcionalidade
const subscribeSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Permite e-mails sem TLDs como .com, .br, etc.
    .required()
    .messages({
      "string.empty": "O e-mail é obrigatório.",
      "string.email": "Por favor, forneça um e-mail válido.",
      "any.required": "O e-mail é obrigatório.",
    }),
  feature: Joi.string().trim().min(1).required().messages({
    "string.empty": "O nome da funcionalidade é obrigatório.",
    "string.min": "O nome da funcionalidade não pode ser vazio.",
    "any.required": "O nome da funcionalidade é obrigatório.",
  }),
});

exports.addFeatureSubscriber = async (req, res) => {
  const { error: validationError, value } = subscribeSchema.validate(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }

  const { email, feature } = value;

  try {
    // Insere os dados na tabela 'feature_subscribers'
    // Se a combinação email/feature_name já existir (UNIQUE constraint), ocorrerá um erro 23505
    const { data, error: supabaseError } = await supabase
      .from("feature_subscribers")
      .insert({
        email: email,
        feature_name: feature,
      })
      .select() // Retorna os dados recém-inseridos
      .single();

    // Tratamento de erros, incluindo o caso de e-mail duplicado para a mesma funcionalidade
    if (supabaseError) {
      if (supabaseError.code === "23505") {
        // Código de erro do PostgreSQL para violação de UNIQUE constraint
        return res.status(409).json({
          message:
            "Obrigado! Este e-mail já está na nossa lista de espera para esta funcionalidade.",
        });
      }
      console.error(
        "Erro Supabase ao registrar interesse:",
        supabaseError.message
      );
      throw new Error("Falha ao registrar seu interesse."); // Lança para o bloco catch genérico
    }

    // Retorna uma resposta de sucesso
    res.status(201).json({
      message: `Obrigado! Avisaremos em ${data.email} assim que a seção de ${data.feature_name} for lançada.`,
      subscription: data,
    });
  } catch (error) {
    console.error("Erro inesperado ao registrar interesse:", error.message);
    res.status(500).json({
      error:
        error.message ||
        "Não foi possível registrar seu interesse. Tente novamente mais tarde.",
    });
  }
};
