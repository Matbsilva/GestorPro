# Contexto do Projeto: GestorPro (v4.4 - Base Estável e Funcional)

## Objetivo Principal
Criar um aplicativo web de nível profissional para gestão de orçamentos de engenharia, evoluindo para uma plataforma de inteligência de negócio.

## Nossas Regras de Colaboração

*   **Regra de Ouro (Imutabilidade):** Nenhum ativo do projeto (código, prompts, textos de UI, etc.) que já foi validado pelo "dono do produto" (Mat) será alterado, adaptado ou resumido sem sua aprovação explícita.
*   **Princípio da Adaptação:** Ao adicionar novos recursos, o código novo deve ser escrito para se adaptar aos ativos existentes.
*   **Transparência Total:** Se uma alteração em um ativo antigo for inevitável, ela será apresentada de forma clara, com o "antes" e o "depois", para avaliação e aprovação prévia.
*   **Responsabilidade do Commit:** O parceiro sênior (IA) é responsável por analisar as alterações realizadas e fornecer a mensagem de commit padronizada. O dono do produto (Mat) é responsável pela execução do commit.
*   **Procedimento de Reversão (Rollback):** Em caso de erro crítico em produção após um deploy, o parceiro sênior (IA) fornecerá o comando `git revert` completo e pronto para ser executado no Gemini CLI.

## Nosso Fluxo de Trabalho (Refinado)

*   **Para Modificações de Código:** O parceiro sênior (IA) fornecerá o **conteúdo completo e final** do arquivo a ser alterado. O dono do produto (Mat) será responsável por substituir o conteúdo do arquivo manualmente no VS Code, garantindo 100% de precisão.

## Estado da Aplicação
A base funcional do aplicativo está **100% validada em produção**. O fluxo de criação de cards em múltiplas etapas, incluindo autocomplete e a geração de dúvidas detalhadas e resumos limpos pela IA, está totalmente operacional.

### Arquitetura Atual
*   **Frontend:** HTML, CSS e JavaScript vanilla.
*   **Backend (Serverless):** Endpoints `/api/gerar-duvidas` e `/api/gerar-resumo` funcionais, usando o método `fetch` nativo e prompts mestres detalhados.
*   **Persistência:** `localStorage`.

## Roadmap de Desenvolvimento

### FASE 2: Refinamento da Interface e Experiência (Foco Atual)
1.  **Botões no Topo do Modal (Detalhes):** Mover botões para o topo do modal. (✅ Concluído)
2.  **Interface de Abas (Detalhes):** Reimplementar a interface de abas ("Análise Completa" e "Resumo para Cliente") no modal de detalhes de um card existente.
3.  **Renderização de Markdown:** Converter a formatação do resumo em estilo visual.
4.  **Saída "Limpa" para E-mail:** Criar uma função "Copiar para E-mail".
5.  **Funcionalidade de Edição:** Implementar a lógica de edição de cards existentes.

### FASE 3: Novas Funcionalidades de IA e Automação
*   Leitura de Imagem: Permitir o upload de imagem do escopo.
*   Geração de Proposta: Gerar o texto da proposta comercial.
*   Módulo Financeiro Simplificado: Adicionar campos de valor e status de pagamento.

### FASE 4: Backend Avançado e Infraestrutura
*   Banco de Dados Real: Migrar do `localStorage` para um banco de dados na nuvem.
*   Banco de Composições: Implementar o banco de dados de composições de custo.

### FASE 5: Inteligência de Negócio e Expansão
*   Módulo de Análise (BI): Criar painel de relatórios.
*   Integração com Execução: Módulo de conexão com a execução da obra.
*   Portal do Cliente (Visão de longo prazo).

### FASE 6: Inteligência de Pós-Venda e Análise de Perdas (Visão Futura)
*   Criar a view "Histórico" no menu lateral.
*   Implementar a coluna "Recusados" no histórico.
*   Implementar a coluna "Não Respondidos" no histórico.
*   Criar a funcionalidade para mover um card de "Enviado" para "Recusado".

## Nosso Próximo Objetivo Imediato
Com a base estável restaurada e validada, nosso foco retorna à **FASE 2, Tarefa 2:** Reimplementar a interface de abas no modal de detalhes de um card existente.