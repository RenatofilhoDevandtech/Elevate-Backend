// src/routes/pathRoutes.js
const express = require("express");
const router = express.Router();
const pathController = require("../controllers/pathController");
const { protect } = require("../middlewares/authMiddleware"); // Caminho padronizado do middleware
const authorize = require("../middlewares/adminAuthMiddleware"); // Importa o middleware de autorização para admin

// --- ROTAS PÚBLICAS / ACESSÍVEIS PARA LOGADOS ---
// Rota para listar todas as trilhas (com filtros e paginação).
// Aplica 'protect' para adicionar req.user (se disponível) e calcular progresso,
// mas a rota ainda é acessível sem autenticação.
router.get("/", protect, pathController.getAllPaths);

// Rota para obter detalhes de uma trilha específica, incluindo módulos e conteúdos.
// Esta rota é pública, permitindo que qualquer um explore as trilhas.
router.get("/:id", pathController.getPathById);

// --- ROTAS ADMINISTRATIVAS (SUGESTÃO) ---
// Estas rotas SÃO PROTEGIDAS e acessíveis apenas a usuários administradores.
// O middleware `authorize(['admin'])` garante isso.

// Rota para adicionar/atualizar um conteúdo de vídeo do YouTube (curadoria)
// REQUER: Autenticação (protect) E role de 'admin' (authorize).
router.post(
  "/admin/contents/youtube",
  protect,
  authorize(["admin"]), // Garante que apenas admins possam usar esta rota
  pathController.upsertYoutubeContent
);

// Exemplo de outras rotas administrativas para Paths/Modules/Contents (CRUD completo via API)
// router.post('/admin/paths', protect, authorize(['admin']), pathController.createPath);
// router.put('/admin/paths/:id', protect, authorize(['admin']), pathController.updatePath);
// router.delete('/admin/paths/:id', protect, authorize(['admin']), pathController.deletePath);
// router.post('/admin/modules', protect, authorize(['admin']), pathController.createModule);
// router.put('/admin/modules/:id', protect, authorize(['admin']), pathController.updateModule);
// router.delete('/admin/contents/:id', protect, authorize(['admin']), pathController.deleteContent);

module.exports = router;