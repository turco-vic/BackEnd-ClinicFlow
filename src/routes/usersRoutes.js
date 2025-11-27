const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");

// Rota de login/autenticação
router.post("/login", userController.authenticateUser);

// Buscar usuário por email
router.get("/email/:email", userController.getUserByEmail);

// Alterar senha
router.put("/change-password/:email", userController.changePassword);

module.exports = router;