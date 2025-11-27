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
        const { nome, email, password, birth_date, number_phone, especialty_id } = req.body;
        
        // Verificar se o arquivo foi enviado pelo multer
        const doctor_photo = req.file ? req.file.path : null;
        
        if (!nome || !email || !password || !birth_date || !number_phone || !especialty_id) {
            return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos." });
        }
        const created = await doctorsModel.createDoctor(nome, email, password, birth_date, number_phone, especialty_id, doctor_photo);
        return res.status(201).json(created);
    } catch (error) {
        console.error(error);
        if (error.message === 'Email já está em uso') {
            return res.status(409).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro ao criar médico." });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, birth_date, number_phone, especialty_id } = req.body;
        
        // Se um novo arquivo foi enviado, usar o novo caminho, senão manter o existente
        const doctor_photo = req.file ? req.file.path : undefined;
        
        const updatedDoctor = await doctorsModel.updateDoctor(id, nome, email, birth_date, number_phone, especialty_id, doctor_photo);
        if (!updatedDoctor) return res.status(404).json({ message: "Médico não encontrado ou sem campos para atualizar." });
        return res.json(updatedDoctor);
    } catch (error) {
        console.error(error);
        if (error.message === 'Email já está em uso por outro usuário' || error.message === 'Médico não encontrado') {
            return res.status(409).json({ message: error.message });
        }
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

const getDoctorsByEspecialty = async (req, res) => {
    try {
        const { especialty_id } = req.params;
        const doctors = await doctorsModel.getDoctorsByEspecialty(especialty_id);
        return res.json(doctors);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar médicos por especialidade." });
    }
};

const searchDoctors = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ message: "Parâmetro de busca é obrigatório." });
        }
        const doctors = await doctorsModel.searchDoctors(search);
        return res.json(doctors);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar médicos." });
    }
};

module.exports = { getAllDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor, getDoctorsByEspecialty, searchDoctors };