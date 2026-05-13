const express = require("express");
const pacienteController = require("../controllers/pacienteControllers");

const router = express.Router();

router.post("/", pacienteController.create);
router.get("/", pacienteController.index);

module.exports = router;