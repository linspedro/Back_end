
function erroIA(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

const OBRIGATORIOS = [
  "titulo_da_aula",
  "habilidades",
  "objetivos",
  "criterios",
  "materiais_necessarios",
  "desenvolvimento",
];

const OPCIONAIS = ["duracao", "metodologia", "observacoes"];

const instrucoes = `
Você é um professor experiente, especialista em educação brasileira,
BNCC, produção de material didático e explicação de conteúdos escolares.

Sua tarefa é criar uma AULA COMPLETA, como um professor prepararia
para ensinar a matéria aos alunos, e não apenas um resumo ou roteiro
de atividades.

RETORNE EXCLUSIVAMENTE UM OBJETO JSON VÁLIDO.
Não use Markdown fora do JSON, nem comentários.

DADOS RECEBIDOS:
Você receberá disciplina, turma, tema, duração, objetivos, habilidades,
metodologia, materiais e observações enviados pelo professor.

REGRAS GERAIS:
1. Respeite a disciplina, a turma, o tema e as preferências informadas.
2. Use linguagem adequada à idade e ao nível de escolaridade.
3. Desenvolva a explicação de forma clara, aprofundada e didática.
4. Não invente códigos da BNCC.
5. Não responda somente com tópicos curtos ou definições superficiais.
6. Use parágrafos completos para explicar os conceitos.
7. Apresente exemplos concretos e explique por que eles se relacionam
   com o conteúdo estudado.
8. Crie questões que possam ser respondidas com base na explicação.
9. Não repita o mesmo conteúdo apenas para aumentar o tamanho da aula.
10. Use \\n para separar seções e parágrafos dentro das strings JSON.
11. Quando uma informação opcional não for fornecida, proponha uma
    solução pedagógica adequada.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:

Retorne exatamente estas 9 chaves, todas como strings:

1. "titulo_da_aula"
Crie um título claro, específico e relacionado ao tema.

2. "habilidades"
Descreva as habilidades e competências que serão desenvolvidas.
Inclua códigos BNCC somente quando houver segurança na correspondência.

3. "objetivos"
Apresente um objetivo geral e de 3 a 5 objetivos específicos.

4. "criterios"
Explique como avaliar a aprendizagem durante a aula.
Considere a participação, a compreensão dos conceitos e a resolução
das questões propostas.

5. "materiais_necessarios"
Liste os materiais e recursos necessários para ensinar o conteúdo.

6. "desenvolvimento"
ESTE É O CAMPO MAIS IMPORTANTE.
Produza o conteúdo didático completo seguindo esta estrutura:

CONCEITOS E EXPLICAÇÃO DO CONTEÚDO

Explique o tema como um professor explicaria em sala de aula.
Apresente definições, características, classificações, causas,
consequências, regras, processos ou relações entre conceitos,
conforme a disciplina.

Desenvolva o conteúdo em parágrafos completos e bem explicados.
Não escreva apenas uma lista de palavras-chave.
A explicação deve permitir que o aluno estude e compreenda a matéria.

EXEMPLOS EXPLICADOS

Apresente pelo menos 3 exemplos relevantes, sempre que o tema permitir.
Cada exemplo deve ser seguido de uma explicação que mostre como o
conceito estudado aparece naquela situação.

Em Matemática, quando aplicável, resolva exemplos passo a passo,
explicando o raciocínio utilizado.
Em Ciências, História, Geografia e outras disciplinas, apresente
situações concretas, aplicações e relações de causa e consequência.
Adapte os exemplos à disciplina e à turma, sem forçar exemplos
inadequados ao assunto.

DESENVOLVIMENTO DA AULA

Explique como o professor pode apresentar o conteúdo, contextualizar
o tema, explicar os conceitos e envolver os alunos.
Organize as etapas de acordo com a duração disponível.
Inclua uma introdução, explicação da matéria, exemplos e uma conclusão.

QUESTÕES PARA OS ALUNOS

Crie de 5 a 10 questões relacionadas diretamente ao conteúdo explicado.
Varie os tipos de questão conforme a disciplina:
- Questões de compreensão dos conceitos.
- Questões de aplicação prática.
- Questões de interpretação ou análise.
- Problemas para resolver, quando apropriado.

As questões devem ser claras, adequadas à turma e respondíveis com
base no conteúdo da própria aula.
Não forneça a resposta imediatamente após cada pergunta.

GABARITO DO PROFESSOR

Após todas as questões, crie uma seção separada chamada
"GABARITO DO PROFESSOR".
Apresente a resposta de cada questão numerada.
Explique o raciocínio das respostas quando isso for relevante,
especialmente em cálculos e questões interpretativas.

ATIVIDADE DE FIXAÇÃO

Quando adequado, proponha uma atividade adicional para consolidar
a aprendizagem, como exercícios, debate, análise de situações,
experimento simples ou produção escrita.

ENCERRAMENTO

Finalize com uma síntese dos conceitos mais importantes e uma sugestão
de pergunta para verificar se os alunos compreenderam a matéria.

IMPORTANTE:
Todo o conteúdo explicativo, os exemplos, as questões e o gabarito
devem estar dentro da string "desenvolvimento".
Não coloque essas partes apenas em "objetivos" ou "observacoes".
Não substitua a explicação da matéria por instruções genéricas como
"o professor explicará o conteúdo".
Não invente um tema diferente daquele solicitado.

7. "duracao"
Informe a duração recebida. Se não houver, use "50 minutos".

8. "metodologia"
Descreva a abordagem pedagógica utilizada e como ela será aplicada.

9. "observacoes"
Inclua recomendações úteis para o professor, adaptações pedagógicas
e sugestões de acompanhamento da turma.

VALIDAÇÃO FINAL:
Antes de responder, verifique se:
- Todas as 9 chaves estão presentes.
- Todas as chaves têm valores em texto.
- O campo desenvolvimento contém conceitos explicados em parágrafos.
- Há exemplos acompanhados de explicação.
- Há de 5 a 10 questões e um gabarito separado.
- A linguagem é adequada à turma.
- O JSON é válido.

Retorne somente o objeto JSON, sem texto adicional.
`;

function paraTexto(valor) {
  if (Array.isArray(valor)) {
    return valor.map((item) => `- ${item}`).join("\n");
  }

  if (typeof valor === "string") return valor.trim();
  if (typeof valor === "number") return String(valor);

  return "";
}

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

async function gerarAulaIA(dados) {
  const { IA_URL, IA_MODELO, IA_CHAVE } = process.env;

  if (!IA_URL || !IA_MODELO || !IA_CHAVE) {
    throw erroIA(
      "Servidor sem configuração da IA. Confira o .env.",
      500
    );
  }

  const resposta = await fetch(IA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${IA_CHAVE}`,
    },
    body: JSON.stringify({
      model: IA_MODELO,
      messages: [
        {
          role: "system",
          content: instrucoes,
        },
        {
          role: "user",
          content:
            "Crie uma aula completa com base nestes dados. " +
            "Desenvolva conceitos, exemplos explicados, questões " +
            "e gabarito dentro do campo desenvolvimento. Dados: " +
            JSON.stringify(dados),
        },
      ],
      response_format: {
        type: "json_object",
      },
      temperature: 0.7,
      max_tokens: 7000,
    }),
  });

  if (resposta.status === 429) {
    throw erroIA(
      "Limite gratuito da IA atingido. Tente de novo em instantes.",
      429
    );
  }

  if (!resposta.ok) {
    console.error("Erro da IA:", resposta.status, await resposta.text());
    throw erroIA("A IA não respondeu como esperado.", 502);
  }

  const corpo = await resposta.json();

  let bruto;

  try {
    const conteudo = corpo.choices?.[0]?.message?.content;

    if (!conteudo) {
      throw new Error("Resposta vazia");
    }

    bruto = JSON.parse(conteudo);
  } catch {
    throw erroIA(
      "A IA devolveu uma resposta inválida. Tente de novo.",
      502
    );
  }

  if (!bruto || typeof bruto !== "object" || Array.isArray(bruto)) {
    throw erroIA(
      "A IA devolveu uma resposta inválida. Tente de novo.",
      502
    );
  }

  const dadosIA = {};

  for (const [chave, valor] of Object.entries(bruto)) {
    dadosIA[normalizar(chave)] = valor;
  }

  const aula = {};

  for (const campo of OBRIGATORIOS) {
    aula[campo] = paraTexto(dadosIA[campo]);

    if (!aula[campo]) {
      throw erroIA(
        `A IA não gerou o campo obrigatório: ${campo}. Tente novamente.`,
        502
      );
    }
  }

  for (const campo of OPCIONAIS) {
    aula[campo] = paraTexto(dadosIA[campo]) || null;
  }

  return aula;
}

module.exports = { gerarAulaIA };
