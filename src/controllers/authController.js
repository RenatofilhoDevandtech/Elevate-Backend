// src/controllers/authController.js
const supabase = require("../config/supabaseClient");
const Joi = require("joi"); // Biblioteca para validar dados de entrada

// Esquemas de validação para registro e login
const registerSchema = Joi.object({
  full_name: Joi.string().trim().min(3).required().messages({
    "string.empty": "Nome completo é obrigatório.",
    "string.min": "Nome completo deve ter pelo menos 3 caracteres.",
    "any.required": "Nome completo é obrigatório.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "E-mail é obrigatório.",
    "string.email": "E-mail inválido.",
    "any.required": "E-mail é obrigatório.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Senha é obrigatória.",
    "string.min": "Sua senha deve ter pelo menos 6 caracteres.",
    "any.required": "Senha é obrigatória.",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "E-mail é obrigatório.",
    "string.email": "E-mail inválido.",
    "any.required": "E-mail é obrigatório.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Senha é obrigatória.",
    "string.min": "Sua senha deve ter pelo menos 6 caracteres.",
    "any.required": "Senha é obrigatória.",
  }),
});

// Registra um novo usuário
exports.register = async (req, res) => {
  const { error: validationError, value } = registerSchema.validate(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }

  const { full_name, email, password } = value;

  try {
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name,
          // Considere adicionar uma 'role' padrão aqui, e.g., role: 'user'
        },
      },
    });

    if (supabaseError) {
      if (
        supabaseError.message.includes("User already registered") ||
        supabaseError.code === "23505"
      ) {
        return res.status(409).json({ error: "Este e-mail já está em uso." });
      }
      console.error("Erro Supabase no registro:", supabaseError.message);
      return res.status(500).json({
        error: "Ocorreu um erro no registro. Tente novamente mais tarde.",
      });
    }

    return res.status(201).json({
      message:
        "Usuário registrado com sucesso! Verifique seu e-mail para confirmação (se a verificação estiver ativada).",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error("Erro inesperado no registro:", err.message);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro interno no servidor." });
  }
};

// Realiza o login do usuário
exports.login = async (req, res) => {
  const { error: validationError, value } = loginSchema.validate(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }

  const { email, password } = value;

  try {
    const { data, error: supabaseError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (supabaseError) {
      // Mensagens de erro de login mais genéricas por segurança
      return res
        .status(401)
        .json({ error: "Credenciais inválidas ou e-mail não confirmado." });
    }

    if (!data || !data.session || !data.user) {
      return res.status(500).json({
        error: "Erro no login: dados de sessão ausentes após autenticação.",
      });
    }

    res.status(200).json({
      message: "Login bem-sucedido!",
      user: data.user,
      token: data.session.access_token, // Token JWT para requisições futuras
    });
  } catch (err) {
    console.error("Erro inesperado no login:", err.message);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro interno no servidor." });
  }
};

// Retorna os dados do usuário logado
exports.getMe = async (req, res) => {
  // req.user é preenchido pelo middleware de proteção
  if (!req.user) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }
  const { id, email, user_metadata, created_at } = req.user;
  res.status(200).json({
    id,
    email,
    full_name: user_metadata?.full_name,
    role: user_metadata?.role,
    created_at,
  });
};

// Realiza o logout do usuário
exports.logout = async (req, res) => {
  try {
    const { error: supabaseError } = await supabase.auth.signOut();
    if (supabaseError) {
      console.error("Erro ao fazer logout no Supabase:", supabaseError.message);
      return res.status(500).json({ error: "Falha ao fazer logout." });
    }
    res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (err) {
    console.error("Erro inesperado no logout:", err.message);
    res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
  }
};
