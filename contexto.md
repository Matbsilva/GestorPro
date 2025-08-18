# Contexto do Projeto: GestorPro (v4.1 - Pós-MVP, Pré-FASE 2)

## Objetivo Principal
Criar um aplicativo web de nível profissional para gestão de orçamentos de engenharia, evoluindo para uma plataforma de inteligência de negócio.

## Nossas Regras de Colaboração

*   **Regra de Ouro (Imutabilidade):** Nenhum ativo do projeto (código, prompts, textos de UI, etc.) que já foi validado pelo "dono do produto" (Mat) será alterado, adaptado ou resumido sem sua aprovação explícita.
*   **Princípio da Adaptação:** Ao adicionar novos recursos, o código novo deve ser escrito para se adaptar aos ativos existentes.
*   **Transparência Total:** Se uma alteração em um ativo antigo for inevitável, ela será apresentada de forma clara, com o "antes" e o "depois", para avaliação e aprovação prévia.

## Estado da Aplicação
A Fase 1 (MVP e Backend) está concluída. O aplicativo está funcional, com deploy na Vercel e persistência de dados no `localStorage`.

### Arquitetura Atual

*   **Frontend:**
    *   Estrutura em HTML, CSS e JavaScript vanilla.
    *   Interface principal no estilo Kanban (`Trello-like`) com funcionalidades de CRUD (Criar, Ler, Atualizar, Deletar) e `drag & drop` para os cards.
    *   Um modal de detalhes (`#detalhes-modal`) exibe informações completas de um card. Os botões de ação ('Editar', 'Gerar Resumo', 'Salvar Alterações') são **elementos estáticos no HTML** e sua visibilidade é controlada dinamicamente via JavaScript, alternando a classe `.hidden`.
    *   A lógica de eventos é centralizada: `event listeners` são anexados aos elementos (botões, inputs) uma única vez, na carga inicial do script.

*   **Backend (Serverless):**
    *   Hospedado na Vercel com Funções Serverless (Node.js).
    *   Endpoint `/api/gerar-duvidas`: recebe o escopo do projeto e utiliza um prompt mestre para gerar uma análise detalhada e uma lista de dúvidas técnicas.
    *   Endpoint `/api/gerar-resumo`: recebe o escopo e as dúvidas para gerar uma versão resumida e amigável para o cliente.

*   **Versionamento e Deploy:**
    *   Código-fonte versionado com Git e hospedado no GitHub.
    *   Deploy contínuo (CI/CD) configurado na Vercel a partir da branch `main`.

## Roadmap de Desenvolvimento

### FASE 2: Refinamento da Interface e Experiência (Foco Atual)
1.  **Botões no Topo do Modal:** Mover os botões "Editar" e "Gerar Resumo" para o topo do modal de detalhes. (✅ Concluído)
2.  **Layout do Resumo:** Implementar a exibição do resumo gerado pela IA. (✅ Concluído)
3.  **Renderização de Markdown:** Converter a formatação do resumo em estilo visual (negrito, listas). (✅ Concluído)
4.  **Saída "Limpa" para E-mail:** Criar uma função "Copiar para E-mail".
5.  **Funcionalidade de Edição:** Implementar a lógica de edição de cards existentes.

### FASE 3: Novas Funcionalidades de IA e Automação
*   Leitura de Imagem: Permitir o upload de imagem do escopo.
*   Geração de Proposta: Gerar o texto da proposta comercial.
*   Módulo Financeiro Simplificado: Adicionar campos de valor e status de pagamento.

### FASE 4: Backend Avançado e Infraestrutura
*   Banco de Dados Real: Migrar do `localStorage` para um banco de dados na nuvem (ex: Vercel Postgres).
*   Banco de Composições: Implementar o banco de dados de composições de custo.

### FASE 5: Inteligência de Negócio e Expansão
*   Módulo de Análise (BI): Criar painel de relatórios.
*   Integração com Execução: Módulo de conexão com a execução da obra.
*   Portal do Cliente (Visão de longo prazo).

## Nosso Próximo Objetivo Imediato
Iniciar a **FASE 2**, começando pela tarefa 4: **Criar uma função "Copiar para E-mail" que formate o resumo da IA para ser colado em um e-mail de forma limpa e profissional.**