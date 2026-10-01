const {
  Criar: criarPlanejanejamento,
  buscar: buscarPlanejamento,
  deletar: deletarPlanejamento,
  listar: listarPlanejamentos,
  listarPorUsuario: listarPlanejamentosPorUsuario,   // ← adiciona essa linha
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