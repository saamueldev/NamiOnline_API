const express = require("express");

const router = express.Router();

const ConsultaController = require("../controllers/ConsultaControllers");

router.post("/", ConsultaController.create);

router.get("/", ConsultaController.index);

router.patch("/:id/status", ConsultaController.updateStatus);

router.delete("/:id", ConsultaController.delete);

module.exports = router;