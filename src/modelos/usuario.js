const pool = require("./database");

class Usuario {
  constructor(nome, email, senha) {
    this.nome = this.validarNome(nome);
    this.email = email;
    this.senha = senha;
  }

  validarNome(nome) {
    if (typeof nome === "string" && nome.trim().length > 0) {
      return nome.trim();
    }

    throw new Error("Nome inválido!");
  }
}
//função para criar meu usuario e enviar para banco de dados
async function Criar(dados) {
  const resultado = await pool.query(
    "INSERT INTO usuario (nome,email,senha) VALUES ($1,$2,$3) RETURNING *",
    [dados.nome, dados.email, dados.senha],
  );
  return resultado.rows[0];
}

// buscar email
async function buscarPorEmail(email) {
  const resultado = await pool.query("select * from usuario where email = $1", [
    email,
  ]);
  return resultado.rows[0];
}



module.exports = { Usuario, Criar, buscarPorEmail, };
