// src/controllers/authController.js
const supabase = require('../config/supabaseClient');

// Função para registrar um novo usuário
exports.register = async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Sua senha deve ter pelo menos 6 caracteres." });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name,
        }
      }
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        return res.status(409).json({ error: "Este e-mail já está em uso." });
      }
      throw error;
    }
    
    return res.status(201).json({ 
        message: 'Usuário registrado com sucesso! Verifique seu e-mail para confirmação.', 
        user: data.user 
    });

  } catch (err) {
    console.error('Erro no registro:', err.message);
    return res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

// Função para fazer login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    res.status(200).json({
      message: 'Login bem-sucedido!',
      user: data.user,
      token: data.session.access_token,
    });

  } catch (err) {
    console.error('Erro no login:', err.message);
    return res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

// Função para buscar os dados do usuário logado (rota protegida)
exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};