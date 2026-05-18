const express = require("express");

const router = express.Router();

const MeusAgendamentosController = require("../controllers/MeusAgendamentosController");

router.get("/paciente/:pacienteId", MeusAgendamentosController.listarPorPaciente);

module.exports = router;