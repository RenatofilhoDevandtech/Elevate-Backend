// src/routes/profileTestRoutes.js
const express = require('express');
const router = express.Router();
const profileTestController = require('../controllers/profileTestController');
const { protect } = require('../middlewares/authMiddleware'); // Caminho padronizado

// Aplica o middleware de proteção a todas as rotas neste arquivo.
// Todas as interações com o teste de perfil exigem que o usuário esteja logado.
router.use(protect);

// Rota para buscar as perguntas do teste de perfil.
router.get('/questions', profileTestController.getTestQuestions);

// Rota para enviar as respostas do teste de perfil.
router.post('/submit', profileTestController.submitTestAnswers);

module.exports = router;