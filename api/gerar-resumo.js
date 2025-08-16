// Backend para resumir a lista de dúvidas
     export default async function handler(request, response) {
       if (request.method !== 'POST') {
         return response.status(405).json({ message: 'Apenas o método POST é permitido' });
       }

       const { textoCompleto } = request.body;
       const apiKey = process.env.GEMINI_API_KEY;

       if (!textoCompleto) {
         return response.status(400).json({ message: 'O texto completo das dúvidas é obrigatório' });
       }

       const prompt = `
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
       - Inclua, se relevante, um indicador de **impacto no orçamento** (Alto, Médio, Baixo) para cada item.  

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
       ${textoCompleto}
       ---
       `;

       try {
         const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=' + apiKey, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
         });

         const data = await geminiResponse.json();
         const resumo = data.candidates[0].content.parts[0].text;

         response.status(200).json({ resumo: resumo });
       } catch (error) {
         response.status(500).json({ message: 'Erro ao chamar a API do Gemini para resumir', error: error.message });
       }
     }