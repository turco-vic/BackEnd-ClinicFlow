const usersModel = require("../models/usersModel");
const bcrypt = require("bcryptjs");

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await usersModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar usuário." });
    }
};

const authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body;       
        if (!email || !password) {
            return res.status(400).json({ message: "Email e senha são obrigatórios." });
        }
        const user = await usersModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.json({ 
            message: "Login realizado com sucesso", 
            user: userWithoutPassword 
        }); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao autenticar usuário." });
    }
};

const changePassword = async (req, res) => {
    try {
        const { email } = req.params;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Senha atual e nova senha são obrigatórias." });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Nova senha deve ter pelo menos 6 caracteres." });
        }
        const user = await usersModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        const isCurrentPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ message: "Senha atual incorreta." });
        }
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        const updatedUser = await usersModel.updateUser(user.id, user.nome, user.email, hashedNewPassword);
        const { password: _, ...userWithoutPassword } = updatedUser;
        return res.json({ 
            message: "Senha alterada com sucesso", 
            user: userWithoutPassword 
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao alterar senha." });
    }
};

module.exports = { 
    getUserByEmail, 
    authenticateUser, 
    changePassword 
};
