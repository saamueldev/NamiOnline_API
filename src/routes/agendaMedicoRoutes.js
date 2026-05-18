const express = require("express");

const router = express.Router();

const AgendaMedicoController = require("../controllers/AgendaMedicoControllers");

router.post("/", AgendaMedicoController.create);

router.post("/gerar-dia", AgendaMedicoController.gerarAgendaDoDia);

router.get("/", AgendaMedicoController.index);

router.get("/disponiveis", AgendaMedicoController.listarDisponiveis);

router.get("/medico/:medicoId", AgendaMedicoController.listarPorMedico);

router.patch("/:id/disponibilidade", AgendaMedicoController.atualizarDisponibilidade);

router.delete("/:id", AgendaMedicoController.delete);

module.exports = router;