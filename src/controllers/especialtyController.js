const especialtysModel = require("../models/especialtysModel");

const getAllEspecialtys = async (req, res) => {
    try {
        const especialtys = await especialtysModel.getEspecialtys();
        return res.json(especialtys);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar especialidades." });
    }
};

const getEspecialty = async (req, res) => {
    try {
        const { id } = req.params;
        const especialty = await especialtysModel.getEspecialtyById(id);
        if (!especialty) return res.status(404).json({ message: "Especialidade não encontrada." });
        return res.json(especialty);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar especialidade." });
    }
};

const createEspecialty = async (req, res) => {
    try {
        const { especialty } = req.body;
        if (!especialty) {
            return res.status(400).json({ message: "Campo 'especialty' deve ser preenchido." });
        }
        const created = await especialtysModel.createEspecialty(especialty);
        return res.status(201).json(created);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao criar especialidade." });
    }
};

const updateEspecialty = async (req, res) => {
    try {
        const { id } = req.params;
        const { especialty } = req.body;
        const updatedEspecialty = await especialtysModel.updateEspecialty(id, especialty);
        if (!updatedEspecialty) return res.status(404).json({ message: "Especialidade não encontrada ou sem campos para atualizar." });
        return res.json(updatedEspecialty);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar especialidade." });
    }
};

const deleteEspecialty = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await especialtysModel.deleteEspecialty(id);
        if (!deleted) return res.status(404).json({ message: "Especialidade não encontrada." });
        return res.status(200).json({ message: "Especialidade removida com sucesso." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao deletar especialidade." });
    }
};

module.exports = { getAllEspecialtys, getEspecialty, createEspecialty, updateEspecialty, deleteEspecialty };