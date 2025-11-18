require("dotenv").config();
const express = require("express");
const cors = require("cors");
const patientRoutes = require("./src/routes/patientRoutes");
const especialtyRoutes = require("./src/routes/especialtyRoutes");
const doctorRoutes = require("./src/routes/doctorsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/pacientes", patientRoutes);
app.use("/api/especialidades", especialtyRoutes);
app.use("/api/doutores", doctorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
