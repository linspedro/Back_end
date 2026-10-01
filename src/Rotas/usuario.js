const express = require("express");

const router = express.Router();
const usuarioController = require("../Controle/usuarios_controles");

router.get("/:id", usuarioController.buscarUsuario);
router.post("/criando_usuarios", usuarioController.criarUsuario);
router.post("/login", usuarioController.login);

module.exports = router;
