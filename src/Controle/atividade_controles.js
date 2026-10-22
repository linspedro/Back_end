
const {
  buscar: buscarAtividade,
  criar: criarAtividade,
  deletar: deletarAtividade,
  listar: listarAtividades,
  listarPorUsuario: listarAtividadesPorUsuario,
} = require("../modelos/atividade");

const { buscarId } = require("../modelos/usuario");
const { gerarAtividadeIA } = require("../servicos/atividadeService");

// GET /atividades
async function listar(req, res) {
  try {
    const atividades = await listarAtividades();
    return res.status(200).json(atividades);
  } catch (erro) {
    console.error("Erro ao listar atividades:", erro);
    return res.status(500).json({ erro: "Erro ao listar atividades." });
  }
}

// GET /atividades/usuario/:id_usuario
async function listarPorUsuario(req, res) {
  try {
    const { id_usuario } = req.params;

    const atividades = await listarAtividadesPorUsuario(id_usuario);
    return res.status(200).json(atividades);
  } catch (erro) {
    console.error("Erro ao listar atividades do usuário:", erro);
    return res.status(500).json({
      erro: "Erro ao listar atividades do usuário.",
    });
  }
}

// GET /atividades/:id
async function buscar(req, res) {
  try {
    const atividade = await buscarAtividade(req.params.id);

    if (!atividade) {
      return res.status(404).json({ erro: "Atividade não encontrada." });
    }

    return res.status(200).json(atividade);
  } catch (erro) {
    console.error("Erro ao buscar atividade:", erro);
    return res.status(500).json({ erro: "Erro ao buscar atividade." });
  }
}

// POST /atividades
// Salva uma atividade escolhida pelo professor.
async function Criar(req, res) {
  try {
    const {
      id_usuario,
      turma,
      materia,
      trimestre,
      titulo_da_atividade,
      objetivo,
      descricao,
      duracao,
      observacoes,
    } = req.body;

    if (
      !id_usuario ||
      !turma ||
      !materia ||
      !titulo_da_atividade ||
      !objetivo ||
      !descricao ||
      !duracao
    ) {
      return res.status(400).json({
        erro:
          "Informe usuário, turma, matéria, título, objetivo, descrição e duração.",
      });
    }

    const usuario = await buscarId(id_usuario);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const atividade = await criarAtividade({
      id_usuario,
      turma,
      materia,
      trimestre: trimestre ?? null,
      titulo_da_atividade,
      objetivo,
      descricao,
      duracao,
      observacoes: observacoes ?? null,
    });

    return res.status(201).json(atividade);
  } catch (erro) {
    console.error("Erro ao criar atividade:", erro);
    return res.status(500).json({ erro: "Erro ao salvar atividade." });
  }
}

// POST /atividades/gerar
// Gera três opções, mas NÃO salva nenhuma no banco.
async function gerarComIA(req, res) {
  try {
    const {
      id_usuario,
      titulo,
      disciplina,
      turma,
      duracao,
      objetivo,
      descricao,
      observacoes,
    } = req.body;

    if (!id_usuario || !titulo || !disciplina || !turma) {
      return res.status(400).json({
        erro: "Informe usuário, título, disciplina e turma.",
      });
    }

    const usuario = await buscarId(id_usuario);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const opcoes = await gerarAtividadeIA({
      titulo,
      disciplina,
      turma,
      duracao,
      objetivo,
      descricao,
      observacoes,
    });

    if (!Array.isArray(opcoes) || opcoes.length !== 3) {
      return res.status(502).json({
        erro: "A IA não retornou exatamente três opções.",
      });
    }

    return res.status(200).json({ opcoes });
  } catch (erro) {
    console.error("Erro ao gerar opções de atividade:", erro);

    return res.status(erro.status || 500).json({
      erro: erro.message || "Erro ao gerar opções de atividade.",
    });
  }
}

// DELETE /atividades/:id
async function deletar(req, res) {
  try {
    const atividade = await deletarAtividade(req.params.id);

    if (!atividade) {
      return res.status(404).json({ erro: "Atividade não encontrada." });
    }

    return res.status(200).json({
      mensagem: "Atividade excluída com sucesso.",
      atividade,
    });
  } catch (erro) {
    console.error("Erro ao excluir atividade:", erro);
    return res.status(500).json({ erro: "Erro ao excluir atividade." });
  }
}

module.exports = {
  listar,
  listarPorUsuario,
  buscar,
  Criar,
  gerarComIA,
  deletar,
};
