// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware"); // Caminho padronizado

// Rota pública para registrar um novo usuário
router.post("/register", authController.register);

// Rota pública para fazer login
router.post("/login", authController.login);

// Rota protegida para obter os dados do usuário logado através do token
router.get("/me", protect, authController.getMe);

// Rota protegida para fazer logout
router.post("/logout", protect, authController.logout);

module.exports = router;