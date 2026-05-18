const express = require("express");

const router = express.Router();

const AgendamentoUsuarioController = require("../controllers/MeusAgendamentosController");

router.post("/", AgendamentoUsuarioController.create);

router.get("/", AgendamentoUsuarioController.index);

router.get("/paciente/:pacienteId", AgendamentoUsuarioController.listarPorPaciente);

router.patch("/:id/status", AgendamentoUsuarioController.updateStatus);

router.delete("/:id", AgendamentoUsuarioController.delete);

module.exports = router;