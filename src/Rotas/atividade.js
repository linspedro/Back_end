const express = require("express");
const router = express.Router();

const {
  listar,
  buscar,
  Criar,
  deletar,
} = require("../Controle/atividade_controles");

router.get("/atividades", listar);
router.get("/atividades/:id", buscar);
router.post("/atividades", Criar);
router.delete("/atividades/:id", deletar);
// router.get("/usuario/:id_usuario", atividadeController.listarPorUsuario);

module.exports = router;