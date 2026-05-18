const express = require("express");
const guiaController = require("../controllers/GuiaControllers");

const router = express.Router();

router.post("/", guiaController.criar);
router.get("/", guiaController.listarPendentes);
router.get("/:pacienteId", guiaController.listarMinhasGuias);

module.exports = router;