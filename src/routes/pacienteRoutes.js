const express = require("express");
const pacienteController = require("../controllers/pacienteControllers");

const router = express.Router();

router.post("/", pacienteController.create);
router.get("/", pacienteController.index);
router.get("/cpf/:cpf", pacienteController.showByCpf);

module.exports = router;
