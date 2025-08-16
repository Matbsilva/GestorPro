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

  const prompt = `Por favor, atue como um engenheiro sênior. Analise o seguinte escopo de serviço e gere uma lista de dúvidas técnicas e de escopo que precisam ser esclarecidas com o cliente antes de finalizar o orçamento. O escopo é: ${escopo}`;

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