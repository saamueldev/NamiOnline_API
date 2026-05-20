const express = require("express");
const router = express.Router();

const retornoController = require("../controllers/retornoController");

// ==============================
// LISTAR RETORNOS
// ==============================
router.get("/", retornoController.listarRetornos);

// ==============================
// CRIAR RETORNO
// ==============================
router.post("/", retornoController.criarRetorno);

// ==============================
// DELETAR RETORNO
// ==============================
router.delete("/:id", retornoController.deletarRetorno);

module.exports = router;