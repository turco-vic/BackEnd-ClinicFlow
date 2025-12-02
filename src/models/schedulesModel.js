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
    let updateQuery = 'UPDATE schedules SET ';
    let updateParams = [];
    let paramCount = 1;
    
    if (patient_id) {
        updateQuery += `patient_id = $${paramCount}, `;
        updateParams.push(patient_id);
        paramCount++;
    }
    
    if (doctor_id) {
        updateQuery += `doctor_id = $${paramCount}, `;
        updateParams.push(doctor_id);
        paramCount++;
    }
    
    if (consult_date) {
        updateQuery += `consult_date = $${paramCount}, `;
        updateParams.push(consult_date);
        paramCount++;
    }
    
    if (consult_hour) {
        updateQuery += `consult_hour = $${paramCount}, `;
        updateParams.push(consult_hour);
        paramCount++;
    }
    
    if (updateParams.length === 0) {
        return null;
    }
    
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE id = $${paramCount} RETURNING *`;
    updateParams.push(id);
    
    const result = await pool.query(updateQuery, updateParams);
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