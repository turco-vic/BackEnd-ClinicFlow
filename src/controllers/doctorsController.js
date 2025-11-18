const doctorsModel = require("../models/doctorsModel");

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorsModel.getDoctors();
        return res.json(doctors);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar médicos." });
    }
};

const getDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await doctorsModel.getDoctorById(id);
        if (!doctor) return res.status(404).json({ message: "Médico não encontrado." });
        return res.json(doctor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar médico." });
    }
};

const createDoctor = async (req, res) => {
    try {
        const { name, email, password, birth_date, number_phone, especialty_id, doctor_photo } = req.body;
        if (!name || !email || !password || !birth_date || !number_phone || !especialty_id) {
            return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos." });
        }
        const created = await doctorsModel.createDoctor(name, email, password, birth_date, number_phone, especialty_id, doctor_photo);
        return res.status(201).json(created);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao criar médico." });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, birth_date, number_phone, especialty_id, doctor_photo } = req.body;
        const updatedDoctor = await doctorsModel.updateDoctor(id, name, email, password, birth_date, number_phone, especialty_id, doctor_photo);
        if (!updatedDoctor) return res.status(404).json({ message: "Médico não encontrado ou sem campos para atualizar." });
        return res.json(updatedDoctor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar médico." });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await doctorsModel.deleteDoctor(id);
        if (!deleted) return res.status(404).json({ message: "Médico não encontrado." });
        return res.status(200).json({ message: "Médico removido com sucesso." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao deletar médico." });
    }
};

module.exports = { getAllDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor };