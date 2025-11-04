require("dotenv").config();
const express = require("express");
const cors = require("cors");
const patientRoutes = require("./src/routes/patientRoutes");
//const houseRoutes = require("./src/routes/houseRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/pacientes", patientRoutes);
//app.use("/api/houses", houseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
