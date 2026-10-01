const pool = require("./database");

class Atividade {
  constructor(
    id_atividade,
    id_usuario,
    turma,
    materia,
    trimestre,
    titulo_da_atividade,
    objetivo,
    descricao,
    duracao
  ) {
    this.id_atividade = id_atividade;
    this.id_usuario = id_usuario;
    this.turma = turma;
    this.materia = materia;
    this.trimestre = trimestre;
    this.titulo_da_atividade = titulo_da_atividade;
    this.objetivo = objetivo;
    this.descricao = descricao;
    this.duracao = duracao;
  }
}

async function criar(dados) {
  const resultado = await pool.query(
    `insert into atividade (
      id_usuario,
      turma,
      materia,
      trimestre,
      titulo_da_atividade,
      objetivo,
      descricao,
      duracao
    )
    values ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      dados.id_usuario,
      dados.turma,
      dados.materia,
      dados.trimestre,
      dados.titulo_da_atividade,
      dados.objetivo,
      dados.descricao,
      dados.duracao,
    ]
  );

  return resultado.rows[0];
}

async function buscar(id) {
  const resultado = await pool.query(
    "select * from atividade where id_atividade = $1",
    [id]
  );
  return resultado.rows[0];
}

async function listar() {
  const resultado = await pool.query("select * from atividade order by id_atividade");
  return resultado.rows;
}

async function deletar(id) {
  const resultado = await pool.query(
    "delete from atividade where id_atividade = $1 RETURNING *",
    [id]
  );
  return resultado.rows[0];
}

// atividade.js
async function listarPorUsuario(id_usuario) {
  const resultado = await pool.query(
    "select * from atividade where id_usuario = $1 order by id_atividade",
    [id_usuario]
  );
  return resultado.rows;
}
// adiciona listarPorUsuario no module.exports

module.exports = { Atividade, criar, buscar, listar, deletar, listarPorUsuario };