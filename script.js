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
function criarCardOrcamento(dadosOrcamento, textoDuvidas, textoEscopo) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    adicionarEventosDrag(card);

    // Armazena as dúvidas e o escopo no data attribute
    card.dataset.duvidas = textoDuvidas;
    card.dataset.escopo = textoEscopo;

    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-card-btn';
    deleteBtn.innerHTML = '&times;';
    card.appendChild(deleteBtn);

    // Cria o cabeçalho do card dinamicamente
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';

    const prioritySpan = document.createElement('span');
    prioritySpan.className = 'priority';
    prioritySpan.textContent = dadosOrcamento.prioridade;

    // Define a classe de cor com base na prioridade
    const prioridadeClasse = dadosOrcamento.prioridade.toLowerCase();
    if (prioridadeClasse === 'alta') {
        prioritySpan.classList.add('high');
    } else if (prioridadeClasse === 'média') {
        prioritySpan.classList.add('medium');
    } else {
        prioritySpan.classList.add('low');
    }
    
    cardHeader.appendChild(prioritySpan);
    card.appendChild(cardHeader);


    const cardTitle = document.createElement('h4');
    cardTitle.className = 'card-title';
    cardTitle.textContent = dadosOrcamento.projeto;
    card.appendChild(cardTitle);

    const cardClient = document.createElement('p');
    cardClient.className = 'card-client';
    cardClient.textContent = `Cliente: ${dadosOrcamento.cliente}`;
    card.appendChild(cardClient);

    const cardDates = document.createElement('div');
    cardDates.className = 'card-dates';
    cardDates.innerHTML = `<p><strong>Entrada:</strong> ${dadosOrcamento.entrada}</p><p><strong>Limite:</strong> ${dadosOrcamento.limite}</p>`;
    card.appendChild(cardDates);

    // Retorna o elemento card em vez de adicioná-lo diretamente
    return card;
}

// --- Lógica de Arrastar e Soltar (Drag and Drop) ---
document.querySelectorAll('.kanban-column').forEach((column, index) => {
    column.addEventListener('dragover', e => e.preventDefault());
    column.addEventListener('drop', e => {
        e.preventDefault();
        const draggingCard = document.querySelector('.dragging');
        if (!draggingCard) return;

        const escopoVazio = draggingCard.dataset.escopo.trim() === '';
        const naoEhPrimeiraColuna = index > 0;

        if (escopoVazio && naoEhPrimeiraColuna) {
            // Movimento ilegal: card sem escopo fora da primeira coluna
            alert("Por favor, adicione o escopo antes de mover o card.");
            
            // Prepara para edição
            cardEmEdicao = draggingCard;
            
            // Preenche o modal com os dados existentes
            document.getElementById('scope-input').value = draggingCard.dataset.escopo;
            document.getElementById('duvidas-geradas-input').value = draggingCard.dataset.duvidas;
            
            // Abre o modal de dúvidas
            duvidasModal.style.display = 'block';

        } else {
            // Movimento legal
            column.appendChild(draggingCard);
            salvarEstado();
        }
    });
});

// Lógica de Exclusão e Visualização de Dúvidas (Event Delegation)
kanbanBoard.addEventListener('click', (event) => {
    const cardClicado = event.target.closest('.kanban-card');

    // Se o clique foi no botão de deletar
    if (event.target.classList.contains('delete-card-btn')) {
        if (window.confirm("Tem certeza que deseja excluir este card?")) {
            cardClicado.remove();
            salvarEstado(); // Salva o estado após excluir um card
        }
        return; // Para a execução para não abrir o modal
    }

    // Se o clique foi em um card
    if (cardClicado) {
        cardSendoEditado = cardClicado; // Guarda a referência do card clicado

        // Extrai todas as informações do card
        const projeto = cardClicado.querySelector('.card-title').textContent;
        const cliente = cardClicado.querySelector('.card-client').textContent.replace('Cliente: ', '');
        const entrada = cardClicado.querySelector('.card-dates p:nth-child(1)').textContent.replace('Entrada: ', '');
        const limite = cardClicado.querySelector('.card-dates p:nth-child(2)').textContent.replace('Limite: ', '');
        const prioridade = cardClicado.querySelector('.priority').textContent;
        const duvidas = cardClicado.dataset.duvidas || 'Nenhuma dúvida cadastrada.';
        const escopo = cardClicado.dataset.escopo || 'Nenhum escopo cadastrado.';

        // Preenche o modal de detalhes (modo visualização)
        document.getElementById('detalhes-projeto').textContent = projeto;
        document.getElementById('detalhes-cliente').textContent = cliente;
        document.getElementById('detalhes-prioridade').textContent = prioridade;
        document.getElementById('detalhes-entrada').textContent = entrada;
        document.getElementById('detalhes-limite').textContent = limite;
        document.getElementById('detalhes-duvidas').innerText = duvidas;
        document.getElementById('detalhes-escopo').innerText = escopo;

        // Garante que o modal está no modo de visualização
        document.getElementById('view-mode').classList.remove('hidden');
        document.getElementById('edit-mode').classList.add('hidden');
        document.querySelectorAll('.view-mode-field').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.edit-mode-field').forEach(el => el.classList.add('hidden'));
        document.getElementById('editar-card-btn').classList.remove('hidden');
        document.getElementById('salvar-card-btn').classList.add('hidden');

        // Exibe o modal
        detalhesModal.style.display = 'block';
    }
});

// --- Funções e Event Listeners dos Modais ---

// Botão "Gerar Dúvidas" do segundo modal
const generateDoubtsBtn = document.getElementById('generate-doubts-btn');
const copiarDuvidasBtn = document.getElementById('copiar-duvidas-btn');

// Abre o primeiro modal
novoOrcamentoBtn.addEventListener('click', () => {
    document.getElementById('entry-date').value = new Date().toISOString().slice(0, 10);
    orcamentoModal.style.display = 'block';
});

// Fecha qualquer modal aberto
function closeModal() {
    orcamentoModal.style.display = 'none';
    duvidasModal.style.display = 'none';
    detalhesModal.style.display = 'none';
    cardSendoEditado = null; // Limpa a referência ao fechar
}

// Adiciona evento de fechar aos botões 'X' de todos os modais
document.querySelectorAll('.modal .close-button').forEach(btn => btn.addEventListener('click', closeModal));

// Fecha o modal se o usuário clicar fora do conteúdo
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
});

// Lida com o envio do primeiro formulário (orçamento)
orcamentoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    cardEmEdicao = null; // Garante que não estamos em modo de edição

    // Salva os dados na variável temporária
    dadosOrcamentoTemporario = {
        projeto: document.getElementById('project-name').value,
        cliente: document.getElementById('client-name').value,
        entrada: document.getElementById('entry-date').value,
        limite: document.getElementById('deadline-date').value,
        prioridade: document.getElementById('prioridade-input').value
    };

    // Fecha o primeiro modal e abre o segundo
    closeModal();
    duvidasModal.style.display = 'block';
    
    // Limpa o formulário para a próxima vez
    orcamentoForm.reset();
});

// Lida com o clique no botão "Gerar Dúvidas"
generateDoubtsBtn.addEventListener('click', async () => {
    const scopeText = document.getElementById('scope-input').value;
    const doubtsContainer = document.getElementById('duvidas-geradas-input');

    if (!scopeText.trim()) {
        alert('Por favor, insira o escopo do serviço.');
        return;
    }

    // Feedback visual para o usuário
    doubtsContainer.value = 'Gerando dúvidas...';
    doubtsContainer.disabled = true;
    generateDoubtsBtn.disabled = true;

    try {
        const response = await fetch('/api/gerar-duvidas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ escopo: scopeText }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        doubtsContainer.value = data.duvidasCompleta;

    } catch (error) {
        console.error('Erro ao gerar dúvidas:', error);
        doubtsContainer.value = `Ocorreu um erro: ${error.message}. Tente novamente.`;
        alert(`Erro ao se comunicar com a API: ${error.message}`);
    } finally {
        // Restaura a interface
        doubtsContainer.disabled = false;
        generateDoubtsBtn.disabled = false;
    }
});

// Lida com o clique no botão "Copiar Dúvidas"
copiarDuvidasBtn.addEventListener('click', () => {
    const doubtsTextarea = document.getElementById('duvidas-geradas-input');
    const textToCopy = doubtsTextarea.value;

    if (!textToCopy.trim() || textToCopy === 'Gerando dúvidas...') {
        alert('Não há dúvidas para copiar.');
        return;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        // Feedback visual
        const originalText = copiarDuvidasBtn.textContent;
        copiarDuvidasBtn.textContent = 'Copiado!';
        setTimeout(() => {
            copiarDuvidasBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
        alert('Falha ao copiar as dúvidas. Verifique as permissões do navegador.');
    });
});


// Botão "Criar Card" do segundo modal
const createCardFinalBtn = document.getElementById('create-card-final-btn');

createCardFinalBtn.addEventListener('click', () => {
    const textoDuvidas = document.getElementById('duvidas-geradas-input').value;
    const textoEscopo = document.getElementById('scope-input').value;

    if (cardEmEdicao) {
        // --- MODO DE ATUALIZAÇÃO ---
        cardEmEdicao.dataset.escopo = textoEscopo;
        cardEmEdicao.dataset.duvidas = textoDuvidas;

        // Se agora temos um escopo, move o card para a segunda coluna
        if (textoEscopo.trim() !== '') {
            const segundaColuna = document.querySelectorAll('.kanban-column')[1];
            segundaColuna.appendChild(cardEmEdicao);
        }
        
        cardEmEdicao = null; // Reseta o estado de edição

    } else {
        // --- MODO DE CRIAÇÃO (Lógica original) ---
        const novoCard = criarCardOrcamento(dadosOrcamentoTemporario, textoDuvidas, textoEscopo);

        const colunas = document.querySelectorAll('.kanban-column');
        if (textoEscopo.trim() === '') {
            colunas[0].appendChild(novoCard);
        } else {
            colunas[1].appendChild(novoCard);
        }
    }

    // Limpa os campos do modal
    document.getElementById('duvidas-geradas-input').value = '';
    document.getElementById('scope-input').value = '';

    // Fecha o modal e salva o estado
    closeModal();
    salvarEstado();
});

// --- Lógica de Edição do Modal de Detalhes ---
const editarCardBtn = document.getElementById('editar-card-btn');
const salvarCardBtn = document.getElementById('salvar-card-btn');

editarCardBtn.addEventListener('click', () => {
    // Esconde campos de visualização e mostra campos de edição
    document.getElementById('view-mode').classList.add('hidden');
    document.getElementById('edit-mode').classList.remove('hidden');
    document.querySelectorAll('.view-mode-field').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.edit-mode-field').forEach(el => el.classList.remove('hidden'));
    
    // Preenche os inputs com os valores atuais
    document.getElementById('edit-projeto').value = document.getElementById('detalhes-projeto').textContent;
    document.getElementById('edit-cliente').value = document.getElementById('detalhes-cliente').textContent;
    document.getElementById('edit-prioridade').value = document.getElementById('detalhes-prioridade').textContent;
    document.getElementById('edit-entrada').value = cardSendoEditado.querySelector('.card-dates p:nth-child(1)').textContent.replace('Entrada: ', '');
    document.getElementById('edit-limite').value = cardSendoEditado.querySelector('.card-dates p:nth-child(2)').textContent.replace('Limite: ', '');
    document.getElementById('edit-escopo').value = cardSendoEditado.dataset.escopo;
    document.getElementById('edit-duvidas').value = cardSendoEditado.dataset.duvidas;

    // Troca os botões
    editarCardBtn.classList.add('hidden');
    salvarCardBtn.classList.remove('hidden');
});

salvarCardBtn.addEventListener('click', () => {
    if (!cardSendoEditado) return;

    // Pega os novos valores dos inputs
    const novoProjeto = document.getElementById('edit-projeto').value;
    const novoCliente = document.getElementById('edit-cliente').value;
    const novaPrioridade = document.getElementById('edit-prioridade').value;
    const novaEntrada = document.getElementById('edit-entrada').value;
    const novoLimite = document.getElementById('edit-limite').value;
    const novoEscopo = document.getElementById('edit-escopo').value;
    const novasDuvidas = document.getElementById('edit-duvidas').value;

    // Atualiza o card no Kanban
    cardSendoEditado.querySelector('.card-title').textContent = novoProjeto;
    cardSendoEditado.querySelector('.card-client').textContent = `Cliente: ${novoCliente}`;
    cardSendoEditado.querySelector('.priority').textContent = novaPrioridade;
    cardSendoEditado.querySelector('.card-dates').innerHTML = `<p><strong>Entrada:</strong> ${novaEntrada}</p><p><strong>Limite:</strong> ${novoLimite}</p>`;
    cardSendoEditado.dataset.escopo = novoEscopo;
    cardSendoEditado.dataset.duvidas = novasDuvidas;
    
    // Atualiza a cor da prioridade
    const prioritySpan = cardSendoEditado.querySelector('.priority');
    prioritySpan.className = 'priority'; // Reseta as classes
    const prioridadeClasse = novaPrioridade.toLowerCase();
    if (prioridadeClasse === 'alta') {
        prioritySpan.classList.add('high');
    } else if (prioridadeClasse === 'média') {
        prioritySpan.classList.add('medium');
    } else {
        prioritySpan.classList.add('low');
    }

    // Salva o estado e fecha o modal
    salvarEstado();
    closeModal();
});


// --- Lógica de Persistência de Dados ---

/**
 * Salva o estado atual do painel Kanban no localStorage.
 */
function salvarEstado() {
    const colunas = [];
    document.querySelectorAll('.kanban-column').forEach((colunaEl, columnIndex) => {
        const cards = [];
        colunaEl.querySelectorAll('.kanban-card').forEach(cardEl => {
            // Extrai os dados do elemento do card
            const cardData = {
                projeto: cardEl.querySelector('.card-title').textContent,
                cliente: cardEl.querySelector('.card-client').textContent.replace('Cliente: ', ''),
                entrada: cardEl.querySelector('.card-dates p:nth-child(1)').textContent.replace('Entrada: ', ''),
                limite: cardEl.querySelector('.card-dates p:nth-child(2)').textContent.replace('Limite: ', ''),
                prioridade: cardEl.querySelector('.priority').textContent,
                duvidas: cardEl.dataset.duvidas || '',
                escopo: cardEl.dataset.escopo || ''
            };
            cards.push(cardData);
        });
        colunas.push({ columnIndex, cards });
    });

    localStorage.setItem('kanbanData', JSON.stringify(colunas));
}

/**
 * Carrega o estado do painel Kanban do localStorage ao iniciar.
 */
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
                const novoCard = criarCardOrcamento(cardData, cardData.duvidas, cardData.escopo);
                colunaEl.appendChild(novoCard);
            });
        }
    });
}

// --- Lógica de Autossugestão de Cliente ---
const clientInput = document.getElementById('client-name');
const suggestionsContainer = document.getElementById('sugestoes-cliente');

/**
 * Mostra sugestões de clientes com base no input.
 * @param {string} valorInput - O texto digitado pelo usuário.
 */
function mostrarSugestoes(valorInput) {
    suggestionsContainer.innerHTML = '';
    if (valorInput.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const data = localStorage.getItem('kanbanData');
    if (!data) return;

    const colunas = JSON.parse(data);
    const todosClientes = colunas.flatMap(coluna => coluna.cards.map(card => card.cliente));
    const clientesUnicos = [...new Set(todosClientes)];

    const sugestoesFiltradas = clientesUnicos.filter(cliente => 
        cliente.toLowerCase().startsWith(valorInput.toLowerCase())
    );

    if (sugestoesFiltradas.length > 0) {
        sugestoesFiltradas.forEach(sugestao => {
            const div = document.createElement('div');
            div.textContent = sugestao;
            div.className = 'sugestao-item';
            suggestionsContainer.appendChild(div);
        });
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Event listener para quando o usuário digita no campo
clientInput.addEventListener('input', () => {
    mostrarSugestoes(clientInput.value);
});

// Event listener para selecionar uma sugestão
suggestionsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('sugestao-item')) {
        clientInput.value = event.target.textContent;
        suggestionsContainer.style.display = 'none';
    }
});

// Esconde as sugestões se clicar fora
document.addEventListener('click', (event) => {
    if (!clientInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});


// --- Inicialização ---
// Carrega o estado salvo quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarEstado);
