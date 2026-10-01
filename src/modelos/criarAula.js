const pool = require("./database"); 

class Aulas {
  constructor(
    id_aula,
    id_usuario,
    id_planejamento,
    titulo_da_aula,
    turma,
    materia,
    habilidades,
    objetivos,
    criterios,
    materiais_necessarios,
    data_da_aula
  ) {
    this.id_aula = id_aula;
    this.id_usuario = id_usuario;
    this.id_planejamento = id_planejamento;
    this.titulo_da_aula = titulo_da_aula;
    this.turma = turma;
    this.materia = materia;
    this.objetivos = objetivos;
    this.criterios = criterios;
    this.habilidades = habilidades;
    this.materiais_necessarios = materiais_necessarios;
    this.data_da_aula = data_da_aula;
  }
}

// função pra criar uma aula
async function criar(dados) {
  const resultado = await pool.query(
    `insert into aula (
      id_usuario,
      id_planejamento,
      titulo_da_aula,
      turma,
      materia,
      habilidades,
      objetivos,
      criterios,
      materiais_necessarios,
      data_da_aula
    )
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      dados.id_usuario,
      dados.id_planejamento,
      dados.titulo_da_aula,
      dados.turma,
      dados.materia,
      dados.habilidades,
      dados.objetivos,
      dados.criterios,
      dados.materiais_necessarios,
      dados.data_da_aula,
    ]
  );

  return resultado.rows[0];
}

// buscar uma aula pelo id
async function buscar(id) {
  const resultado = await pool.query(
    "select * from aula where id_aula = $1",
    [id]
  );
  return resultado.rows[0];
}

// listar todas as aulas
async function listar() {
  const resultado = await pool.query("select * from aula order by id_aula");
  return resultado.rows;
}

// deletar uma aula
async function deletar(id) {
  const resultado = await pool.query(
    "delete from aula where id_aula = $1 RETURNING *",
    [id]
  );
  return resultado.rows[0];
}

// criarAula.js
async function listarPorUsuario(id_usuario) {
  const resultado = await pool.query(
    "select * from aula where id_usuario = $1 order by id_aula",
    [id_usuario]
  );
  return resultado.rows;
}
// adiciona listarPorUsuario no module.exports

module.exports = { Aulas, criar, buscar, listar, deletar,listarPorUsuario };