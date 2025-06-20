// src/index.js
require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env (DEVE SER A PRIMEIRA LINHA)
const express = require("express");
const cors = require("cors"); // Para permitir requisições de outras origens

const app = express();
const PORT = process.env.PORT || 3001; // Porta do servidor, padrão 3001

// --- Middlewares Essenciais ---
// Configuração do CORS (Cross-Origin Resource Sharing)
// Em desenvolvimento, permite todas as origens. Para produção, restrinja a domínios específicos.
app.use(cors()); 

// Middlewares para analisar o corpo das requisições
app.use(express.json()); // Habilita o parsing de corpos de requisição JSON
app.use(express.urlencoded({ extended: true })); // Habilita o parsing de corpos de requisição URL-encoded

// --- Registro de Todas as Rotas da API Elevate ---
// Organização das rotas por funcionalidade para clareza e modularidade.
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/paths", require("./routes/pathRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/profile-test", require("./routes/profileTestRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/forum", require("./routes/forumRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/subscribe", require("./routes/subscribeRoutes"));

// --- Rota Principal (Health Check) ---
// Uma rota simples para verificar se a API está funcionando.
app.get("/", (req, res) => res.status(200).json({ message: "API do Elevate está no ar! 🚀" }));

// --- Middlewares de Tratamento de Erro (Devem ser os ÚLTIMOS middlewares a serem definidos) ---

// 1. Captura requisições para rotas não existentes (Erro 404 Not Found)
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint não encontrado.", path: req.originalUrl });
});

// 2. Middleware de erro genérico para capturar quaisquer outros erros
// que ocorram em middlewares ou rotas. Retorna 500 Internal Server Error.
app.use((err, req, res, next) => {
  console.error("ERRO NO SERVIDOR:", err.stack); // Loga a pilha de erros para depuração detalhada
  res.status(500).json({
    error: "Ocorreu um erro interno no servidor.",
    details: err.message, // Detalhes do erro para o frontend (pode ser mais genérico em produção)
  });
});

// --- Inicia o Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor Elevate rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});