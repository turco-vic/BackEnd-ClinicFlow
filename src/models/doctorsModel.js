const pool = require("../config/database");
const bcrypt = require("bcryptjs");

const getDoctors = async () => {
    const result = await pool.query(
        `SELECT d.id, u.nome, u.email, d.name, d.birth_date, d.number_phone, 
                d.especialty_id, d.doctor_photo, e.especialty
         FROM doctors d 
         JOIN users u ON d.user_id = u.id
         JOIN especialtys e ON d.especialty_id = e.id
         ORDER BY u.nome`
    );
    return result.rows;
};

const getDoctorById = async (id) => {
    const result = await pool.query(
        `SELECT d.id, d.user_id, d.name, u.nome, u.email, d.birth_date, d.number_phone, 
                d.especialty_id, d.doctor_photo, e.especialty
         FROM doctors d 
         JOIN users u ON d.user_id = u.id
         JOIN especialtys e ON d.especialty_id = e.id
         WHERE d.id = $1`, 
        [id]
    );
    return result.rows[0];
};

const getDoctorByUserId = async (user_id) => {
    const result = await pool.query(
        `SELECT d.id, d.user_id, d.name, u.nome, u.email, d.birth_date, d.number_phone, 
                d.especialty_id, d.doctor_photo, e.especialty
         FROM doctors d 
         JOIN users u ON d.user_id = u.id
         JOIN especialtys e ON d.especialty_id = e.id
         WHERE d.user_id = $1`, 
        [user_id]
    );
    return result.rows[0];
};

const createDoctor = async (nome, email, password, name, birth_date, number_phone, especialty_id, doctor_photo) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const existingUser = await client.query(
            'SELECT id FROM users WHERE email = $1', 
            [email]
        );
        
        if (existingUser.rows.length > 0) {
            throw new Error('Email já está em uso');
        }
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userResult = await client.query(
            `INSERT INTO users (nome, email, password, role) 
             VALUES ($1, $2, $3, 'MEDICO') RETURNING id`,
            [nome, email, hashedPassword]
        );
        
        const doctorResult = await client.query(
            `INSERT INTO doctors (user_id, name, birth_date, number_phone, especialty_id, doctor_photo) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [userResult.rows[0].id, name, birth_date, number_phone, especialty_id, doctor_photo]
        );
        
        await client.query('COMMIT');
        
        const completeDoctorData = await getDoctorById(doctorResult.rows[0].id);
        return completeDoctorData;
        
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const updateDoctor = async (id, nome, email, name, birth_date, number_phone, especialty_id, doctor_photo) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const doctorData = await client.query(
            'SELECT user_id FROM doctors WHERE id = $1',
            [id]
        );
        
        if (doctorData.rows.length === 0) {
            throw new Error('Médico não encontrado');
        }
        
        const user_id = doctorData.rows[0].user_id;
        
        if (email) {
            const existingUser = await client.query(
                'SELECT id FROM users WHERE email = $1 AND id != $2', 
                [email, user_id]
            );
            
            if (existingUser.rows.length > 0) {
                throw new Error('Email já está em uso por outro usuário');
            }
        }
        
        if (nome || email) {
            let updateUserQuery = 'UPDATE users SET ';
            let updateUserParams = [];
            let paramCount = 1;
            
            if (nome) {
                updateUserQuery += `nome = $${paramCount}, `;
                updateUserParams.push(nome);
                paramCount++;
            }
            
            if (email) {
                updateUserQuery += `email = $${paramCount}, `;
                updateUserParams.push(email);
                paramCount++;
            }
            
            updateUserQuery = updateUserQuery.slice(0, -2);
            updateUserQuery += ` WHERE id = $${paramCount}`;
            updateUserParams.push(user_id);
            
            await client.query(updateUserQuery, updateUserParams);
        }
        
        let updateDoctorQuery = 'UPDATE doctors SET ';
        let updateDoctorParams = [];
        let paramCount = 1;
        
        if (name) {
            updateDoctorQuery += `name = $${paramCount}, `;
            updateDoctorParams.push(name);
            paramCount++;
        }

        if (birth_date) {
            updateDoctorQuery += `birth_date = $${paramCount}, `;
            updateDoctorParams.push(birth_date);
            paramCount++;
        }
        
        if (number_phone) {
            updateDoctorQuery += `number_phone = $${paramCount}, `;
            updateDoctorParams.push(number_phone);
            paramCount++;
        }
        
        if (especialty_id) {
            updateDoctorQuery += `especialty_id = $${paramCount}, `;
            updateDoctorParams.push(especialty_id);
            paramCount++;
        }
        
        if (doctor_photo !== undefined) { // Permite valores null
            updateDoctorQuery += `doctor_photo = $${paramCount}, `;
            updateDoctorParams.push(doctor_photo);
            paramCount++;
        }
        
        if (updateDoctorParams.length > 0) {
            updateDoctorQuery = updateDoctorQuery.slice(0, -2);
            updateDoctorQuery += ` WHERE id = $${paramCount}`;
            updateDoctorParams.push(id);
            
            await client.query(updateDoctorQuery, updateDoctorParams);
        }
        
        await client.query('COMMIT');
        
        const updatedDoctor = await getDoctorById(id);
        return updatedDoctor;
        
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const deleteDoctor = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const doctorData = await getDoctorById(id);
        
        if (!doctorData) {
            return null;
        }
        
        await client.query(
            'DELETE FROM doctors WHERE id = $1', 
            [id]
        );
        
        await client.query('COMMIT');
        return doctorData;
        
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getDoctorsByEspecialty = async (especialty_id) => {
    const result = await pool.query(
        `SELECT d.id, u.nome, u.email, d.name, d.birth_date, d.number_phone, 
                d.especialty_id, d.doctor_photo, e.especialty
         FROM doctors d 
         JOIN users u ON d.user_id = u.id
         JOIN especialtys e ON d.especialty_id = e.id
         WHERE d.especialty_id = $1
         ORDER BY u.nome`,
        [especialty_id]
    );
    return result.rows;
};

const searchDoctors = async (searchTerm) => {
    const result = await pool.query(
        `SELECT d.id, u.nome, u.email, d.name, d.birth_date, d.number_phone, 
                d.especialty_id, d.doctor_photo, e.especialty
         FROM doctors d 
         JOIN users u ON d.user_id = u.id
         JOIN especialtys e ON d.especialty_id = e.id
         WHERE u.nome ILIKE $1 OR e.especialty ILIKE $1
         ORDER BY u.nome`,
        [`%${searchTerm}%`]
    );
    return result.rows;
};

module.exports = { 
    getDoctors, 
    getDoctorById, 
    getDoctorByUserId,
    createDoctor, 
    updateDoctor, 
    deleteDoctor, 
    getDoctorsByEspecialty,
    searchDoctors 
};