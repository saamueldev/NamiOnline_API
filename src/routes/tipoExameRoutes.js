const express = require("express");

const {
  cadastrarTipoExame,
  listarTiposExame,
  excluirTipoExame,
} = require("../controllers/tipoExameController");

const router = express.Router();

router.post("/", cadastrarTipoExame);
router.get("/", listarTiposExame);
router.delete("/:id", excluirTipoExame);

module.exports = router;