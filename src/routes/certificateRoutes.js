// src/routes/certificateRoutes.js
const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");
const { protect } = require("../middlewares/authMiddleware"); // Caminho padronizado

// --- ROTA PÚBLICA DE VALIDAÇÃO ---
// Esta rota é acessível por qualquer um, sem login, para validar um certificado.
// É colocada ANTES de `router.use(protect)` para garantir que não exija autenticação.
router.get("/validate/:uniqueCode", certificateController.validateCertificate);

// --- ROTAS PRIVADAS (EXIGEM AUTENTICAÇÃO) ---
// Aplica o middleware de proteção a todas as rotas abaixo desta linha.
router.use(protect);

// Rota para listar todos os certificados do usuário logado
router.get("/", certificateController.listMyCertificates);

// Rota para gerar um novo certificado para o usuário logado
router.post("/generate", certificateController.generateCertificate);

// Rota para permitir que o usuário logado baixe seu certificado específico
router.get("/:id/download", certificateController.downloadCertificate);

module.exports = router;