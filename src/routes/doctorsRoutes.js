const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorsController");
const upload = require("../config/upload.js");

// Rotas básicas CRUD
router.get("/", doctorController.getAllDoctors);
router.get("/search", doctorController.searchDoctors); 
router.get("/especialty/:especialty_id", doctorController.getDoctorsByEspecialty);
router.get("/:id", doctorController.getDoctor);
router.post("/", upload.single("doctor_photo"), doctorController.createDoctor);
router.put("/:id", upload.single("doctor_photo"), doctorController.updateDoctor);
router.delete("/:id", doctorController.deleteDoctor);

module.exports = router;