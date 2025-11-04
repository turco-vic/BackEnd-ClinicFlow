const pool = require("../config/database");

const getPatients = async () => {
    const result = await pool.query(
        `SELECT * FROM patients`
    );
    return result.rows;
};

const getPatientById = async (id) => {
    const result = await pool.query(
        `SELECT *
         FROM patients
         WHERE id = $1`, [id]
    );
    return result.rows[0];
};

const createPatient = async ({ patient_name, email, password, birth_date, cpf, number_phone }) => {
    const result = await pool.query(
        `INSERT INTO patients (patient_name, email, password, birth_date, cpf, number_phone)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [patient_name, email, password, birth_date, cpf, number_phone]
    );
    return result.rows[0];
};

const updatePatient = async (id, patient_name, email, password, birth_date, cpf, number_phone) => {
    const result = await pool.query(
        `UPDATE cards 
         SET patient_name = $1, email = $2, password = $3, birth_date = $4, cpf = $5, number_phone = $6 
         WHERE id = $7 RETURNING *`,
        [patient_name, email, password, birth_date, cpf, number_phone, id]
    );
    return result.rows[0];
};


const deletePatient = async (id) => {
    const result = await pool.query(
        `DELETE FROM patients WHERE id = $1 RETURNING *`, [id]
    );
    return result.rows[0];
};

module.exports = { getPatients, getPatientById, createPatient, updatePatient, deletePatient };