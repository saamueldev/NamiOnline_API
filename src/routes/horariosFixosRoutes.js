const express = require("express");
const HorariosFixosController = require("../controllers/HorariosFixosController");

const router = express.Router();

router.get("/", HorariosFixosController.index);

module.exports = router;
