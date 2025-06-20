// src/middlewares/authMiddleware.js
const supabase = require("../config/supabaseClient");

const protect = async (req, res, next) => {
  let token;

  // Verifica se o cabeçalho de autorização existe e começa com "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Se o token não for encontrado, retorna erro de não autorizado
  if (!token) {
    return res
      .status(401)
      .json({ error: "Não autorizado. Token de autenticação não fornecido." });
  }

  try {
    // Usa o Supabase para verificar a validade do token e obter os dados do usuário
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    // Se houver erro na verificação ou o usuário não for encontrado, o token é inválido
    if (error || !user) {
      console.error(
        "Erro na verificação do token Supabase:",
        error?.message || "Usuário não encontrado com o token fornecido."
      );
      return res
        .status(401)
        .json({ error: "Não autorizado. Token inválido ou expirado." });
    }

    // Anexa o objeto 'user' à requisição para que os controllers possam acessá-lo
    req.user = user;

    // Continua para a próxima função (o controller da rota)
    next();
  } catch (error) {
    // Captura erros inesperados durante o processo de verificação do token
    console.error(
      "Erro inesperado durante o middleware de autenticação:",
      error.message
    );
    return res
      .status(500)
      .json({
        error: "Ocorreu um erro interno no servidor durante a autenticação.",
      });
  }
};

module.exports = { protect };
