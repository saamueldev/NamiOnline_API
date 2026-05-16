const express = require("express");
const usuarioController = require("../controllers/usuarioControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", usuarioController.create); // POST http://localhost:3000/usuarios
router.post("/login", usuarioController.login); // POST http://localhost:3000/usuarios/login
router.get("/me", authMiddleware, usuarioController.me); // GET http://localhost:3000/usuarios/me
router.get("/", authMiddleware, usuarioController.index); // GET http://localhost:3000/usuarios
router.put("/:id", authMiddleware, usuarioController.put); // PUT http://localhost:3000/usuarios/id
router.delete("/:id", authMiddleware, usuarioController.destroy); // DELETE http://localhost:3000/usuarios/id
module.exports = router;
