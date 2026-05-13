const express = require("express");
const medicoController = require("../controllers/medicoControllers");

const router = express.Router();

router.post("/", medicoController.create);
router.get("/", medicoController.index); 

module.exports = router;