const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

// --- ROTA PÚBLICA ---
// Para validação externa do certificado por código único.
// Esta rota vem ANTES da proteção geral para não exigir login.
router.get('/validate/:uniqueCode', certificateController.validateCertificate);


// --- ROTAS PRIVADAS ---
// Aplica o middleware de proteção a todas as rotas abaixo desta linha.
router.use(protect);

// Lista os certificados do usuário logado
router.get('/', certificateController.listMyCertificates);

// Gera um novo certificado para o usuário logado
router.post('/generate', certificateController.generateCertificate);

// Permite que o usuário logado baixe seu certificado
router.get('/:id/download', certificateController.downloadCertificate);

module.exports = router;