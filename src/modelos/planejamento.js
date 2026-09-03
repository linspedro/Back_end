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
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12
    )
    RETURNING *`,
    [
      dados.idusuario,
      dados.turma,
      dados.materia,
      dados.trimestre,
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

module.exports = {
  Planejamento,
  Criar,
  buscar,
  listar,
  deletar
};
