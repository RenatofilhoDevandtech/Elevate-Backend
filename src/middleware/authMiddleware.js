// src/middleware/authMiddleware.js
const supabase = require('../config/supabaseClient');

const protect = async (req, res, next) => {
  let token;

  // 1. Verifica se o header de autorização existe e começa com "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extrai o token do header
      token = req.headers.authorization.split(' ')[1];

      // 3. Usa o Supabase para verificar a validade do token e obter os dados do usuário
      const { data: { user }, error } = await supabase.auth.getUser(token);

      // 4. Se houver um erro ou o usuário não for encontrado, o token é inválido/expirado
      if (error || !user) {
        return res.status(401).json({ error: 'Não autorizado, token falhou.' });
      }

      // 5. Anexa o objeto 'user' à requisição para ser usado nos controllers
      req.user = user;
      
      // 6. Passa para a próxima função (o controller da rota)
      next();

    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Não autorizado.' });
    }
  }

  // 7. Se não houver token no header, retorna erro
  if (!token) {
    res.status(401).json({ error: 'Não autorizado, token não encontrado.' });
  }
};

module.exports = { protect };