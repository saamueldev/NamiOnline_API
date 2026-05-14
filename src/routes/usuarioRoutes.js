const express = require("express");
const usuarioController = require("../controllers/usuarioControllers");

const router = express.Router();

router.post("/", usuarioController.create); // POST http://localhost:3000/usuarios
router.post("/login", usuarioController.login); // POST http://localhost:3000/usuarios/login
router.get("/", usuarioController.index); // GET http://localhost:3000/usuarios
router.put("/:id", usuarioController.put); // PUT http://localhost:3000/usuarios/id
router.delete("/:id", usuarioController.destroy); // DELETE http://localhost:3000/usuarios/id
module.exports = router;
