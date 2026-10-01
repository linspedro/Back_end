const {
  Usuario,
  Criar,
  buscarPorEmail,
  buscarId,
  login: loginModelo,
} = require("../modelos/usuario");

const bcrypt = require("bcrypt");

//buscar usuario
async function buscarUsuario(req, res) {
  const id = parseInt(req.params.id);
  const usuario = await buscarId(id);

  if (!usuario) {
    return res.status(400).json({ erro: "Usuario não encontrado" });
  }

  res.json(usuario);
}

// criando usuario
async function criarUsuario(req, res) {
  console.log("BODY RECEBIDO:", req.body);

  if (!req.body) {
    return res.status(404).json({
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
  const existeEmail = await buscarPorEmail(emaildoUsuario);
  if (existeEmail) {
    return res.status(400).json({ erro: "email ja cadastrado" });
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

async function login(req, res) {
  if (!req.body) {
    return res.status(404).json({
      erro: "Nenhum body foi enviado",
    });
  }

  const emaildoUsuario = req.body.email;
  const senhadousuario = req.body.senha;

  const usuario = await buscarPorEmail(emaildoUsuario);

  if (!usuario) {
    return res.status(400).json({
      erro: "E-mail ou senha inválidos!",
    });
  }

  const senhaCorreta = await bcrypt.compare(
    senhadousuario,
    usuario.senha
  );

  if (!senhaCorreta) {
    return res.status(400).json({
      erro: "E-mail ou senha inválidos!",
    });
  }

  res.status(200).json({
    mensagem: "Usuário logado com sucesso!",
    usuario: {
      id: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      data_criacao: usuario.data_criacao,
    },
  });
}


module.exports = {
  criarUsuario,
  buscarUsuario,
  login,
};
