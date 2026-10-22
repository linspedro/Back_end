const express = require("express");
const router = express.Router();

const aulasControle = require("../Controle/criarAulas");

router.get("/", aulasControle.listar);
router.get("/usuario/:id_usuario", aulasControle.listarPorUsuario);
router.get("/:id", aulasControle.buscar);
router.post("/criando_Aulas", aulasControle.Criar);
router.post("/gerar", aulasControle.gerarComIA);
router.delete("/:id", aulasControle.deletar);

module.exports = router;