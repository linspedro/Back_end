const pool = require("../modelos/database");

async function criar(dados) {
  const resultado = await pool.query(
    `INSERT INTO atividade (
      id_usuario,
      turma,
      materia,
      trimestre,
      titulo_da_atividade,
      objetivo,
      descricao,
      duracao,
      observacoes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      dados.id_usuario,
      dados.turma,
      dados.materia,
      dados.trimestre ?? null,
      dados.titulo_da_atividade,
      dados.objetivo,
      dados.descricao,
      dados.duracao,
      dados.observacoes ?? null,
    ]
  );

  return resultado.rows[0];
}

async function buscar(id) {
  const resultado = await pool.query(
    "SELECT * FROM atividade WHERE id_atividade = $1",
    [id]
  );

  return resultado.rows[0] || null;
}

async function listar() {
  const resultado = await pool.query(
    "SELECT * FROM atividade ORDER BY id_atividade"
  );

  return resultado.rows;
}

async function listarPorUsuario(id_usuario) {
  const resultado = await pool.query(
    "SELECT * FROM atividade WHERE id_usuario = $1 ORDER BY id_atividade",
    [id_usuario]
  );

  return resultado.rows;
}

async function deletar(id) {
  const resultado = await pool.query(
    "DELETE FROM atividade WHERE id_atividade = $1 RETURNING *",
    [id]
  );

  return resultado.rows[0] || null;
}

module.exports = {
  criar,
  buscar,
  listar,
  listarPorUsuario,
  deletar,
};