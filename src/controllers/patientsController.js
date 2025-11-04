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
        const {patient_name, email, password, birth_date, cpf, number_phone } = req.body;
        if (!patient_name || !email || !password || !birth_date || !cpf || !number_phone) {
            return res.status(400).json({ message: "Todos campos devem ser preenchidos." });
        }
        const created = await patientsModel.createPatient(patient_name, email, password, birth_date, cpf, number_phone );
        console.log(email);
        return res.status(201).json(created);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao criar paciente." });
    }
};

const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await patientsModel.updateCard(id, req.body);
        if (!updated) return res.status(404).json({ message: "Carta não encontrada ou sem campos para atualizar." });
        return res.json(updated);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar carta." });
    }
};

const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await patientsModel.deleteCard(id);
        if (!deleted) return res.status(404).json({ message: "Carta não encontrada." });
        return res.status(200).json({ message: "Carta removida com sucesso." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao deletar carta." });
    }
};

module.exports = { getAllPatients, getPatient, createPatient, updateCard, deleteCard };