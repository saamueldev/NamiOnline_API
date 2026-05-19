const express = require("express");

const {
  listarNoticias,
  buscarNoticiaPorId,
  cadastrarNoticia,
  atualizarNoticia,
  excluirNoticia,
} = require("../controllers/noticiasControllers");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", listarNoticias);
router.get("/:id", buscarNoticiaPorId);
router.post("/", authMiddleware, requireRole("admin"), cadastrarNoticia);
router.put("/:id", authMiddleware, requireRole("admin"), atualizarNoticia);
router.delete("/:id", authMiddleware, requireRole("admin"), excluirNoticia);

module.exports = router;
