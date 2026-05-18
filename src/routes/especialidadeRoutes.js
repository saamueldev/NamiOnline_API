
const express = require("express");
const especialidadeController = require("../controllers/especialidadeControllers");
// const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", especialidadeController.index);

// Rota protegida para uso futuro:
// router.post(
//   "/",
//   requireRole("admin"),
//   especialidadeController.create
// );

router.post("/", especialidadeController.create);

module.exports = router;
