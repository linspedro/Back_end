const {
  buscar: buscarAtividade,
  criar: criarAtividade,
  deletar: deletarAtividade,
  listar: listarAtividades,
} = require("../modelos/atividade");

const { buscarId } = require("../modelos/usuario");

async function listar(req, res) {
  const atividades = await listarAtividades();
  res.json(atividades);
}

async function buscar(req, res) {
  const id = parseInt(req.params.id);
  const atividade = await buscarAtividade(id);

  if (!atividade) {
    return res.status(404).json({ erro: "Atividade não encontrada" });
  }
  res.json(atividade);
}

async function Criar(req, res) {
  const {
    id_usuario,
    turma,
    materia,
    trimestre,
    titulo_da_atividade,
    objetivo,
    descricao,
    duracao,
  } = req.body;

  if (
    !id_usuario ||
    !turma ||
    !materia ||
    !trimestre ||
    !titulo_da_atividade ||
    !objetivo ||
    !descricao ||
    !duracao
  ) {
    return res.status(400).json({ erro: "campos obrigatorios" });
  }

  const usuario = await buscarId(id_usuario);

  if (!usuario) {
    return res.status(400).json({ erro: "usuario não encontrado" });
  }

  const novaAtividade = await criarAtividade({
    id_usuario,
    turma,
    materia,
    trimestre,
    titulo_da_atividade,
    objetivo,
    descricao,
    duracao,
  });

  res.status(201).json(novaAtividade);
}

async function deletar(req, res) {
  const id = parseInt(req.params.id);
  try {
    const removido = await deletarAtividade(id);

    if (!removido) {
      return res.status(404).json({ erro: "Atividade não encontrada" });
    }

    res.status(204).send();
  } catch (erro) {
    throw erro;
  }
}

module.exports = { listar, buscar, Criar, deletar };