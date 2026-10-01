const pool = require("./database");

async function criar(dados) {
  const resultado = await pool.query(
    `insert into planejamento_conteudo (id_planejamento, titulo, data)
     values ($1, $2, $3)
     RETURNING *`,
    [dados.id_planejamento, dados.titulo, dados.data]
  );
  return resultado.rows[0];
}

async function listarPorPlanejamento(id_planejamento) {
  const resultado = await pool.query(
    "select * from planejamento_conteudo where id_planejamento = $1 order by data",
    [id_planejamento]
  );
  return resultado.rows;
}

module.exports = { criar, listarPorPlanejamento };