// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares essenciais
app.use(cors()); // Permite requisições de outras origens (seu frontend)
app.use(express.json()); // Permite que o servidor entenda requisições com corpo em JSON
app.use(express.urlencoded({ extended: true }));

// --- Registrando todas as Rotas da API Elevate ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/paths', require('./routes/pathRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/profile-test', require('./routes/profileTestRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/subscribe', require('./routes/subscribeRoutes')); // Rota para registrar interesse em novas funcionalidades

// Rota principal para verificar se a API está no ar
app.get('/', (req, res) => res.status(200).json({ message: 'API do Elevate está no ar! 🚀' }));

// --- Middlewares de Tratamento de Erro (devem vir por último) ---

// 1. Captura requisições para rotas não existentes (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

// 2. Captura todos os outros erros que possam ocorrer nas rotas (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor Elevate rodando na porta ${PORT}`);
});