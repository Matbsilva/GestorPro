// Exemplo: import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    // Adiciona um log para depuração. Veremos isso nos logs da Vercel.
    console.log("Corpo da requisição recebida:", req.body);

    // --- LÓGICA DE VALIDAÇÃO ROBUSTA ---
    // Em vez de quebrar se os campos não existirem, nós os tratamos como strings vazias.
    const escopo = req.body.escopo || '';
    const duvidas = req.body.duvidas || '';

    // Se ambos estiverem vazios após a verificação, aí sim é um erro.
    if (!escopo && !duvidas) {
        return res.status(400).json({ error: 'É necessário fornecer ao menos o escopo ou as dúvidas.' });
    }
    
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const promptMestre = `
        **PERSONA:** Você é um assistente de IA especialista em engenharia e orçamentos.

        **TAREFA:** Analise o escopo do projeto e a lista de dúvidas técnicas detalhadas. Crie um resumo conciso e claro, focado nos pontos-chave que precisam de definição do cliente.

        **REGRAS:**
        1.  O resumo deve ser em formato de lista (bullet points).
        2.  **OMITA COMPLETAMENTE** qualquer jargão interno como "Criticidade", "Impacto no Orçamento" ou "Representatividade". Foque apenas na pergunta técnica.
        3.  Seja direto e objetivo.

        **ESCOPO DO PROJETO:**
        ---
        ${escopo}
        ---

        **DÚVIDAS DETALHADAS:**
        ---
        ${duvidas}
        ---

        **PRODUZA APENAS O RESUMO EM FORMATO DE LISTA.**
    `;

    try {
        // --- Simulação da chamada à API da IA ---
        // const result = await model.generateContent(promptMestre);
        // const response = await result.response;
        // const resumoText = response.text();

        const resumoTextMock = `
*   Qual o modelo e acabamento desejado para o Silestone da bancada?
*   Quais as dimensões exatas da nova bancada?
*   Qual a marca e modelo da cuba e torneira gourmet?
*   Onde será o ponto exato para a nova tomada de 220V?`;

        res.status(200).json({ resumo: resumoTextMock }); // No ambiente real, usar: { resumo: resumoText }

    } catch (error) {
        console.error("Erro ao chamar a API da IA em gerar-resumo:", error);
        res.status(500).json({ error: 'Falha ao gerar o resumo.' });
    }
}
