# Contexto do Projeto: GestorPro

## Objetivo Principal
Criar um aplicativo web para gestão de orçamentos de engenharia usando HTML, CSS e JavaScript.

## Estrutura de Arquivos Atual
- `index.html`: Contém a estrutura do dashboard e de dois modais (dados iniciais e análise de escopo).
- `style.css`: Contém todo o estilo da aplicação.
- `script.js`: Contém a lógica de interatividade.
- `contexto.md`: Este arquivo.

## Estado da Aplicação
O fluxo de trabalho principal está implementado. O usuário pode:
1. Abrir um primeiro modal para inserir dados básicos.
2. Ao salvar, os dados são armazenados temporariamente e um segundo modal é aberto.
3. No segundo modal, o usuário insere um escopo de serviço.
4. Ao clicar em 'Gerar Dúvidas', um prompt formatado para a IA é gerado e exibido no console do navegador.

## Nosso Próximo Objetivo Imediato
Permitir que o usuário cole a resposta da IA (a lista de dúvidas) de volta na interface e, com base nisso, crie o card final na coluna 'Aguardando Respostas'.
