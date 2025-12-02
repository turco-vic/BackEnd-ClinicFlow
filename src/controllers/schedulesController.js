const schedulesModel = require("../models/schedulesModel");

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await schedulesModel.getSchedules();
        return res.json(schedules);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar agendamentos." });
    }
};

const getSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await schedulesModel.getScheduleById(id);
        if (!schedule) return res.status(404).json({ message: "Agendamento não encontrado." });
        return res.json(schedule);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar agendamento." });
    }
};

const createSchedule = async (req, res) => {
    try {
        const { patient_id, doctor_id, consult_date, consult_hour } = req.body;

        if (!patient_id || !doctor_id || !consult_date || !consult_hour) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        const created = await schedulesModel.createSchedule(
            patient_id,
            doctor_id,
            consult_date,
            consult_hour
        );
        return res.status(201).json(created);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao criar agendamento." });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { patient_id, doctor_id, consult_date, consult_hour } = req.body;

        const updatedSchedule = await schedulesModel.updateSchedule(
            id,
            patient_id,
            doctor_id,
            consult_date,
            consult_hour
        );

        if (!updatedSchedule) {
            return res.status(404).json({ message: "Agendamento não encontrado ou sem campos para atualizar." });
        }

        return res.json(updatedSchedule);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar agendamento." });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await schedulesModel.deleteSchedule(id);
        if (!deleted) return res.status(404).json({ message: "Agendamento não encontrado." });
        return res.status(200).json({ message: "Agendamento removido com sucesso." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao deletar agendamento." });
    }
};

module.exports = {
    getAllSchedules,
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule
};