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

    **OBJETIVO DETALHADO:** Sua missão é analisar o escopo de serviço fornecido abaixo e gerar uma lista de perguntas de alto valor para o cliente. As perguntas devem ser práticas, diretas e focadas em obter as informações essenciais para a elaboração de um orçamento preciso, um planejamento executivo seguro e uma proposta comercial clara. 
    ⚠️ Evite perguntas genéricas que poderiam se aplicar a qualquer obra; todas devem ser contextualizadas ao escopo fornecido.

    **BASE DE PENSAMENTO E CHECKLIST ESTRATÉGICO:**
    Use os seguintes tópicos como referência, mas adapte as perguntas ao contexto do escopo. Inclua novas questões quando necessário e ignore itens irrelevantes.

    **1. Questões Técnicas (foco no "O Quê" e "Como"):**
    - Especificações de Materiais: qualidade, tipo, marca, dimensões, acabamento.
    - Metodologia Executiva: método de fixação, preparo de superfície, sequência construtiva.
    - Instalações (Elétrica/Hidráulica): infraestrutura existente, necessidade de novos pontos, especificações de componentes.
    - Drenagem e Impermeabilização: soluções para escoamento, tratamento de superfícies.
    - Tratamentos Específicos: proteção contra cupins, fungos, corrosão.

    **2. Questões de Escopo (foco no "Onde", "Quando" e "Quem"):**
    - Acesso e Restrições: regras de condomínio, restrições de horário, transporte de materiais/entulho, ruído/poeira.
    - Infraestrutura e Interfaces: disponibilidade de energia/água, dependência de outras equipes, cronograma integrado.
    - Gestão e Contrato: prazo esperado, descarte de entulho, garantia de serviços, critérios de medição e condições de pagamento, forma de comunicação com o cliente.

    **ANÁLISE DE CRITICIDADE:** Para cada pergunta, indique o risco/complexidade/impacto como **Alto, Médio ou Baixo**.  
    **REPRESENTATIVIDADE NO ORÇAMENTO:** Para cada item, indique se sua representatividade no orçamento é **Alta, Média ou Baixa**.

    **FORMATO DA RESPOSTA (OBRIGATÓRIO):**
    1. Liste as questões detalhadas em duas seções: "**Questões Técnicas**" e "**Questões de Escopo**".  
    2. Cada bullet point deve ter um tópico em negrito (ex: **Especificação da Madeira:**) seguido de uma pergunta detalhada.  
    3. Inclua a análise de criticidade e a representatividade no orçamento para cada pergunta.

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
    const textoDaIA = data.candidates[0].content.parts[0].text;

    response.status(200).json({ duvidas: textoDaIA });
  } catch (error) {
    response.status(500).json({ message: 'Erro ao chamar a API do Gemini', error: error.message });
  }
}
