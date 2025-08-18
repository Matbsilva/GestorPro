// Variáveis globais
let dadosOrcamentoTemporario = {};
let cardEmEdicao = null;
let cardSendoEditado = null; // Guarda referência ao card no modal de detalhes

// --- Seletores de Elementos ---
const novoOrcamentoBtn = document.querySelector('.add-button');
const orcamentoModal = document.getElementById('orcamento-modal');
const duvidasModal = document.getElementById('duvidas-modal');
const detalhesModal = document.getElementById('detalhes-modal');
const orcamentoForm = document.getElementById('orcamento-form');
const kanbanBoard = document.querySelector('.kanban-board');

/**
 * Adiciona os eventos de arrastar e soltar a um card.
 * @param {HTMLElement} card - O elemento do card.
 */
function adicionarEventosDrag(card) {
    card.setAttribute('draggable', true);
    card.addEventListener('dragstart', () => card.classList.add('dragging'));
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
}

/**
 * Cria e adiciona um novo card de orçamento ao painel Kanban.
 * @param {object} dadosOrcamento - Os dados do orçamento a serem exibidos no card.
 * @param {string} textoDuvidas - A string contendo as dúvidas a serem armazenadas.
 * @param {string} textoEscopo - A string contendo o escopo a ser armazenado.
 */
function criarCardOrcamento(dadosOrcamento) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    adicionarEventosDrag(card);

    // Armazena todos os dados no dataset
    card.dataset.duvidas = dadosOrcamento.duvidas || '';
    card.dataset.escopo = dadosOrcamento.escopo || '';
    card.dataset.analiseCompleta = dadosOrcamento.analiseCompleta || '';
    card.dataset.resumoCliente = dadosOrcamento.resumoCliente || '';

    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-card-btn';
    deleteBtn.innerHTML = '&times;';
    card.appendChild(deleteBtn);
    
    // ... (restante do código de criação do card)
    
    return card;
}

// ...

function carregarEstado() {
    const data = localStorage.getItem('kanbanData');
    if (!data) return;

    const colunas = JSON.parse(data);
    const todasColunasEl = document.querySelectorAll('.kanban-column');

    // Limpa as colunas antes de carregar
    todasColunasEl.forEach(c => c.innerHTML = `<h3 class="column-title">${c.querySelector('.column-title').textContent}</h3>`);


    colunas.forEach(colunaData => {
        const colunaEl = todasColunasEl[colunaData.columnIndex];
        if (colunaEl) {
            colunaData.cards.forEach(cardData => {
                // Passa o objeto cardData inteiro para a função
                const novoCard = criarCardOrcamento(cardData);
                colunaEl.appendChild(novoCard);
            });
        }
    });
}
