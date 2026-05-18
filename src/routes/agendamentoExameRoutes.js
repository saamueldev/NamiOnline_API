const express = require("express");

const {
  cadastrarAgendamentoExame,
  listarHorariosDisponiveis,
  listarDisponibilidadeMensal,
  listarMeusAgendamentosExame,
  listarTodosAgendamentosExame,
  cancelarAgendamentoExame,
} = require("../controllers/agendamentoExameController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, cadastrarAgendamentoExame);

router.get(
  "/horarios-disponiveis",
  authMiddleware,
  listarHorariosDisponiveis
);

router.get(
  "/disponibilidade",
  authMiddleware,
  listarDisponibilidadeMensal
);

router.get("/meus", authMiddleware, listarMeusAgendamentosExame);

router.get("/", authMiddleware, listarTodosAgendamentosExame);

router.patch("/:id/cancelar", authMiddleware, cancelarAgendamentoExame);


module.exports = router;