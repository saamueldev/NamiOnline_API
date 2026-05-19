const express = require("express");

const router = express.Router();

const {
  criarNotificacao,
  buscarNotificacoes,
  marcarComoLida,
  deletarNotificacao,
} = require("../controllers/notificacaoController");

router.post("/", criarNotificacao);

router.get("/", buscarNotificacoes);

router.patch(
  "/:id/lida",
  marcarComoLida
);

router.delete(
  "/:id",
  deletarNotificacao
);

module.exports = router;