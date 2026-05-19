const express = require("express");
const router = express.Router();

const retornoController = require("../controllers/retornoController");

// LISTAR retornos
router.get("/", retornoController.listarRetornos);

// CRIAR retorno
router.post("/", retornoController.criarRetorno);

// DELETAR retorno
router.delete("/:id", retornoController.deletarRetorno);

module.exports = router;