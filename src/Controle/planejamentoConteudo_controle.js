const {
  criar: criarConteudo,
  listarPorPlanejamento,
  substituirPorPlanejamento,
} = require("../modelos/planejamento_conteudo");

const { buscar: buscarPlanejamento } = require("../modelos/planejamento");

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

// troca a lista de aulas do planejamento pela lista enviada
async function substituir(req, res) {
  const id_planejamento = parseInt(req.params.id_planejamento);
  const { id_usuario, conteudos } = req.body || {};

  if (!id_usuario || !Array.isArray(conteudos)) {
    return res
      .status(400)
      .json({ erro: "Envie o id_usuario e a lista de conteudos." });
  }

  const planejamento = await buscarPlanejamento(id_planejamento);

  if (!planejamento) {
    return res.status(404).json({ erro: "Planejamento não encontrado" });
  }

  if (Number(planejamento.id_usuario) !== Number(id_usuario)) {
    return res
      .status(403)
      .json({ erro: "Você não pode editar este planejamento." });
  }

  const limpos = [];

  for (const item of conteudos) {
    const titulo = String(item?.titulo ?? "").trim();
    const data = String(item?.data ?? "").slice(0, 10);

    if (!titulo || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return res
        .status(400)
        .json({ erro: "Cada aula precisa de data e título." });
    }

    limpos.push({ titulo, data });
  }

  limpos.sort((a, b) => a.data.localeCompare(b.data));

  const salvos = await substituirPorPlanejamento(id_planejamento, limpos);
  res.json(salvos);
}

module.exports = { criar, listar, substituir };