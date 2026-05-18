const express = require("express");
const medicoController = require("../controllers/medicoControllers");
// const authMiddleware = require("../middlewares/authMiddleware");
// const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", medicoController.list);
router.get("/:id", medicoController.index);

// Rotas protegidas para uso futuro:
// router.post("/", authMiddleware, requireRole("admin"), medicoController.create);
// router.patch("/:id", authMiddleware, requireRole("admin"), medicoController.patch);
// router.delete("/:id", authMiddleware, requireRole("admin"), medicoController.delete);

router.post("/", medicoController.create);
router.patch("/:id", medicoController.patch);
router.delete("/:id", medicoController.delete);

module.exports = router;
