const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientsController");

// Rotas básicas CRUD
router.get("/", patientController.getAllPatients);
router.get("/search", patientController.searchPatients); // Query: ?search=termo
router.get("/date-range", patientController.getPatientsByDateRange); // Query: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get("/cpf/:cpf", patientController.getPatientByCpf);
router.get("/:id", patientController.getPatient);
router.post("/", patientController.createPatient);
router.put("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);

module.exports = router;