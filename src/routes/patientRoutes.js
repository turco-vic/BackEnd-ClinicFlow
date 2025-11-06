const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientsController");

router.get("/", patientController.getAllPatients);
router.get("/:id", patientController.getPatient);
router.post("/", patientController.createPatient);
//router.put("/:id", patientController.updateCard);
//router.delete("/:id", patientController.deleteCard);

module.exports = router;