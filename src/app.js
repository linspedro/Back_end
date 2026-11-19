//Ferramentas
require('dotenv').config()
const express = require("express");
const cors = require("cors");

//cria a aplicação
const app = express();


// rota raiz
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "bem vindo ao servidor" });
});

//rota de msg do banco de dados
const pool = require("./modelos/database");

//rotas de cada arquivo
const usu = require("./Rotas/usuario");
const planejamento = require("./Rotas/planejamento_rota");
const aulas = require("./Rotas/aulas_rotas");

const rotasPlanejamentoConteudo = require("./Rotas/planejamentoConteudo");
const rotasAtividade = require("./Rotas/atividade");
app.use("/planejamento-conteudo", rotasPlanejamentoConteudo);
app.use("/usuarios", usu);
app.use("/Planejamento", planejamento);
app.use("/aulas", aulas);
app.use("/atividades", rotasAtividade);


app.get("/teste_do_banco_dados", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");
    res.json({
      mensagem: "Conexão com o banco realizada!",
      horario: resultado.rows[0].now
    });
  } catch (erro) {
    console.error("Erro ao conectar ao banco:", erro.message);

    res.status(500).json({
      mensagem: "Erro ao conectar ao banco de dados",
      erro: erro.message
    });
  }
});

module.exports = app;
