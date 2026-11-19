const express = require("express");
const router = express.Router();

const {
  criar,
  listar,
  substituir,
} = require("../Controle/planejamentoConteudo_controle");

router.post("/", criar);
router.get("/:id_planejamento", listar);
router.put("/planejamento/:id_planejamento", substituir);

module.exports = router;