const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");

router.post("/login", userController.authenticateUser);

router.get("/email/:email", userController.getUserByEmail);

router.put("/change-password/:email", userController.changePassword);

module.exports = router;