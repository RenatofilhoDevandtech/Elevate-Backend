const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// Aplica o middleware de proteção a todas as rotas neste arquivo
router.use(protect);

// Rota para buscar o status de conclusão de todos os conteúdos do usuário
router.get('/status', progressController.getCompletionStatus);

// Rota para marcar um conteúdo específico como concluído
router.post('/mark-complete', progressController.markContentComplete);

module.exports = router;