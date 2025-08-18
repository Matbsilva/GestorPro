document.addEventListener('DOMContentLoaded', () => {
    // Variáveis globais
    let dadosOrcamentoTemporario = {};
    let cardEmEdicao = null;
    let cardSendoEditado = null; // Guarda referência ao card no modal de detalhes
    let kanbanCards = []; // Array para armazenar os dados dos cards

    // --- Seletores de Elementos ---
    const novoOrcamentoBtn = document.querySelector('.add-button');
    const orcamentoModal = document.getElementById('orcamento-modal');
    const duvidasModal = document.getElementById('duvidas-modal');
    const detalhesModal = document.getElementById('detalhes-modal');
    const orcamentoForm = document.getElementById('orcamento-form');
    const kanbanBoard = document.querySelector('.kanban-board');
    const gerarResumoBtn = document.getElementById('gerar-resumo-detalhes-btn');

    /**
     * Salva os cards no localStorage.
     */
    function salvarCards() {
        localStorage.setItem('kanbanCards', JSON.stringify(kanbanCards));
    }

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
     * @param {object} cardData - Os dados do card.
     */
    function criarCardElemento(cardData) {
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.dataset.id = cardData.id;
        adicionarEventosDrag(card);

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-card-btn';
        deleteBtn.innerHTML = '&times;';
        card.appendChild(deleteBtn);

        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';

        const prioritySpan = document.createElement('span');
        prioritySpan.className = 'priority';
        prioritySpan.textContent = cardData.dados.prioridade;

        const prioridadeClasse = cardData.dados.prioridade.toLowerCase();
        if (prioridadeClasse === 'alta') prioritySpan.classList.add('high');
        else if (prioridadeClasse === 'média') prioritySpan.classList.add('medium');
        else prioritySpan.classList.add('low');
        
        cardHeader.appendChild(prioritySpan);
        card.appendChild(cardHeader);

        const cardTitle = document.createElement('h4');
        cardTitle.className = 'card-title';
        cardTitle.textContent = cardData.dados.projeto;
        card.appendChild(cardTitle);

        const cardClient = document.createElement('p');
        cardClient.className = 'card-client';
        cardClient.textContent = `Cliente: ${cardData.dados.cliente}`;
        card.appendChild(cardClient);

        const cardDates = document.createElement('div');
        cardDates.className = 'card-dates';
        cardDates.innerHTML = `<p><strong>Entrada:</strong> ${cardData.dados.entrada}</p><p><strong>Limite:</strong> ${cardData.dados.limite}</p>`;
        card.appendChild(cardDates);

        return card;
    }

    // --- Lógica de Arrastar e Soltar (Drag and Drop) ---
    document.querySelectorAll('.kanban-column').forEach((column, index) => {
        column.addEventListener('dragover', e => e.preventDefault());
        column.addEventListener('drop', e => {
            e.preventDefault();
            const draggingCardEl = document.querySelector('.dragging');
            if (!draggingCardEl) return;

            const cardId = draggingCardEl.dataset.id;
            const card = kanbanCards.find(c => c.id === cardId);
            
            const escopoVazio = !card.dados.escopo || card.dados.escopo.trim() === '';
            const naoEhPrimeiraColuna = index > 0;

            if (escopoVazio && naoEhPrimeiraColuna) {
                alert("Por favor, adicione o escopo antes de mover o card.");
                // A lógica para abrir o modal de edição pode ser adicionada aqui se necessário
            } else {
                card.coluna = index;
                column.appendChild(draggingCardEl);
                salvarCards();
            }
        });
    });

    // Lógica de Exclusão e Visualização de Detalhes (Event Delegation)
    kanbanBoard.addEventListener('click', (event) => {
        const cardClicado = event.target.closest('.kanban-card');
        if (!cardClicado) return;

        if (event.target.classList.contains('delete-card-btn')) {
            if (window.confirm("Tem certeza que deseja excluir este card?")) {
                const cardId = cardClicado.dataset.id;
                kanbanCards = kanbanCards.filter(c => c.id !== cardId);
                cardClicado.remove();
                salvarCards();
            }
            return;
        }

        const cardId = cardClicado.dataset.id;
        const card = kanbanCards.find(c => c.id === cardId);
        if (!card) return;

        detalhesModal.dataset.cardId = cardId; // Armazena o ID no modal

        document.getElementById('detalhes-projeto').textContent = card.dados.projeto;
        document.getElementById('detalhes-cliente').textContent = card.dados.cliente;
        document.getElementById('detalhes-prioridade').textContent = card.dados.prioridade;
        document.getElementById('detalhes-entrada').textContent = card.dados.entrada;
        document.getElementById('detalhes-limite').textContent = card.dados.limite;
        document.getElementById('detalhes-escopo').textContent = card.dados.escopo || 'Nenhum escopo definido.';
        
        // Resetar e esconder a seção de resumo
        document.getElementById('summary-section').classList.add('hidden');
        document.getElementById('analise-completa-pane').textContent = '';
        document.getElementById('resumo-cliente-pane').textContent = '';
        document.getElementById('copy-summary-btn').classList.add('hidden');
        document.getElementById('analysis-tabs-content').classList.add('hidden');


        document.getElementById('view-mode').classList.remove('hidden');
        document.getElementById('edit-mode').classList.add('hidden');
        document.querySelectorAll('.view-mode-field').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.edit-mode-field').forEach(el => el.classList.add('hidden'));
        document.getElementById('editar-card-btn').classList.remove('hidden');
        document.getElementById('salvar-card-btn').classList.add('hidden');
        document.getElementById('gerar-resumo-detalhes-btn').classList.remove('hidden');

        detalhesModal.style.display = 'block';
    });

    // --- Funções e Event Listeners dos Modais ---
    function closeModal() {
        orcamentoModal.style.display = 'none';
        duvidasModal.style.display = 'none';
        detalhesModal.style.display = 'none';
    }

    document.querySelectorAll('.modal .close-button').forEach(btn => btn.addEventListener('click', closeModal));
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) closeModal();
    });

    novoOrcamentoBtn.addEventListener('click', () => {
        orcamentoForm.reset();
        document.getElementById('entry-date').value = new Date().toISOString().slice(0, 10);
        orcamentoModal.style.display = 'block';
    });

    orcamentoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const novoCard = {
            id: `card-${new Date().getTime()}`,
            coluna: 0,
            dados: {
                projeto: document.getElementById('project-name').value,
                cliente: document.getElementById('client-name').value,
                entrada: document.getElementById('entry-date').value,
                limite: document.getElementById('deadline-date').value,
                prioridade: document.getElementById('prioridade-input').value,
                escopo: '',
                analiseCompleta: '',
                resumoCliente: ''
            }
        };

        kanbanCards.push(novoCard);
        const cardElemento = criarCardElemento(novoCard);
        document.querySelectorAll('.kanban-column')[0].appendChild(cardElemento);
        salvarCards();
        
        closeModal();
        orcamentoForm.reset();
    });

    // Substitua o event listener de gerarResumoBtn por este:
    gerarResumoBtn.addEventListener('click', async () => {
        const summarySection = document.getElementById('summary-section');
        const summaryLoader = document.getElementById('summary-loader');
        const copySummaryBtn = document.getElementById('copy-summary-btn');
        const analisePane = document.getElementById('analise-completa-pane');
        const resumoPane = document.getElementById('resumo-cliente-pane');
        const tabsContent = document.getElementById('analysis-tabs-content');

        summarySection.classList.remove('hidden');
        analisePane.textContent = '';
        resumoPane.textContent = '';
        
        const cardId = detalhesModal.dataset.cardId;
        const card = kanbanCards.find(c => c.id === cardId);

        if (card && card.dados.analiseCompleta && card.dados.resumoCliente) {
            analisePane.textContent = card.dados.analiseCompleta;
            resumoPane.textContent = card.dados.resumoCliente;
            tabsContent.classList.remove('hidden');
            copySummaryBtn.classList.remove('hidden');
            summaryLoader.classList.add('hidden');
            return;
        }

        summaryLoader.classList.remove('hidden');
        tabsContent.classList.add('hidden');
        copySummaryBtn.classList.add('hidden');

        const escopo = document.getElementById('detalhes-escopo').textContent;

        try {
            const duvidasResponse = await fetch('/api/gerar-duvidas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ escopo }) });
            if (!duvidasResponse.ok) throw new Error(`Erro API Dúvidas`);
            const duvidasData = await duvidasResponse.json();
            const analiseCompleta = duvidasData.duvidas;

            const resumoResponse = await fetch('/api/gerar-resumo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ escopo, duvidas: analiseCompleta }) });
            if (!resumoResponse.ok) throw new Error(`Erro API Resumo`);
            const resumoData = await resumoResponse.json();
            const resumoCliente = resumoData.resumo;

            if (card) {
                card.dados.analiseCompleta = analiseCompleta;
                card.dados.resumoCliente = resumoCliente;
                salvarCards();
            }

            analisePane.textContent = analiseCompleta;
            resumoPane.textContent = resumoCliente;
            
        } catch (error) {
            console.error("Falha ao gerar análise:", error);
            analisePane.textContent = 'Ocorreu um erro ao gerar a análise. Tente novamente.';
        } finally {
            summaryLoader.classList.add('hidden');
            tabsContent.classList.remove('hidden');
            copySummaryBtn.classList.remove('hidden');
        }
    });

    // --- Lógica de Edição do Modal de Detalhes ---
    const editarCardBtn = document.getElementById('editar-card-btn');
    const salvarCardBtn = document.getElementById('salvar-card-btn');

    editarCardBtn.addEventListener('click', () => {
        const cardId = detalhesModal.dataset.cardId;
        const card = kanbanCards.find(c => c.id === cardId);
        if (!card) return;

        document.getElementById('view-mode').classList.add('hidden');
        document.getElementById('edit-mode').classList.remove('hidden');
        document.querySelectorAll('.view-mode-field').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.edit-mode-field').forEach(el => el.classList.remove('hidden'));
        
        document.getElementById('edit-projeto').value = card.dados.projeto;
        document.getElementById('edit-cliente').value = card.dados.cliente;
        document.getElementById('edit-prioridade').value = card.dados.prioridade;
        document.getElementById('edit-entrada').value = card.dados.entrada;
        document.getElementById('edit-limite').value = card.dados.limite;
        document.getElementById('edit-escopo').value = card.dados.escopo;

        editarCardBtn.classList.add('hidden');
        salvarCardBtn.classList.remove('hidden');
        gerarResumoBtn.classList.add('hidden');
    });

    salvarCardBtn.addEventListener('click', () => {
        const cardId = detalhesModal.dataset.cardId;
        const card = kanbanCards.find(c => c.id === cardId);
        if (!card) return;

        card.dados.projeto = document.getElementById('edit-projeto').value;
        card.dados.cliente = document.getElementById('edit-cliente').value;
        card.dados.prioridade = document.getElementById('edit-prioridade').value;
        card.dados.entrada = document.getElementById('edit-entrada').value;
        card.dados.limite = document.getElementById('edit-limite').value;
        card.dados.escopo = document.getElementById('edit-escopo').value;

        salvarCards();
        
        // Atualiza o card na UI
        const cardElemento = document.querySelector(`.kanban-card[data-id="${cardId}"]`);
        if (cardElemento) {
            cardElemento.querySelector('.card-title').textContent = card.dados.projeto;
            cardElemento.querySelector('.card-client').textContent = `Cliente: ${card.dados.cliente}`;
            const prioritySpan = cardElemento.querySelector('.priority');
            prioritySpan.textContent = card.dados.prioridade;
            prioritySpan.className = 'priority';
            const prioridadeClasse = card.dados.prioridade.toLowerCase();
            if (prioridadeClasse === 'alta') prioritySpan.classList.add('high');
            else if (prioridadeClasse === 'média') prioritySpan.classList.add('medium');
            else prioritySpan.classList.add('low');
            cardElemento.querySelector('.card-dates').innerHTML = `<p><strong>Entrada:</strong> ${card.dados.entrada}</p><p><strong>Limite:</strong> ${card.dados.limite}</p>`;
        }

        closeModal();
    });

    /**
     * Carrega o estado do painel Kanban do localStorage ao iniciar.
     */
    function carregarEstado() {
        const data = localStorage.getItem('kanbanCards');
        if (!data) return;

        kanbanCards = JSON.parse(data);
        const todasColunasEl = document.querySelectorAll('.kanban-column');
        todasColunasEl.forEach(c => c.innerHTML = `<h3 class="column-title">${c.querySelector('.column-title').textContent}</h3>`);

        kanbanCards.forEach(cardData => {
            const colunaEl = todasColunasEl[cardData.coluna];
            if (colunaEl) {
                const novoCard = criarCardElemento(cardData);
                colunaEl.appendChild(novoCard);
            }
        });
    }

    // --- Inicialização ---
    carregarEstado();
});