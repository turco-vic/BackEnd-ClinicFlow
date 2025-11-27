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
            const {nome, email, password, birth_date, cpf, number_phone } = req.body;
            if (!nome || !email || !password || !birth_date || !cpf || !number_phone) {
                return res.status(400).json({ message: "Todos campos devem ser preenchidos." });
            }
            const created = await patientsModel.createPatient(nome, email, password, birth_date, cpf, number_phone );
            return res.status(201).json(created);
        } catch (error) {
            console.error(error);
            if (error.message === 'Email já está em uso' || error.message === 'CPF já está cadastrado') {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro ao criar paciente." });
        }
    };

    const updatePatient = async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, email, birth_date, cpf, number_phone } = req.body;
            const updatedPatient = await patientsModel.updatePatient(id, nome, email, birth_date, cpf, number_phone);
            if (!updatedPatient) return res.status(404).json({ message: "Paciente não encontrado ou sem campos para atualizar." });
            return res.json(updatedPatient);
        } catch (error) {
            console.error(error);
            if (error.message === 'Email já está em uso por outro usuário' || error.message === 'CPF já está cadastrado para outro paciente' || error.message === 'Paciente não encontrado') {
                return res.status(409).json({ message: error.message });
            }
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

    const getPatientByCpf = async (req, res) => {
        try {
            const { cpf } = req.params;
            const patient = await patientsModel.getPatientByCpf(cpf);
            if (!patient) return res.status(404).json({ message: "Paciente não encontrado." });
            return res.json(patient);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar paciente." });
        }
    };

    const searchPatients = async (req, res) => {
        try {
            const { search } = req.query;
            if (!search) {
                return res.status(400).json({ message: "Parâmetro de busca é obrigatório." });
            }
            const patients = await patientsModel.searchPatients(search);
            return res.json(patients);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar pacientes." });
        }
    };

    const getPatientsByDateRange = async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Data de início e fim são obrigatórias." });
            }
            const patients = await patientsModel.getPatientsByDateRange(startDate, endDate);
            return res.json(patients);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar pacientes por faixa de data." });
        }
    };

    module.exports = { getAllPatients, getPatient, createPatient, updatePatient, deletePatient, getPatientByCpf, searchPatients, getPatientsByDateRange };