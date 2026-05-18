const express = require("express");
const especialidadeController = require("../controllers/especialidadeControllers");

const router = express.Router();

router.post("/", especialidadeController.create);
router.get("/", especialidadeController.index);

module.exports = router;
