const express = require("express");

const {
  listarEventos,
  buscarEventoPorId,
  cadastrarEvento,
  atualizarEvento,
  excluirEvento,
} = require("../controllers/eventosController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", listarEventos);
router.get("/:id", buscarEventoPorId);
router.post("/", authMiddleware, requireRole("admin"), cadastrarEvento);
router.put("/:id", authMiddleware, requireRole("admin"), atualizarEvento);
router.delete("/:id", authMiddleware, requireRole("admin"), excluirEvento);

module.exports = router;
