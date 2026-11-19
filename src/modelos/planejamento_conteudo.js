const pool = require("../modelos/database");

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

// apaga as aulas atuais do planejamento e grava a lista nova
async function substituirPorPlanejamento(id_planejamento, conteudos) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "delete from planejamento_conteudo where id_planejamento = $1",
      [id_planejamento]
    );

    const salvos = [];

    for (const item of conteudos) {
      const resultado = await client.query(
        `insert into planejamento_conteudo (id_planejamento, titulo, data)
         values ($1, $2, $3)
         RETURNING *`,
        [id_planejamento, item.titulo, item.data]
      );
      salvos.push(resultado.rows[0]);
    }

    await client.query("COMMIT");
    return salvos;
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}

module.exports = { criar, listarPorPlanejamento, substituirPorPlanejamento };