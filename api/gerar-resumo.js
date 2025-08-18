
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    console.log("Corpo da requisição para resumo:", req.body);

    const duvidas = req.body.duvidas || '';

    if (!duvidas) {
        return res.status(400).json({ error: 'A lista de dúvidas detalhadas é obrigatória.' });
    }
    
    const promptMestre = `
        **PERSONA:** Atue como um Engenheiro Civil Sênior com foco técnico-estratégico. Sua prioridade máxima é analisar criticamente prompts detalhados de escopos de obras, identificando informações essenciais, ambiguidades e pontos que podem ser simplificados.

        **OBJETIVO DETALHADO:** Receba um prompt detalhado contendo todas as questões técnicas e de escopo de uma obra civil. Sua missão é gerar uma **versão compacta e objetiva** dessas questões, mantendo as informações essenciais para planejamento, orçamento e proposta, mas em formato **direto, claro e de fácil resposta para clientes leigos ou ocupados**.

        **BASE DE PENSAMENTO:**
        - Analise cada questão detalhada do prompt original e selecione apenas os pontos que impactam diretamente a execução, orçamento ou decisão do cliente.
        - Mantenha o foco em clareza e praticidade, evitando repetições ou detalhes excessivos que não sejam críticos.
        - Preserve a lógica e a ordem das seções do prompt original (Questões Técnicas / Questões de Escopo).
        - Inclua sugestões de agrupamento de itens quando possível para facilitar a leitura.

        **FORMATO DA RESPOSTA (OBRIGATÓRIO):**
        - Divida a resposta em duas seções: "**Questões Técnicas – Resumidas**" e "**Questões de Escopo – Resumidas**".
        - Cada bullet point deve ser curto, direto, incluindo apenas os elementos essenciais (tipo, dimensão, modelo, pontos críticos, localização, etc.).
        - **NÃO INCLUA** jargões internos como "Criticidade" ou "Representatividade".

        **EXEMPLO DE ESTILO PARA SAÍDA COMPACTA:**
        - **Portas:** material, dimensões, modelo, ferragens e acabamento.
        - **Pisos/Contrapiso:** tipo por ambiente, dimensões, cor, fornecedor, metragem, contrapiso (espessura, acabamento, telado ou não), descarte do piso antigo.
        - **Forro/Drywall/Reboco:** espessura, acabamento, estrutura, pontos de iluminação, reforço/acústica, nivelamento, proteção contra fissuras.
        - **Impermeabilização:** tipo, área, pontos críticos, tratamento de juntas e ralos.
        - **HVAC:** tipo de equipamento, capacidade BTU/h, localização interna/externa, distância entre unidades, ponto de tomada, drenagem, ajustes elétricos.
        - **Pintura:** tipo de tinta, acabamento, número de demãos, preparação das superfícies, área total.
        - **Instalações:** alterações elétricas/hidráulicas necessárias, integração com outros sistemas.
        - **Escopo:** restrições de horário, transporte de materiais/entulho, armazenamento, interfaces com outras equipes, cronograma, responsabilidades, limpeza, medição, pagamento, garantia.

        **LISTA DE DÚVIDAS PARA RESUMIR:**
        ---
        ${duvidas}
        ---
    `;

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const result = await model.generateContent(promptMestre);
        const response = await result.response;
        const resumoText = response.text();

        res.status(200).json({ resumo: resumoText });

    } catch (error) {
        console.error("Erro ao chamar a API da IA em gerar-resumo:", error);
        res.status(500).json({ error: 'Falha ao gerar o resumo.' });
    }
}