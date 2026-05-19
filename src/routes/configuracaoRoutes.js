const express = require("express");
const router = express.Router();

const configuracaoController = require("../controllers/configuracaoController");

// buscar config
router.get("/", configuracaoController.buscarConfiguracoes);

// salvar tema
router.post("/tema", configuracaoController.salvarTema);

module.exports = router;