const express = require("express");

const router = express.Router();

const aulasControle = require("../Controle/criarAulas")

router.get("/", aulasControle.listar )
router.get("/:id", aulasControle.buscar)
router.post("/criando_Aulas", aulasControle.Criar)
router.delete("/:id", aulasControle.deletar)
// router.get("/usuario/:id_usuario", aulaController.listarPorUsuario);



module.exports = router;