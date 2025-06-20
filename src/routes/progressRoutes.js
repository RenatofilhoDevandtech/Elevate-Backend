// src/routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware'); // Caminho padronizado

// Aplica o middleware de proteção a todas as rotas neste arquivo.
// Todas as operações de progresso exigem que o usuário esteja logado.
router.use(protect);

// Rota para buscar o status de conclusão de todos os conteúdos do usuário.
router.get('/status', progressController.getCompletionStatus);

// Rota para marcar um conteúdo específico como concluído (ou em progresso, etc.).
router.post('/mark-complete', progressController.updateContentProgress);

// Rota para deletar o progresso de um conteúdo (se você tiver essa funcionalidade).
router.delete('/:content_id', progressController.deleteContentProgress);

module.exports = router;