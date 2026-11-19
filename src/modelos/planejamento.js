const pool = require("./database");

class Planejamento {
  constructor(
    idusuario,
    turma,
    materia,
    trimestre,
    componentesCurriculares,
    habilidades,
    objetivos,
    quantidadeDeAulas,
    provasETrabalhos,
    formativaSomativa,
    criterios,
    materiaisNecessarios,
  ) {
    this.idsuario = idusuario
    this.turma = turma;
    this.materia = materia;
    this.trimestre = trimestre;
    this.componentesCurriculares = componentesCurriculares;
    this.habilidades = habilidades;
    this.objetivos = objetivos;
    this.quantidadeDeAulas = quantidadeDeAulas;
    this.provasETrabalhos = provasETrabalhos;
    this.formativaSomativa = formativaSomativa;
    this.criterios = criterios;
    this.materiaisNecessarios = materiaisNecessarios;
  }
}

async function Criar(dados) {
  const resultado = await pool.query(
    `INSERT INTO planejamento (
      id_usuario,
      turma,
      materia,
      trimestre,
      periodo,
      componentes_curriculares,
      habilidades,
      objetivo,
      quantidade_de_aula,
      provas_trabalhos,
      formativa_somativa,
      criterios,
      materiais_necessarios
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13
    )
    RETURNING *`,
    [
      dados.idusuario,
      dados.turma,
      dados.materia,
      dados.trimestre,
      dados.periodo,
      dados.componentesCurriculares,
      dados.habilidades,
      dados.objetivos,
      dados.quantidadeDeAulas,
      dados.provasETrabalhos,
      dados.formativaSomativa,
      dados.criterios,
      dados.materiaisNecessarios,
    ],
  );

  return resultado.rows[0];
}


// atualizar um planejamento (campos não enviados mantêm o valor atual)
async function atualizar(id, dados) {
  const resultado = await pool.query(
    `update planejamento set
      turma = coalesce($1, turma),
      materia = coalesce($2, materia),
      trimestre = coalesce($3, trimestre),
      periodo = coalesce($4, periodo),
      componentes_curriculares = coalesce($5, componentes_curriculares),
      habilidades = coalesce($6, habilidades),
      objetivo = coalesce($7, objetivo),
      quantidade_de_aula = coalesce($8, quantidade_de_aula),
      provas_trabalhos = coalesce($9, provas_trabalhos),
      formativa_somativa = coalesce($10, formativa_somativa),
      criterios = coalesce($11, criterios),
      materiais_necessarios = coalesce($12, materiais_necessarios)
    where id_planejamento = $13
    RETURNING *`,
    [
      dados.turma,
      dados.materia,
      dados.trimestre,
      dados.periodo,
      dados.componentes_curriculares,
      dados.habilidades,
      dados.objetivo,
      dados.quantidade_de_aula,
      dados.provas_trabalhos,
      dados.formativa_somativa,
      dados.criterios,
      dados.materiais_necessarios,
      id,
    ]
  );

  return resultado.rows[0];
}

//buscar um planejamento pelo id
async function buscar(id) {
  const resultado = await pool.query(
    "select * from planejamento where id_planejamento = $1",
    [id],
  );
  return resultado.rows[0];
}

// buscar todo planejamento ja feito
async function listar() {
    const resultado = await pool.query(
        "select * from planejamento order by id_planejamento"
    )

    return resultado.rows
}

// deletar um planejamento

async function deletar(id) {
    const resultado = await pool.query(
        "delete from planejamento where id_planejamento = $1",[id]
    )

    return resultado.rowCount > 0
}

async function listarPorUsuario(id_usuario) {
  const resultado = await pool.query(
    "select * from planejamento where id_usuario = $1 order by id_planejamento",
    [id_usuario]
  );
  return resultado.rows;
}




module.exports = {
  Planejamento,
  Criar,
  buscar,
  listar,
  deletar,
  listarPorUsuario,
  atualizar,
};
