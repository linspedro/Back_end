const { Usuario, Criar, buscarPorEmail } = require("../modelos/usuario");

const bcrypt = require("bcrypt");

// criando usuario
async function criarUsuario(req, res) {
  console.log("BODY RECEBIDO:", req.body);

  if (!req.body) {
    return res.status(400).json({
      erro: "Nenhum body foi enviado",
    });
  }
  // pegando os nomes  la no body
  const nomedoUsuario = req.body.nome;
  const emaildoUsuario = req.body.email;
  const senhadousuario = req.body.senha;

  // caso usuario não preencha os campos
  if (!nomedoUsuario || !emaildoUsuario || !senhadousuario) {
    return res.status(400).json({
      erro: "Nome, email e senha são obrigatórios",
    });
  }

  //criando bcrypt
  const hashDaSenha = await bcrypt.hash(senhadousuario, 10);

  //verificando se email existe ou não
  const existeEmail = await buscarPorEmail(emaildoUsuario)
  if(existeEmail){
    return res.status(400).json({erro: "email ja cadastrado"})
  }
  //criando o usuario
  const novoUsuario = await Criar({
    nome: nomedoUsuario,
    email: emaildoUsuario,
    senha: hashDaSenha,
  });

  res.status(201).json({
    mensagem: "Usuário criado com sucesso!",
    usuario: novoUsuario,
  });
}




module.exports = {
  criarUsuario,
    
};
