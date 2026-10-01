const { criar: criarConteudo, listarPorPlanejamento } = require("../modelos/planejamento_conteudo");

async function criar(req, res) {
  const { id_planejamento, titulo, data } = req.body;

  if (!id_planejamento || !titulo || !data) {
    return res.status(400).json({ erro: "Campos obrigatórios" });
  }

  const novoConteudo = await criarConteudo({ id_planejamento, titulo, data });
  res.status(201).json(novoConteudo);
}

async function listar(req, res) {
  const id_planejamento = parseInt(req.params.id_planejamento);
  const conteudos = await listarPorPlanejamento(id_planejamento);
  res.json(conteudos);
}



module.exports = { criar, listar };