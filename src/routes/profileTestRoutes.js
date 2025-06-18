const express = require('express');
const router = express.Router();
const profileTestController = require('../controllers/profileTestController');
const { protect } = require('../middleware/authMiddleware');

// Aplica o middleware de proteção a todas as rotas neste arquivo
router.use(protect);

// Rota para buscar as perguntas do teste
router.get('/questions', profileTestController.getTestQuestions);

// Rota para enviar as respostas do teste
router.post('/submit', profileTestController.submitTestAnswers);

module.exports = router;