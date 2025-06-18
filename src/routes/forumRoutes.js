const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

// Rota para listar todos os tópicos (pode ser pública para visualização)
router.get('/topics', forumController.listForumTopics);

// Rota protegida para criar um novo tópico
router.post('/topics', protect, forumController.createForumTopic);

// Futuras rotas para posts dentro de um tópico poderiam ser adicionadas aqui
// ex: router.get('/topics/:slug/posts', ...)
// ex: router.post('/topics/:slug/posts', protect, ...)

module.exports = router;