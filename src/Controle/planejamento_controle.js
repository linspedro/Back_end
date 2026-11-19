const {
  Criar: criarPlanejanejamento,
  buscar: buscarPlanejamento,
  deletar: deletarPlanejamento,
  listar: listarPlanejamentos,
  listarPorUsuario: listarPlanejamentosPorUsuario,
  atualizar: atualizarPlanejamento,
} = require("../modelos/planejamento");

const { buscarId } = require("../modelos/usuario");

// listar os planejamentos
async function listar(req, res) {
  const planejamento = await listarPlanejamentos();
  res.json(planejamento);
}


// buscar planejamento pelo ID
async function buscar(req, res) {
  const id = parseInt(req.params.id);

  const planejamento = await buscarPlanejamento(id);

  if (!planejamento) {
    return res.status(404).json({
      erro: "Planejamento não encontrado"
    });
  }

  res.json(planejamento);
}


// criar um novo planejamento
async function criar(req, res) {
  const {
    idusuario,
    turma,
    materia,
    trimestre,
    periodo,                    // ← adicionado
    componentesCurriculares,
    habilidades,
    objetivos,
    quantidadeDeAulas,
    provasETrabalhos,
    formativaSomativa,
    criterios,
    materiaisNecessarios,
  } = req.body;

  if (!idusuario || !turma || !materia || !trimestre || !periodo || !componentesCurriculares ||  // ← adicionado
      !habilidades || !objetivos || !quantidadeDeAulas || !provasETrabalhos ||
      !formativaSomativa || !criterios || !materiaisNecessarios) {
    return res.status(400).json({ erro: "Campos obrigatórios" });
  }

  const usuario = await buscarId(idusuario);

  if (!usuario) {
    return res.status(400).json({ erro: "Usuário não encontrado" });
  }

  const planejamento = await criarPlanejanejamento({
    idusuario,
    turma,
    materia,
    trimestre,
    periodo,                    // ← adicionado
    componentesCurriculares,
    habilidades,
    objetivos,
    quantidadeDeAulas,
    provasETrabalhos,
    formativaSomativa,
    criterios,
    materiaisNecessarios,
  });

  res.status(201).json(planejamento);
}
// deletar planejamento
async function deletar(req, res) {
  const id = parseInt(req.params.id);

  try {
    const removido = await deletarPlanejamento(id);

    if (!removido) {
      return res.status(404).json({
        erro: "Planejamento não encontrado"
      });
    }

    res.status(204).send();

  } catch (erro) {
    throw erro;
  }
}


// no planejamento_controle.js
async function listarPorUsuario(req, res) {
  const id_usuario = parseInt(req.params.id_usuario);
  const planejamentos = await listarPlanejamentosPorUsuario(id_usuario);
  res.json(planejamentos);
}


const CAMPOS_TEXTO = [
  "turma",
  "materia",
  "trimestre",
  "periodo",
  "componentes_curriculares",
  "habilidades",
  "objetivo",
  "provas_trabalhos",
  "formativa_somativa",
  "criterios",
  "materiais_necessarios",
];

// esses não podem ficar vazios
const OBRIGATORIOS_EDICAO = ["turma", "materia", "trimestre"];

async function atualizar(req, res) {
  const id = parseInt(req.params.id);
  const body = req.body || {};

  if (!body.id_usuario) {
    return res.status(400).json({ erro: "Envie o id_usuario." });
  }

  const planejamento = await buscarPlanejamento(id);

  if (!planejamento) {
    return res.status(404).json({ erro: "Planejamento não encontrado" });
  }

  if (Number(planejamento.id_usuario) !== Number(body.id_usuario)) {
    return res
      .status(403)
      .json({ erro: "Você não pode editar este planejamento." });
  }

  const dados = {};

  for (const campo of CAMPOS_TEXTO) {
    // campo não enviado: o banco mantém o valor atual
    if (body[campo] === undefined || body[campo] === null) {
      dados[campo] = null;
      continue;
    }

    const valor = String(body[campo]).trim();

    if (!valor && OBRIGATORIOS_EDICAO.includes(campo)) {
      return res.status(400).json({
        erro: `O campo ${campo.replaceAll("_", " ")} não pode ficar vazio.`,
      });
    }

    dados[campo] = valor;
  }

  const bruto = body.quantidade_de_aula;

  if (bruto === undefined || bruto === null || bruto === "") {
    dados.quantidade_de_aula = null;
  } else {
    const numero = Number.parseInt(bruto, 10);

    if (Number.isNaN(numero) || numero < 0) {
      return res
        .status(400)
        .json({ erro: "O número total de aulas precisa ser um número válido." });
    }

    dados.quantidade_de_aula = numero;
  }

  const atualizado = await atualizarPlanejamento(id, dados);
  res.json(atualizado);
}


// lembra de importar listarPorUsuario: listarPorUsuario: listarPlanejamentosPorUsuario
// e adicionar no module.exports

// em cada um dos 3: Planejamento.js, Aula.js, Atividade.js


module.exports = {
  listar,
  buscar,
  criar,
  deletar,
  listarPorUsuario
};