const pool = require("../config/database");
const bcrypt = require("bcryptjs");

const getPatients = async () => {
    const result = await pool.query(
        `SELECT p.id, u.nome, u.email, p.birth_date, p.cpf, p.number_phone
         FROM patients p 
         JOIN users u ON p.user_id = u.id
         ORDER BY u.nome`
    );
    return result.rows;
};

const getPatientById = async (id) => {
    const result = await pool.query(
        `SELECT p.id, p.user_id, u.nome, u.email, p.birth_date, p.cpf, p.number_phone
         FROM patients p 
         JOIN users u ON p.user_id = u.id
         WHERE p.id = $1`, 
        [id]
    );
    return result.rows[0];
};

const getPatientByUserId = async (user_id) => {
    const result = await pool.query(
        `SELECT p.id, p.user_id, u.nome, u.email, p.birth_date, p.cpf, p.number_phone
         FROM patients p 
         JOIN users u ON p.user_id = u.id
         WHERE p.user_id = $1`, 
        [user_id]
    );
    return result.rows[0];
};

const getPatientByCpf = async (cpf) => {
    const result = await pool.query(
        `SELECT p.id, p.user_id, u.nome, u.email, p.birth_date, p.cpf, p.number_phone
         FROM patients p 
         JOIN users u ON p.user_id = u.id
         WHERE p.cpf = $1`, 
        [cpf]
    );
    return result.rows[0];
};

const createPatient = async (nome, email, password, birth_date, cpf, number_phone) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Verificar se o email já existe
        const existingUser = await client.query(
            'SELECT id FROM users WHERE email = $1', 
            [email]
        );
        
        if (existingUser.rows.length > 0) {
            throw new Error('Email já está em uso');
        }
        
        // Verificar se o CPF já existe
        const existingCpf = await client.query(
            'SELECT id FROM patients WHERE cpf = $1', 
            [cpf]
        );
        
        if (existingCpf.rows.length > 0) {
            throw new Error('CPF já está cadastrado');
        }
        
        // Hash da senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Criar usuário com role PACIENTE
        const userResult = await client.query(
            `INSERT INTO users (nome, email, password, role) 
             VALUES ($1, $2, $3, 'PACIENTE') RETURNING id`,
            [nome, email, hashedPassword]
        );
        
        // Criar paciente
        const patientResult = await client.query(
            `INSERT INTO patients (user_id, birth_date, cpf, number_phone) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userResult.rows[0].id, birth_date, cpf, number_phone]
        );
        
        await client.query('COMMIT');
        
        // Retornar dados completos do paciente criado
        const completePatientData = await getPatientById(patientResult.rows[0].id);
        return completePatientData;
        
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const updatePatient = async (id, nome, email, birth_date, cpf, number_phone) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Buscar o user_id do paciente
        const patientData = await client.query(
            'SELECT user_id FROM patients WHERE id = $1',
            [id]
        );
        
        if (patientData.rows.length === 0) {
            throw new Error('Paciente não encontrado');
        }
        
        const user_id = patientData.rows[0].user_id;
        
        // Verificar se o email já existe para outro usuário
        if (email) {
            const existingUser = await client.query(
                'SELECT id FROM users WHERE email = $1 AND id != $2', 
                [email, user_id]
            );
            
            if (existingUser.rows.length > 0) {
                throw new Error('Email já está em uso por outro usuário');
            }
        }
        
        // Verificar se o CPF já existe para outro paciente
        if (cpf) {
            const existingCpf = await client.query(
                'SELECT id FROM patients WHERE cpf = $1 AND id != $2', 
                [cpf, id]
            );
            
            if (existingCpf.rows.length > 0) {
                throw new Error('CPF já está cadastrado para outro paciente');
            }
        }
        
        // Atualizar dados do usuário (apenas campos fornecidos)
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
            
            // Remover a última vírgula e espaço
            updateUserQuery = updateUserQuery.slice(0, -2);
            updateUserQuery += ` WHERE id = $${paramCount}`;
            updateUserParams.push(user_id);
            
            await client.query(updateUserQuery, updateUserParams);
        }
        
        // Atualizar dados específicos do paciente (apenas campos fornecidos)
        let updatePatientQuery = 'UPDATE patients SET ';
        let updatePatientParams = [];
        let paramCount = 1;
        
        if (birth_date) {
            updatePatientQuery += `birth_date = $${paramCount}, `;
            updatePatientParams.push(birth_date);
            paramCount++;
        }
        
        if (cpf) {
            updatePatientQuery += `cpf = $${paramCount}, `;
            updatePatientParams.push(cpf);
            paramCount++;
        }
        
        if (number_phone) {
            updatePatientQuery += `number_phone = $${paramCount}, `;
            updatePatientParams.push(number_phone);
            paramCount++;
        }
        
        if (updatePatientParams.length > 0) {
            // Remover a última vírgula e espaço
            updatePatientQuery = updatePatientQuery.slice(0, -2);
            updatePatientQuery += ` WHERE id = $${paramCount}`;
            updatePatientParams.push(id);
            
            await client.query(updatePatientQuery, updatePatientParams);
        }
        
        await client.query('COMMIT');
        
        // Retornar dados atualizados completos
        const updatedPatient = await getPatientById(id);
        return updatedPatient;
        
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const deletePatient = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Buscar dados do paciente antes de deletar
        const patientData = await getPatientById(id);
        
        if (!patientData) {
            return null;
        }
        
        // Deletar paciente (CASCADE irá deletar o usuário automaticamente)
        await client.query(
            'DELETE FROM patients WHERE id = $1', 
            [id]
        );
        
        await client.query('COMMIT');
        return patientData;
        
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const searchPatients = async (searchTerm) => {
    const result = await pool.query(
        `SELECT p.id, u.nome, u.email, p.birth_date, p.cpf, p.number_phone
         FROM patients p 
         JOIN users u ON p.user_id = u.id
         WHERE u.nome ILIKE $1 OR p.cpf ILIKE $1 OR u.email ILIKE $1
         ORDER BY u.nome`,
        [`%${searchTerm}%`]
    );
    return result.rows;
};

const getPatientsByDateRange = async (startDate, endDate) => {
    const result = await pool.query(
        `SELECT p.id, u.nome, u.email, p.birth_date, p.cpf, p.number_phone
         FROM patients p 
         JOIN users u ON p.user_id = u.id
         WHERE p.birth_date BETWEEN $1 AND $2
         ORDER BY p.birth_date`,
        [startDate, endDate]
    );
    return result.rows;
};

module.exports = { 
    getPatients, 
    getPatientById, 
    getPatientByUserId,
    getPatientByCpf,
    createPatient, 
    updatePatient, 
    deletePatient,
    searchPatients,
    getPatientsByDateRange
};