// src/routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { protect } = require("../middlewares/authMiddleware"); // Caminho padronizado

// Rota protegida para interagir com o chat do simulador de entrevista.
// O usuário precisa estar logado para usar o Mentor IA.
router.post("/interview-chat", protect, aiController.handleInterviewChat);

module.exports = router;