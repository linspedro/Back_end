const express = require("express");
const router = express.Router();

const { criar, listar } = require("../Controle/planejamentoConteudo_controle");

router.post("/", criar);
router.get("/:id_planejamento", listar);

module.exports = router;