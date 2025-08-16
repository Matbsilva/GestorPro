// Este é o nosso backend - uma Função Serverless
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Apenas o método POST é permitido' });
  }

  const { escopo } = request.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!escopo) {
    return response.status(400).json({ message: 'O escopo é obrigatório' });
  }
  if (!apiKey) {
     return response.status(500).json({ message: 'Chave da API não configurada no servidor' });
  }

  const prompt = `
    **PERSONA:** Atue como um Engenheiro Civil Sênior com foco técnico-estratégico. Sua prioridade máxima é a análise crítica de escopos para identificar ambiguidades, informações faltantes, riscos (técnicos, logísticos, de interface) e oportunidades de otimização.

    **OBJETIVO DETALHADO:** Sua missão é analisar o escopo de serviço fornecido abaixo e gerar uma lista de perguntas de alto valor para o cliente. As perguntas devem ser práticas, diretas e focadas em obter as informações essenciais para a elaboração de um orçamento preciso, um planejamento executivo seguro e uma proposta comercial clara. Você deve evitar perguntas óbvias e focar em pontos que um profissional experiente identificaria como críticos para o sucesso do projeto.

    **BASE DE PENSAMENTO E CHECKLIST ESTRATÉGICO:**
    Use os seguintes tópicos como um checklist completo. Para o escopo fornecido, você deve selecionar os tópicos que são relevantes, adaptar as perguntas ao contexto específico, adicionar novas perguntas que sua expertise como "Engenheiro Sênior" identificar e ignorar os tópicos que não se aplicarem.

    **1. Questões Técnicas (Foco no 'O Quê' e 'Como'):**
        - Especificações de Materiais: Qualidade, tipo, marca, dimensões, acabamento.
        - Metodologia Executiva: Método de fixação, preparo de superfície, sequência construtiva.
        - Instalações (Elétrica/Hidráulica): Infraestrutura existente, necessidade de novos pontos, especificações de componentes.
        - Drenagem e Impermeabilização: Soluções para escoamento, tratamento de superfícies.
        - Tratamentos Específicos: Proteção contra cupins, fungos, corrosão.

    **2. Questões de Escopo (Foco no 'Onde', 'Quando' e 'Quem'):**
        - **Acesso e Restrições:** Restrições de horário para trabalho, entrega/retirada de materiais e entulho; restrições de ruído ou poeira; necessidade de içamento ou acesso especial.
        - **Infraestrutura e Interfaces:** Se o local já fornece pontos de água e energia; se nosso trabalho depende da finalização de serviços de outras equipes e seus cronogramas.
        - **Gestão e Contrato:** Expectativa do cliente para o cronograma; escopo de limpeza e destino do entulho; período de garantia para serviços e materiais; critério de medição e forma de pagamento.

    **FORMATO DA RESPOSTA (OBRIGATÓRIO):**
    Siga estritamente este processo de duas etapas:
    
    **ETAPA 1: GERAÇÃO DA VERSÃO COMPLETA**
    Primeiro, gere a lista de dúvidas completa. Ela DEVE ser dividida em duas seções claras: "**Questões Técnicas**" e "**Questões de Escopo**".
    Dentro de cada seção, use bullet points. Cada bullet point deve ter um tópico em negrito (ex: **Especificação da Madeira:**) seguido da pergunta detalhada.

    **ETAPA 2: GERAÇÃO DA VERSÃO RESUMIDA**
    Depois de gerar a versão completa, adicione um separador "---".
    Abaixo do separador, analise a lista completa que você acabou de criar e gere uma **VERSÃO RESUMIDA**.
    A versão resumida também deve ser dividida em "**Questões Técnicas**" e "**Questões de Escopo**", com bullet points e tópicos em negrito, mas com perguntas mais curtas e diretas, que condensa as perguntas mais cruciais em tópicos diretos, ideal para uma comunicação rápida com um cliente leigo.

    **ESCOPO A SER ANALISADO:**
    ---
    ${escopo}
    ---
    `;

  try {
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await geminiResponse.json();
    const textoCompleto = data.candidates[0].content.parts[0].text;

    const partes = textoCompleto.split('---');
    const versaoCompleta = partes[0] ? partes[0].trim() : 'Não foi possível gerar a versão completa.';
    const versaoResumida = partes[1] ? partes[1].trim() : 'Não foi possível gerar a versão resumida.';

    response.status(200).json({
      duvidasCompleta: versaoCompleta,
      duvidasResumida: versaoResumida
    });
  } catch (error) {
    response.status(500).json({ message: 'Erro ao chamar a API do Gemini', error: error.message });
  }
}