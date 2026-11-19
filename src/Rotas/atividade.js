const express = require("express");
const router = express.Router();

const atividadeControle = require("../Controle/atividade_controles");

router.get("/", atividadeControle.listar);
router.get("/usuario/:id_usuario", atividadeControle.listarPorUsuario);
router.get("/:id", atividadeControle.buscar);
router.post("/", atividadeControle.Criar);
router.post("/gerar", atividadeControle.gerarComIA);
router.put("/:id", atividadeControle.atualizar);
router.delete("/:id", atividadeControle.deletar);

module.exports = router;