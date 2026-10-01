const express = require("express");

const router = express.Router();
const planejamentoController = require("../Controle/planejamento_controle");

router.get("/", planejamentoController.listar )
router.get("/:id", planejamentoController.buscar)
router.post("/criando_planejamento", planejamentoController.criar)
router.delete("/:id", planejamentoController.deletar)
router.get("/usuario/:id_usuario", planejamentoController.listarPorUsuario);



module.exports = router;