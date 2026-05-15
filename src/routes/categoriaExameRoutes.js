const express = require("express");

const {
  cadastrarCategoriaExame,
  listarCategoriasExame,
  buscarCategoriaExamePorId,
  atualizarCategoriaExame,
  excluirCategoriaExame,
} = require("../controllers/categoriaExameController");

const router = express.Router();

router.post("/", cadastrarCategoriaExame);
router.get("/", listarCategoriasExame);
router.get("/:id", buscarCategoriaExamePorId);
router.put("/:id", atualizarCategoriaExame);
router.delete("/:id", excluirCategoriaExame);

module.exports = router;