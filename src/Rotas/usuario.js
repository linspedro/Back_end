const express = require("express");

const router = express.Router();

const { criarUsuario } = require("../Controle/usuarios_controles");

router.post("/usuarios", criarUsuario);

module.exports = router;