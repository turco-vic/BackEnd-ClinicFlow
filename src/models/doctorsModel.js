const pool = require("../config/database");

const getDoctors = async () => {
    const result = await pool.query(
        `SELECT * FROM doctors`
    );
    return result.rows;
};

const getDoctorById = async (id) => {
    const result = await pool.query(
        `SELECT *
         FROM doctors
         WHERE id = $1`, [id]
    );
    return result.rows[0];
};

const createDoctor = async (doctor_name, email, password,birth_date, number_phone, especialty_id,doctor_photo) => {
    const result = await pool.query(
        `INSERT INTO doctors (name, email, password, birth_date, number_phone, especialty_id, doctor_photo)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [doctor_name, email, password, birth_date, number_phone, especialty_id, doctor_photo]
    );
    return result.rows[0];
};

const updateDoctor = async (id, doctor_name, email, password, birth_date, number_phone, especialty_id, doctor_photo) => {
    const result = await pool.query(
        `UPDATE doctors
         SET name = $1, email = $2, password = $3, birth_date = $4, number_phone = $5, especialty_id = $6, doctor_photo = $7
         WHERE id = $8 RETURNING *`,
        [doctor_name, email, password, birth_date, number_phone, especialty_id, doctor_photo, id]
    );
    return result.rows[0];
};

const deleteDoctor = async (id) => {
    const result = await pool.query(
        `DELETE FROM doctors WHERE id = $1 RETURNING *`, [id]
    );
    return result.rows[0];
};

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };