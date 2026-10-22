const {
  Aulas,
  buscar: buscarAulas,
  criar: criarAulas,
  deletar: deletarAulas,
  listar: listarAulas,
  listarPorUsuario: listarAulasPorUsuario,
} = require("../modelos/criarAula");

const { buscarId } = require("../modelos/usuario");
const { gerarAulaIA } = require("../servicos/gerarAulaIA");

// listar aulas
async function listar(req, res) {
  const aulas = await listarAulas();
  res.json(aulas);
}

async function buscar(req, res) {
  const id = parseInt(req.params.id);

  const aulas = await buscarAulas(id);

  if (!aulas) {
    return res.status(404).json({
      erro: "Aulas não encontrado",
    });
  }
  res.json(aulas);
}

async function listarPorUsuario(req, res) {
  const id_usuario = parseInt(req.params.id_usuario);
  const aulas = await listarAulasPorUsuario(id_usuario);
  res.json(aulas);
}

// criação manual de aula
async function Criar(req, res) {
  const {
    id_usuario,
    id_planejamento,
    titulo_da_aula,
    turma,
    materia,
    habilidades,
    objetivos,
    criterios,
    materiais_necessarios,
    data_da_aula,
  } = req.body;

  if (
    !id_usuario ||
    !titulo_da_aula ||
    !turma ||
    !materia ||
    !habilidades ||
    !objetivos ||
    !criterios ||
    !materiais_necessarios
  ) {
    return res.status(400).json({ erro: "campos obrigatorios" });
  }

  const usuario = await buscarId(id_usuario);

  if (!usuario) {
    return res.status(400).json({ erro: "usuario não encontrado" });
  }

  const novaAula = await criarAulas({
    id_usuario,
    id_planejamento,
    titulo_da_aula,
    turma,
    materia,
    habilidades,
    objetivos,
    criterios,
    materiais_necessarios,
    data_da_aula,
  });

  res.status(201).json(novaAula);
}

// gera a aula com IA e já salva no banco
async function gerarComIA(req, res) {
  const {
    id_usuario,
    disciplina,
    turma,
    tema,
    duracao,
    objetivos,
    habilidades,
    metodologia,
    materiais,
    observacoes,
  } = req.body || {};

  if (!id_usuario || !disciplina || !turma || !tema) {
    return res
      .status(400)
      .json({ erro: "Envie id_usuario, disciplina, turma e tema da aula." });
  }

  const usuario = await buscarId(id_usuario);

  if (!usuario) {
    return res.status(400).json({ erro: "usuario não encontrado" });
  }

  try {
    const gerada = await gerarAulaIA({
      disciplina,
      turma,
      tema,
      duracao,
      objetivos,
      habilidades,
      metodologia,
      materiais,
      observacoes,
    });

    const novaAula = await criarAulas({
      id_usuario,
      id_planejamento: null,
      titulo_da_aula: gerada.titulo_da_aula,
      turma,
      materia: disciplina,
      habilidades: gerada.habilidades,
      objetivos: gerada.objetivos,
      criterios: gerada.criterios,
      materiais_necessarios: gerada.materiais_necessarios,
      data_da_aula: null,
      desenvolvimento: gerada.desenvolvimento,
      duracao: gerada.duracao,
      metodologia: gerada.metodologia,
      observacoes: gerada.observacoes,
    });

    res.status(201).json(novaAula);
  } catch (erro) {
    console.error(erro);
    const mensagem = erro.status ? erro.message : "Falha ao gerar a aula com IA.";
    res.status(erro.status || 500).json({ erro: mensagem });
  }
}

async function deletar(req, res) {
  const id = parseInt(req.params.id);
  try {
    const removido = await deletarAulas(id);

    if (!removido) {
      return res.status(404).json({
        erro: "aulas não encontrado",
      });
    }

    res.status(204).send();
  } catch (erro) {
    throw erro;
  }
}

module.exports = {
  listar,
  buscar,
  Criar,
  gerarComIA,
  deletar,
  listarPorUsuario,
};