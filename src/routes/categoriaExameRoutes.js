const express = require("express");

const {
  cadastrarCategoriaExame,
  listarCategoriasExame,
  buscarCategoriaExamePorId,
  atualizarCategoriaExame,
  excluirCategoriaExame,
} = require("../controllers/categoriaExameController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", listarCategoriasExame);
router.get("/:id", buscarCategoriaExamePorId);

router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  cadastrarCategoriaExame
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  atualizarCategoriaExame
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  excluirCategoriaExame
);


module.exports = router;