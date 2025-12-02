require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./src/config/database');

async function updateAllPasswords() {
    try {
        console.log('🔄 Buscando todos os usuários...');
        
        const result = await pool.query('SELECT id, email, password FROM users');
        const users = result.rows;
        
        console.log(`📊 Encontrados ${users.length} usuários`);
        console.log('🔐 Criptografando senhas...\n');
        
        let updated = 0;
        let skipped = 0;
        
        for (const user of users) {
            if (user.password && user.password.startsWith('$2b$')) {
                console.log(`⏭️  ${user.email} - senha já criptografada`);
                skipped++;
                continue;
            }
            
            const hashedPassword = await bcrypt.hash(user.password, 10);
            
            await pool.query(
                'UPDATE users SET password = $1 WHERE id = $2',
                [hashedPassword, user.id]
            );
            
            console.log(`✅ ${user.email} - senha atualizada`);
            updated++;
        }
        
        console.log('\n✨ Processo concluído!');
        console.log(`   ${updated} senhas criptografadas`);
        console.log(`   ${skipped} senhas já estavam criptografadas`);
        
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error.message);
        await pool.end();
        process.exit(1);
    }
}

updateAllPasswords();
