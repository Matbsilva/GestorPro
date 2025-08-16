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
        - **Acesso e Restrições:**
            - Existem restrições de horário para a execução dos trabalhos (ex: condomínio, área comercial)?
            - Existem restrições de horário para entrega/retirada de materiais e entulho?
            - Existem restrições de ruído, poeira ou outros incômodos que precisam ser gerenciados?
            - O acesso ao local de trabalho é direto ou requer movimentação especial (içamento, longas distâncias)?
        - **Infraestrutura e Interfaces:**
            - O cliente fornecerá pontos de água e energia próximos e disponíveis para uso da equipe?
            - Nossos serviços dependem da finalização de algum trabalho de outra equipe? Se sim, qual é o cronograma previsto para eles?
        - **Gestão e Contrato:**
            - Qual a expectativa do cliente em relação ao prazo de execução do serviço?
            - A limpeza da área de trabalho e o descarte do entulho gerado estão incluídos no nosso escopo?
            - Qual o período de garantia esperado para os serviços e materiais?
            - Qual o critério de medição para faturamento e quais as condições de pagamento?

    **FORMATO DA RESPOSTA (OBRIGATÓRIO):**
    A resposta DEVE ser dividida em duas seções claras e obrigatórias: "**Questões Técnicas**" e "**Questões de Escopo**".
    Dentro de cada seção, use bullet points. Cada bullet point deve ter um tópico em negrito (ex: **Especificação da Madeira:**) seguido da pergunta detalhada.

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
    const duvidas = data.candidates[0].content.parts[0].text;

    response.status(200).json({ duvidas: duvidas });
  } catch (error) {
    response.status(500).json({ message: 'Erro ao chamar a API do Gemini', error: error.message });
  }
}