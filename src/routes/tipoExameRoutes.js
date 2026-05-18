const express = require("express");

const {
  cadastrarTipoExame,
  listarTiposExame,
  buscarTipoExamePorId,
  atualizarTipoExame,
  excluirTipoExame,
} = require("../controllers/tipoExameController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", listarTiposExame);
router.get("/:id", buscarTipoExamePorId);

router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  cadastrarTipoExame
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  atualizarTipoExame
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  excluirTipoExame
);


module.exports = router;