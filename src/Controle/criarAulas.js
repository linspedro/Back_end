const {
  Aulas,
  buscar: buscarAulas,
  criar: criarAulas,
  deletar: deletarAulas,
  listar: listarAulas,
} = require("../modelos/criarAula");

const { buscarId } = require("../modelos/usuario"); 

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
  deletar,
};