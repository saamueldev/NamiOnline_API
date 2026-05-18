const express = require("express");

const agendaBloqueioController = require(
  "../controllers/agendaBloqueioController"
);

const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  requireRole("admin"),
  agendaBloqueioController.create
);

router.get(
  "/",
  requireRole("admin"),
  agendaBloqueioController.index
);

router.get(
  "/:id",
  requireRole("admin"),
  agendaBloqueioController.show
);

router.put(
  "/:id",
  requireRole("admin"),
  agendaBloqueioController.update
);

router.delete(
  "/:id",
  requireRole("admin"),
  agendaBloqueioController.delete
);

module.exports = router;