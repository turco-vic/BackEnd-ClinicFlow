const patientsModel = require("../models/patientsModel");

const getAllPatients = async (req, res) => {
    try {
        const patients = await patientsModel.getPatients();
        return res.json(patients);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar pacientes." });
    }
};

const getPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await patientsModel.getPatientById(id);
        if (!patient) return res.status(404).json({ message: "Paciente não encontrado." });
        return res.json(patient);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar paciente." });
    }
};

const createPatient = async (req, res) => {
    try {
        const { patient_name, email, password, birth_date, cpf, number_phone } = req.body;
        if (!patient_name || !email || !password || !birth_date || !cpf || !number_phone) {
            return res.status(400).json({ message: "Todos campos devem ser preenchidos." });
        }
        const created = await patientsModel.createPatient(patient_name, email, password, birth_date, cpf, number_phone);
        return res.status(201).json(created);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao criar paciente." });
    }
};

const updatePatient = async (req, res) => {
    try {
   const { id } = req.params;
        const { patient_name, email, password, birth_date, cpf, number_phone } = req.body;
        const updatedPatient = await patientsModel.updatePatient(id, patient_name, email, password, birth_date, cpf, number_phone);
        if (!updatedPatient) return res.status(404).json({ message: "Paciente não encontrado ou sem campos para atualizar." });
        return res.json(updatedPatient);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar paciente." });
    }
};

const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await patientsModel.deletePatient(id);
        if (!deleted) return res.status(404).json({ message: "Paciente não encontrado." });
        return res.status(200).json({ message: "Paciente removido com sucesso." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao deletar paciente." });
    }
};

module.exports = { getAllPatients, getPatient, createPatient, updatePatient, deletePatient };