// src/routes/pathRoutes.js
const express = require('express');
const router = express.Router();
const pathController = require('../controllers/pathController');
const { protect } = require('../middleware/authMiddleware');

// Rota pública para listar todas as trilhas. Já estava correta.
router.get('/', pathController.getAllPaths);

// ALTERAÇÃO: Removemos o 'protect' daqui.
// Agora, esta rota é PÚBLICA. Qualquer um pode buscar os detalhes de uma trilha.
// A proteção será feita no frontend para AÇÕES específicas (como assistir).
router.get('/:id', pathController.getPathById);

module.exports = router;