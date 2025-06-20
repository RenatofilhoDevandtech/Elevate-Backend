// src/routes/forumRoutes.js
const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");
const { protect } = require("../middlewares/authMiddleware"); // Middleware de autenticação

// --- ROTAS DE TÓPICOS ---
// Rota para listar todos os tópicos (pode ser pública para visualização por qualquer um)
router.get("/topics", forumController.listForumTopics);

// Rota protegida para criar um novo tópico (requer login)
router.post("/topics", protect, forumController.createForumTopic);

// Rota para obter detalhes de um tópico específico e seus posts (pode ser pública)
// Usamos :topicSlug para URLs mais amigáveis
router.get("/topics/:topicSlug", forumController.getForumTopicAndPosts);

// --- ROTAS DE POSTS ---
// Rota protegida para criar um novo post em um tópico específico (requer login)
router.post("/topics/:topicId/posts", protect, forumController.createForumPost);

// Rota protegida para atualizar um post específico (requer login, e só o autor)
router.put("/posts/:postId", protect, forumController.updateForumPost);

// Rota protegida para deletar um post específico (requer login, e só o autor)
router.delete("/posts/:postId", protect, forumController.deleteForumPost);

module.exports = router;
