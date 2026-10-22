
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.IA_CHAVE || "chave-nao-configurada",
});

async function gerarAtividadeIA(dados) {
  if (!process.env.IA_CHAVE) {
    const erro = new Error(
      "GROQ_API_KEY não está configurada no .env do backend."
    );
    erro.status = 500;
    throw erro;
  }

  const {
    titulo,
    disciplina,
    turma,
    duracao,
    objetivo,
    descricao,
    observacoes,
  } = dados;

  const prompt = `
Você é um especialista em educação brasileira e planejamento pedagógico.

Crie exatamente 3 opções diferentes de atividades para o professor.

Dados fornecidos:
- Tema: ${titulo}
- Disciplina: ${disciplina}
- Turma: ${turma}
- Duração: ${duracao || "Não informada"}
- Objetivo: ${objetivo || "Defina um objetivo pedagógico adequado"}
- Descrição ou contexto: ${descricao || "Não informado"}
- Observações: ${observacoes || "Nenhuma"}

Regras:
1. As 3 atividades devem ser realmente diferentes entre si.
2. Todas devem ser adequadas à turma e à disciplina informadas.
3. Use instruções claras, práticas e aplicáveis em sala de aula.
4. Não repita a mesma dinâmica mudando apenas o título.
5. Não inclua texto fora do JSON.
6. Retorne exatamente 3 atividades no formato abaixo:

{
  "opcoes": [
    {
      "titulo_da_atividade": "Título da atividade",
      "objetivo": "Objetivo pedagógico",
      "descricao": "Passo a passo detalhado da atividade",
      "duracao": "Duração estimada",
      "observacoes": "Materiais, cuidados ou orientações adicionais"
    },
    {
      "titulo_da_atividade": "Título da atividade",
      "objetivo": "Objetivo pedagógico",
      "descricao": "Passo a passo detalhado da atividade",
      "duracao": "Duração estimada",
      "observacoes": "Materiais, cuidados ou orientações adicionais"
    },
    {
      "titulo_da_atividade": "Título da atividade",
      "objetivo": "Objetivo pedagógico",
      "descricao": "Passo a passo detalhado da atividade",
      "duracao": "Duração estimada",
      "observacoes": "Materiais, cuidados ou orientações adicionais"
    }
  ]
}
`;

  const resposta = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content:
          "Você cria atividades pedagógicas e responde exclusivamente com JSON válido.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const conteudo = resposta.choices?.[0]?.message?.content;

  if (!conteudo) {
    const erro = new Error("A IA não retornou atividades.");
    erro.status = 502;
    throw erro;
  }

  let resultado;

  try {
    resultado = JSON.parse(conteudo);
  } catch {
    const erro = new Error("A IA retornou um JSON inválido.");
    erro.status = 502;
    throw erro;
  }

  if (!Array.isArray(resultado.opcoes) || resultado.opcoes.length !== 3) {
    const erro = new Error(
      "A IA não retornou exatamente 3 opções de atividade."
    );
    erro.status = 502;
    throw erro;
  }

  const camposObrigatorios = [
    "titulo_da_atividade",
    "objetivo",
    "descricao",
    "duracao",
    "observacoes",
  ];

  for (const opcao of resultado.opcoes) {
    for (const campo of camposObrigatorios) {
      if (
        typeof opcao[campo] !== "string" ||
        !opcao[campo].trim()
      ) {
        const erro = new Error(
          `Uma das atividades está sem o campo: ${campo}.`
        );
        erro.status = 502;
        throw erro;
      }
    }
  }

  return resultado.opcoes;
}

module.exports = { gerarAtividadeIA };
