const express = require("express");
const medicoController = require("../controllers/medicoControllers");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", medicoController.list);
router.get("/:id", medicoController.index);

router.post("/", requireRole("admin"), medicoController.create);
router.patch("/:id", requireRole("admin"), medicoController.patch);
router.delete("/:id", requireRole("admin"), medicoController.delete);

module.exports = router;
