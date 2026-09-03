//Ferramentas
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
const usu = require("./Rotas/usuario")
const planejamento = require("./Rotas/planejamento_rota")
app.use("/usuarios", usu)
app.use("/Planejamento",planejamento)

app.get("/teste_do_banco_dados", async (req, res) => {
  const hora = await pool.query("select now()");
  res.json(hora.rows);
});

module.exports = app;
