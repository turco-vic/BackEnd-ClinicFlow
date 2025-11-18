const express = require("express");
const router = express.Router();
const especialtyController = require("../controllers/especialtyController");

router.get("/", especialtyController.getAllEspecialtys);
router.get("/:id", especialtyController.getEspecialty);
router.post("/", especialtyController.createEspecialty);
router.put("/:id", especialtyController.updateEspecialty);
router.delete("/:id", especialtyController.deleteEspecialty);

module.exports = router;