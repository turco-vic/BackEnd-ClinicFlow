const pool = require("../config/database");

const getEspecialtys = async () => {
    const result = await pool.query(
        `SELECT * FROM especialtys`
    );
    return result.rows;
};

const getEspecialtyById = async (id) => {
    const result = await pool.query(
        `SELECT *
         FROM especialtys
         WHERE id = $1`, [id]
    );
    return result.rows[0];
};

const createEspecialty = async (especialty) => {
    const result = await pool.query(
        `INSERT INTO especialtys (especialty)
         VALUES ($1) RETURNING *`,
        [especialty]
    );
    return result.rows[0];
};

const updateEspecialty = async (id, especialty) => {
    const result = await pool.query(
        `UPDATE especialtys
         SET especialty = $1
         WHERE id = $2 RETURNING *`,
        [especialty, id]
    );
    return result.rows[0];
};


const deleteEspecialty = async (id) => {
    const result = await pool.query(
        `DELETE FROM especialtys WHERE id = $1 RETURNING *`, [id]
    );
    return result.rows[0];
};

module.exports = { getEspecialtys, getEspecialtyById, createEspecialty, updateEspecialty, deleteEspecialty };