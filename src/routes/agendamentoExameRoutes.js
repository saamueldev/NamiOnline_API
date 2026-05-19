const express = require("express");

const {
  cadastrarAgendamentoExame,
  cadastrarAgendamentoExameAdmin,
  listarHorariosDisponiveis,
  listarDisponibilidadeMensal,
  listarMeusAgendamentosExame,
  listarTodosAgendamentosExame,
  cancelarAgendamentoExame,
} = require("../controllers/agendamentoExameController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, cadastrarAgendamentoExame);

router.post(
  "/admin",
  authMiddleware,
  requireRole("admin"),
  cadastrarAgendamentoExameAdmin
);

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