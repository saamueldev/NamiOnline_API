const express = require("express");
const router = express.Router();

const retornoController = require("../controllers/retornoController");

router.get("/", retornoController.listarRetornos);

router.post("/", retornoController.criarRetorno);

router.delete("/:id", retornoController.deletarRetorno);

module.exports = router;