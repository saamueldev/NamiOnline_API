const express = require("express");
const router = express.Router();

const notificacaoController = require("../controllers/notificacaoController");

router.get("/", notificacaoController.listarNotificacoes);

router.post("/", notificacaoController.criarNotificacao);

router.put("/:id", notificacaoController.marcarComoLida);

module.exports = router;