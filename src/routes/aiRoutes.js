const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Rota protegida para interagir com o chat do simulador de entrevista
router.post('/interview-chat', protect, aiController.handleInterviewChat);

module.exports = router;