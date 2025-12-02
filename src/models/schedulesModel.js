const pool = require("../config/database");

const getSchedules = async () => {
    const result = await pool.query(
        `SELECT *
         FROM schedules`
    );
    return result.rows;
};

const getScheduleById = async (id) => {
    const result = await pool.query(
        `SELECT *
         FROM schedules
         WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};

const createSchedule = async (patient_id, doctor_id, consult_date, consult_hour) => {
    const result = await pool.query(
        `INSERT INTO schedules (patient_id, doctor_id, consult_date, consult_hour)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [patient_id, doctor_id, consult_date, consult_hour]
    );
    return result.rows[0];
};

const updateSchedule = async (id, patient_id, doctor_id, consult_date, consult_hour) => {
    const result = await pool.query(
        `UPDATE schedules
         SET patient_id = $1,
             doctor_id = $2,
             consult_date = $3,
             consult_hour = $4
         WHERE id = $5
         RETURNING *`,
        [patient_id, doctor_id, consult_date, consult_hour, id]
    );
    return result.rows[0];
};

const deleteSchedule = async (id) => {
    const result = await pool.query(
        `DELETE FROM schedules
         WHERE id = $1
         RETURNING *`,
        [id]
    );
    return result.rows[0];
};

module.exports = {
    getSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule
};