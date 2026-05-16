const express = require("express");
const router = express.Router();

const configuracaoController = require("../controllers/configuracaoController");

router.get("/", configuracaoController.buscarConfiguracoes);

router.post("/tema", configuracaoController.salvarTema);

router.post("/notificacoes", configuracaoController.alterarNotificacoes);

module.exports = router;