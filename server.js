require("dotenv").config();
const express = require("express");
const cors = require("cors");
const patientRoutes = require("./src/routes/patientRoutes");
const especialtyRoutes = require("./src/routes/especialtyRoutes");
const doctorRoutes = require("./src/routes/doctorsRoutes");
const userRoutes = require("./src/routes/usersRoutes");
const scheduleRoutes = require("./src/routes/schedulesRoutes");

const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/pacientes", patientRoutes);
app.use("/api/especialidades", especialtyRoutes);
app.use("/api/medicos", doctorRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/agendamentos", scheduleRoutes);

// Rota de teste
app.get("/", (req, res) => {
    res.json({ 
        message: "ClinicFlow API está funcionando!", 
        version: "2.0.0",
        endpoints: {
            pacientes: "/api/pacientes",
            medicos: "/api/medicos", 
            especialidades: "/api/especialidades",
            usuarios: "/api/usuarios"
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📋 Endpoints disponíveis:`);
    console.log(`   • Pacientes: http://localhost:${PORT}/api/pacientes`);
    console.log(`   • Médicos: http://localhost:${PORT}/api/medicos`);
    console.log(`   • Especialidades: http://localhost:${PORT}/api/especialidades`);
    console.log(`   • Usuários: http://localhost:${PORT}/api/usuarios`);
});
