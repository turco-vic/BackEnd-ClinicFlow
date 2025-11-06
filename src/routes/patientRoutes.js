const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientsController");

router.get("/", patientController.getAllPatients);
router.get("/:id", patientController.getPatient);
router.post("/", patientController.createPatient);
router.put("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);

module.exports = router;