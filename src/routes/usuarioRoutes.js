const express = require("express");
const usuarioController = require("../controllers/usuarioControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", usuarioController.create); // POST http://localhost:3000/usuarios
router.post("/login", usuarioController.login); // POST http://localhost:3000/usuarios/login

//Hugo - Duas novas rotas para redefinir e recuperar senha (Precisa vir antes dos auth para não ser interpretado como ID)
router.post("/recuperar-senha", usuarioController.recuperarSenha); // POST http://localhost:3000/usuarios/recuperar-senha
router.put("/redefinir-senha/:token", usuarioController.redefinirSenha); // PUT http://localhost:3000/usuarios/redefinir-senha

router.get("/me", authMiddleware, usuarioController.me); // GET http://localhost:3000/usuarios/me
router.get("/", authMiddleware, usuarioController.index); // GET http://localhost:3000/usuarios
router.put("/:id", authMiddleware, usuarioController.put); // PUT http://localhost:3000/usuarios/id
router.delete("/:id", authMiddleware, usuarioController.destroy); // DELETE http://localhost:3000/usuarios/id
module.exports = router;
