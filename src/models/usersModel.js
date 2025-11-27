// src/models/usersModel.js
const pool = require("../config/database");

const getUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`, 
        [email]
    );
    return result.rows[0];
};

const createUser = async (nome, email, password, role) => {
    const result = await pool.query(
        `INSERT INTO users (nome, email, password, role) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [nome, email, password, role]
    );
    return result.rows[0];
};

const updateUser = async (id, nome, email, password) => {
    const result = await pool.query(
        `UPDATE users SET nome = $1, email = $2, password = $3 
         WHERE id = $4 RETURNING *`,
        [nome, email, password, id]
    );
    return result.rows[0];
};

module.exports = { getUserByEmail, createUser, updateUser };