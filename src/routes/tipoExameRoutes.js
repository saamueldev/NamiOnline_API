const express = require("express");

const {
  cadastrarTipoExame,
  listarTiposExame,
  buscarTipoExamePorId,
  atualizarTipoExame,
  excluirTipoExame,
} = require("../controllers/tipoExameController");

const router = express.Router();

router.post("/", cadastrarTipoExame);
router.get("/", listarTiposExame);
router.get("/:id", buscarTipoExamePorId);
router.put("/:id", atualizarTipoExame);
router.delete("/:id", excluirTipoExame);

module.exports = router;