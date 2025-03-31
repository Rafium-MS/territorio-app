// Variáveis globais
let territorios = [];
let territorioSelecionado = null;
let ruaSelecionada = null;

// Elementos DOM
const territoriosAccordion = document.getElementById('territorios-accordion');
const formTerritorio = document.getElementById('form-territorio');
const loadingIndicator = document.getElementById('loading');
const semDadosAlert = document.getElementById('sem-dados');

// Modais
const modalRua = new bootstrap.Modal(document.getElementById('modal-rua'));
const modalImovel = new bootstrap.Modal(document.getElementById('modal-imovel'));
const modalConfirmarRemover = new bootstrap.Modal(document.getElementById('modal-confirmar-remover'));
const modalImportarExportar = new bootstrap.Modal(document.getElementById('modal-importar-exportar'));

// Elementos dos modais
const territorioIdRua = document.getElementById('territorio-id-rua');
const ruaIdImovel = document.getElementById('rua-id-imovel');
const removerTipoInput = document.getElementById('remover-tipo');
const removerIdInput = document.getElementById('remover-id');
const removerMensagem = document.getElementById('remover-mensagem');

// Botões
const btnSalvarRua = document.getElementById('btn-salvar-rua');
const btnSalvarImovel = document.getElementById('btn-salvar-imovel');
const btnConfirmarRemover = document.getElementById('btn-confirmar-remover');
const btnImportarTerritorio = document.getElementById('btn-importar-territorio');
const btnExportarTerritorio = document.getElementById('btn-exportar-territorio');
const btnRealizarImportacao = document.getElementById('btn-realizar-importacao');
const btnRealizarExportacao = document.getElementById('btn-realizar-exportacao');
const exportarTodos = document.getElementById('exportar-todos');

/**
 * Inicializa a página
 */
function init() {
    // Carregar dados do localStorage
    carregarTerritorios();
    
    // Configurar event listeners
    configurarEventListeners();
}

/**
 * Carrega os territórios do localStorage
 */
function carregarTerritorios() {
    loadingIndicator.classList.remove('d-none');
    
    try {
        const territoriosJSON = localStorage.getItem('territorios');
        if (territoriosJSON) {
            territorios = JSON.parse(territoriosJSON);
        } else {
            // Se não houver territórios, mostrar alerta
            semDadosAlert.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Erro ao carregar territórios:', error);
        mostrarMensagem('Erro ao carregar territórios do armazenamento local.', 'danger');
    } finally {
        loadingIndicator.classList.add('d-none');
        renderizarTerritorios();
    }
}

/**
 * Configura os event listeners
 */
function configurarEventListeners() {
    // Listener para o formulário de território
    formTerritorio.addEventListener('submit', adicionarTerritorio);
    
    // Listeners para modais
    btnSalvarRua.addEventListener('click', adicionarRua);
    btnSalvarImovel.addEventListener('click', adicionarImovel);
    btnConfirmarRemover.addEventListener('click', confirmarRemocao);
    
    // Listeners para importar/exportar
    btnImportarTerritorio.addEventListener('click', abrirModalImportarExportar);
    btnExportarTerritorio.addEventListener('click', abrirModalImportarExportar);
    btnRealizarImportacao.addEventListener('click', realizarImportacao);
    btnRealizarExportacao.addEventListener('click', realizarExportacao);
    exportarTodos.addEventListener('change', toggleSelecionarTodos);
    
    // Reset dos forms quando o modal fechar
    document.getElementById('modal-rua').addEventListener('hidden.bs.modal', function () {
        document.getElementById('form-rua').reset();
    });
    
    document.getElementById('modal-imovel').addEventListener('hidden.bs.modal', function () {
        document.getElementById('form-imovel').reset();
    });
}

/**
 * Adiciona um novo território
 * @param {Event} e - Evento do formulário
 */
function adicionarTerritorio(e) {
    e.preventDefault();
    
    const nome = document.getElementById('territorio-nome').value.trim();
    const descricao = document.getElementById('territorio-descricao').value.trim();
    const regiao = document.getElementById('territorio-regiao').value;
    const observacoes = document.getElementById('territorio-observacoes').value.trim();
    
    if (!nome) {
        mostrarMensagem('Por favor, informe o nome do território.', 'warning');
        return;
    }
    
    // Verificar se já existe um território com o mesmo nome
    const territorioExistente = territorios.find(t => t.nome.toLowerCase() === nome.toLowerCase());
    if (territorioExistente) {
        mostrarMensagem('Já existe um território com este nome.', 'warning');
        return;
    }
    
    // Criar novo território
    const novoTerritorio = {
        id: gerarId(),
        nome,
        descricao,
        regiao,
        observacoes,
        ruas: [],
        dataCriacao: new Date().toISOString()
    };
    
    // Adicionar ao array e salvar
    territorios.push(novoTerritorio);
    salvarTerritorios();
    
    // Limpar formulário
    formTerritorio.reset();
    
    // Atualizar UI
    renderizarTerritorios();
    
    // Mostrar mensagem de sucesso
    mostrarMensagem('Território adicionado com sucesso!', 'success');
}

/**
 * Abre o modal para adicionar uma rua
 * @param {string} territorioId - ID do território
 */
function abrirModalRua(territorioId) {
    territorioIdRua.value = territorioId;
    modalRua.show();
}

/**
 * Adiciona uma nova rua ao território
 */
function adicionarRua() {
    const territorioId = territorioIdRua.value;
    const nome = document.getElementById('rua-nome').value.trim();
    const tipo = document.getElementById('rua-tipo').value;
    const observacoes = document.getElementById('rua-observacoes').value.trim();
    
    if (!nome) {
        mostrarMensagem('Por favor, informe o nome da rua.', 'warning');
        return;
    }
    
    // Encontrar o território
    const territorioIndex = territorios.findIndex(t => t.id === territorioId);
    if (territorioIndex === -1) {
        mostrarMensagem('Território não encontrado.', 'danger');
        return;
    }
    
    // Verificar se já existe uma rua com o mesmo nome neste território
    const ruaExistente = territorios[territorioIndex].ruas.find(r => r.nome.toLowerCase() === nome.toLowerCase());
    if (ruaExistente) {
        mostrarMensagem('Já existe uma rua com este nome neste território.', 'warning');
        return;
    }
    
    // Criar nova rua
    const novaRua = {
        id: gerarId(),
        nome,
        tipo,
        observacoes,
        imoveis: [],
        dataCriacao: new Date().toISOString()
    };
    
    // Adicionar ao território e salvar
    territorios[territorioIndex].ruas.push(novaRua);
    salvarTerritorios();
    
    // Fechar modal
    modalRua.hide();
    
    // Atualizar UI
    renderizarTerritorios();
    
    // Mostrar mensagem de sucesso
    mostrarMensagem('Rua adicionada com sucesso!', 'success');
}

/**
 * Abre o modal para adicionar um imóvel
 * @param {string} ruaId - ID da rua
 */
function abrirModalImovel(ruaId) {
    ruaIdImovel.value = ruaId;
    modalImovel.show();
}

/**
 * Adiciona um novo imóvel à rua
 */
function adicionarImovel() {
    const ruaId = ruaIdImovel.value;
    const numero = document.getElementById('imovel-numero').value.trim();
    const tipo = document.getElementById('imovel-tipo').value;
    const complemento = document.getElementById('imovel-complemento').value.trim();
    const observacoes = document.getElementById('imovel-observacoes').value.trim();
    
    if (!numero) {
        mostrarMensagem('Por favor, informe o número do imóvel.', 'warning');
        return;
    }
    
    // Encontrar a rua
    let ruaEncontrada = false;
    let territorioIndex = -1;
    let ruaIndex = -1;
    
    for (let i = 0; i < territorios.length; i++) {
        const idx = territorios[i].ruas.findIndex(r => r.id === ruaId);
        if (idx !== -1) {
            ruaEncontrada = true;
            territorioIndex = i;
            ruaIndex = idx;
            break;
        }
    }
    
    if (!ruaEncontrada) {
        mostrarMensagem('Rua não encontrada.', 'danger');
        return;
    }
    
    // Verificar se já existe um imóvel com o mesmo número nesta rua
    const imovelExistente = territorios[territorioIndex].ruas[ruaIndex].imoveis.find(
        i => i.numero.toLowerCase() === numero.toLowerCase()
    );
    
    if (imovelExistente) {
        mostrarMensagem('Já existe um imóvel com este número nesta rua.', 'warning');
        return;
    }
    
    // Criar novo imóvel
    const novoImovel = {
        id: gerarId(),
        numero,
        tipo,
        complemento,
        observacoes,
        ruaId,
        dataCriacao: new Date().toISOString()
    };
    
    // Adicionar à rua e salvar
    territorios[territorioIndex].ruas[ruaIndex].imoveis.push(novoImovel);
    salvarTerritorios();
    
    // Fechar modal
    modalImovel.hide();
    
    // Atualizar UI
    renderizarTerritorios();
    
    // Mostrar mensagem de sucesso
    mostrarMensagem('Imóvel adicionado com sucesso!', 'success');
}

/**
 * Abre o modal de confirmação para remover um item
 * @param {string} tipo - Tipo do item (territorio, rua, imovel)
 * @param {string} id - ID do item
 */
function abrirModalConfirmarRemocao(tipo, id) {
    let mensagem = '';
    
    switch(tipo) {
        case 'territorio':
            const territorio = territorios.find(t => t.id === id);
            if (territorio) {
                mensagem = `Tem certeza que deseja remover o território "${territorio.nome}"? Todos os dados (ruas e imóveis) serão perdidos permanentemente.`;
            }
            break;
        case 'rua':
            let ruaEncontrada = null;
            let territorioRua = null;
            for (const terr of territorios) {
                const rua = terr.ruas.find(r => r.id === id);
                if (rua) {
                    ruaEncontrada = rua;
                    territorioRua = terr;
                    break;
                }
            }
            if (ruaEncontrada) {
                mensagem = `Tem certeza que deseja remover a rua "${ruaEncontrada.nome}" do território "${territorioRua.nome}"? Todos os imóveis desta rua serão perdidos permanentemente.`;
            }
            break;
        case 'imovel':
            let imovelEncontrado = null;
            let ruaImovel = null;
            let territorioImovel = null;
            
            for (const terr of territorios) {
                for (const rua of terr.ruas) {
                    const imovel = rua.imoveis.find(i => i.id === id);
                    if (imovel) {
                        imovelEncontrado = imovel;
                        ruaImovel = rua;
                        territorioImovel = terr;
                        break;
                    }
                }
                if (imovelEncontrado) break;
            }
            
            if (imovelEncontrado) {
                mensagem = `Tem certeza que deseja remover o imóvel Nº "${imovelEncontrado.numero}" da rua "${ruaImovel.nome}"?`;
            }
            break;
        default:
            mensagem = "Tem certeza que deseja remover este item? Esta ação não pode ser desfeita.";
    }
    
    removerTipoInput.value = tipo;
    removerIdInput.value = id;
    removerMensagem.textContent = mensagem;
    modalConfirmarRemover.show();
}

/**
 * Confirma a remoção do item
 */
function confirmarRemocao() {
    const tipo = removerTipoInput.value;
    const id = removerIdInput.value;
    
    switch(tipo) {
        case 'territorio':
            // Remover território
            territorios = territorios.filter(t => t.id !== id);
            break;
        case 'rua':
            // Remover rua de um território
            for (let i = 0; i < territorios.length; i++) {
                territorios[i].ruas = territorios[i].ruas.filter(r => r.id !== id);
            }
            break;
        case 'imovel':
            // Remover imóvel de uma rua
            for (let i = 0; i < territorios.length; i++) {
                for (let j = 0; j < territorios[i].ruas.length; j++) {
                    territorios[i].ruas[j].imoveis = territorios[i].ruas[j].imoveis.filter(im => im.id !== id);
                }
            }
            break;
    }
    
    // Salvar alterações
    salvarTerritorios();
    
    // Fechar modal
    modalConfirmarRemover.hide();
    
    // Atualizar UI
    renderizarTerritorios();
    
    // Mostrar mensagem de sucesso
    mostrarMensagem('Item removido com sucesso!', 'success');
}

/**
 * Abre o modal de importação/exportação
 * @param {Event} e - Evento do botão
 */
function abrirModalImportarExportar(e) {
    // Identificar se é importação ou exportação com base no ID do botão
    const isImport = e.currentTarget.id === 'btn-importar-territorio';
    
    // Selecionar a aba correta
    const tabImport = document.getElementById('import-tab');
    const tabExport = document.getElementById('export-tab');
    
    if (isImport) {
        const bootstrapTabImport = new bootstrap.Tab(tabImport);
        bootstrapTabImport.show();
    } else {
        const bootstrapTabExport = new bootstrap.Tab(tabExport);
        bootstrapTabExport.show();
        
        // Preencher lista de territórios para exportação
        preencherListaTerritoriosExportar();
    }
    
    // Abrir modal
    modalImportarExportar.show();
}

/**
 * Preenche a lista de territórios para exportação
 */
function preencherListaTerritoriosExportar() {
    const listaTerritorios = document.getElementById('lista-territorios-exportar');
    listaTerritorios.innerHTML = '';
    
    if (territorios.length === 0) {
        listaTerritorios.innerHTML = '<div class="alert alert-info">Não há territórios cadastrados para exportar.</div>';
        return;
    }
    
    territorios.forEach(territorio => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        
        item.innerHTML = `
            <div class="form-check">
                <input class="form-check-input territorio-export-check" type="checkbox" value="${territorio.id}" id="check-${territorio.id}" checked>
                <label class="form-check-label" for="check-${territorio.id}">
                    ${territorio.nome} (${territorio.ruas.length} ruas, ${contarImoveis(territorio)} imóveis)
                </label>
            </div>
        `;
        
        listaTerritorios.appendChild(item);
    });
}

/**
 * Conta o total de imóveis em um território
 * @param {Object} territorio - Objeto do território
 * @returns {number} - Total de imóveis
 */
function contarImoveis(territorio) {
    let total = 0;
    territorio.ruas.forEach(rua => {
        total += rua.imoveis.length;
    });
    return total;
}

/**
 * Seleciona/deseleciona todos os territórios para exportação
 */
function toggleSelecionarTodos() {
    const selecionarTodos = document.getElementById('exportar-todos').checked;
    const checkboxes = document.querySelectorAll('.territorio-export-check');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selecionarTodos;
    });
}

/**
 * Importa territórios de um arquivo JSON
 */
function realizarImportacao() {
    const fileInput = document.getElementById('importar-arquivo');
    const substituir = document.getElementById('importar-substituir').checked;
    
    if (!fileInput.files || fileInput.files.length === 0) {
        mostrarMensagem('Por favor, selecione um arquivo para importar.', 'warning');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            const dadosImportados = JSON.parse(event.target.result);
            
            if (!Array.isArray(dadosImportados)) {
                throw new Error('Formato inválido. O arquivo deve conter um array de territórios.');
            }
            
            if (substituir) {
                // Substituir todos os territórios
                territorios = dadosImportados;
            } else {
                // Adicionar novos territórios, evitando duplicações por nome
                const nomesExistentes = territorios.map(t => t.nome.toLowerCase());
                
                dadosImportados.forEach(territorio => {
                    if (!nomesExistentes.includes(territorio.nome.toLowerCase())) {
                        territorios.push(territorio);
                        nomesExistentes.push(territorio.nome.toLowerCase());
                    }
                });
            }
            
            // Salvar territórios
            salvarTerritorios();
            
            // Atualizar UI
            renderizarTerritorios();
            
            // Fechar modal
            modalImportarExportar.hide();
            
            // Mostrar mensagem de sucesso
            const totalImportados = substituir ? dadosImportados.length : 
                dadosImportados.filter(t => !nomesExistentes.includes(t.nome.toLowerCase())).length;
            
            mostrarMensagem(`Importação concluída com sucesso! ${totalImportados} territórios importados.`, 'success');
            
        } catch (error) {
            console.error('Erro ao importar territórios:', error);
            mostrarMensagem(`Erro ao importar territórios: ${error.message}`, 'danger');
        }
    };
    
    reader.onerror = function() {
        mostrarMensagem('Erro ao ler o arquivo.', 'danger');
    };
    
    reader.readAsText(file);
}

/**
 * Exporta territórios para um arquivo JSON
 */
function realizarExportacao() {
    // Obter territórios selecionados
    const checkboxes = document.querySelectorAll('.territorio-export-check:checked');
    
    if (checkboxes.length === 0) {
        mostrarMensagem('Selecione pelo menos um território para exportar.', 'warning');
        return;
    }
    
    const idsTerritorios = Array.from(checkboxes).map(cb => cb.value);
    const territoriosExportar = territorios.filter(t => idsTerritorios.includes(t.id));
    
    // Criar arquivo JSON
    const dadosJSON = JSON.stringify(territoriosExportar, null, 2);
    const blob = new Blob([dadosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Criar link para download
    const link = document.createElement('a');
    link.href = url;
    link.download = `territorios_${formatarDataArquivo(new Date())}.json`;
    link.click();
    
    // Liberar URL
    URL.revokeObjectURL(url);
    
    // Fechar modal
    modalImportarExportar.hide();
    
    // Mostrar mensagem de sucesso
    mostrarMensagem(`${territoriosExportar.length} territórios exportados com sucesso!`, 'success');
}

/**
 * Renderiza a lista de territórios na interface
 */
function renderizarTerritorios() {
    territoriosAccordion.innerHTML = '';
    
    if (territorios.length === 0) {
        semDadosAlert.classList.remove('d-none');
        return;
    }
    
    semDadosAlert.classList.add('d-none');
    
    territorios.forEach((territorio, index) => {
        const territorioHTML = criarHTMLTerritorio(territorio, index);
        territoriosAccordion.appendChild(territorioHTML);
    });
    
    // Aplicar event listeners para os botões de adicionar rua/imóvel após renderizar
    aplicarEventListeners();
}

/**
 * Cria o HTML para um território
 * @param {Object} territorio - Objeto do território
 * @param {number} index - Índice do território na lista
 * @returns {HTMLElement} - Elemento do território
 */
function criarHTMLTerritorio(territorio, index) {
    const div = document.createElement('div');
    div.className = 'accordion-item';
    div.setAttribute('data-territorio-id', territorio.id);
    
    const totalRuas = territorio.ruas.length;
    const totalImoveis = contarImoveis(territorio);
    
    div.innerHTML = `
        <h2 class="accordion-header" id="heading-${territorio.id}">
            <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${territorio.id}" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse-${territorio.id}">
                <div class="d-flex justify-content-between align-items-center w-100 me-3">
                    <span>${territorio.nome}</span>
                    <span class="badge bg-primary rounded-pill">${totalRuas} ruas, ${totalImoveis} imóveis</span>
                </div>
            </button>
        </h2>
        <div id="collapse-${territorio.id}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading-${territorio.id}" data-bs-parent="#territorios-accordion">
            <div class="accordion-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        ${territorio.descricao ? `<p class="text-muted mb-1">${territorio.descricao}</p>` : ''}
                        <p class="text-muted mb-0">
                            ${territorio.regiao ? `<span class="badge bg-secondary me-2">${formatarRegiao(territorio.regiao)}</span>` : ''}
                            ${territorio.observacoes ? `<small><i class="fas fa-info-circle me-1"></i>${territorio.observacoes}</small>` : ''}
                        </p>
                    </div>
                    <div>
                        <button class="btn btn-success btn-sm" onclick="abrirModalRua('${territorio.id}')">
                            <i class="fas fa-plus-circle me-1"></i> Adicionar Rua
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="abrirModalConfirmarRemocao('territorio', '${territorio.id}')">
                            <i class="fas fa-trash me-1"></i> Remover
                        </button>
                    </div>
                </div>
                
                <div class="ruas-container">
                    ${territorio.ruas.length > 0 ? 
                        territorio.ruas.map(rua => criarHTMLRua(rua, territorio.id)).join('') : 
                        '<div class="alert alert-info">Nenhuma rua cadastrada neste território. Adicione uma rua para começar.</div>'
                    }
                </div>
            </div>
        </div>
    `;
    
    return div;
}

/**
 * Cria o HTML para uma rua
 * @param {Object} rua - Objeto da rua
 * @param {string} territorioId - ID do território
 * @returns {string} - HTML da rua
 */
function criarHTMLRua(rua, territorioId) {
    return `
        <div class="card mb-3 rua-card" data-rua-id="${rua.id}">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 class="mb-0">${formatarTipoRua(rua.tipo)} ${rua.nome}</h5>
                <div>
                    <button class="btn btn-primary btn-sm" onclick="abrirModalImovel('${rua.id}')">
                        <i class="fas fa-plus-circle me-1"></i> Adicionar Imóvel
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="abrirModalConfirmarRemocao('rua', '${rua.id}')">
                        <i class="fas fa-trash me-1"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                ${rua.observacoes ? `<p class="text-muted mb-3"><small><i class="fas fa-info-circle me-1"></i>${rua.observacoes}</small></p>` : ''}
                
                <div class="imoveis-container">
                    ${rua.imoveis.length > 0 ? 
                        `<div class="row">
                            ${rua.imoveis.map(imovel => criarHTMLImovel(imovel)).join('')}
                        </div>` : 
                        '<div class="alert alert-info">Nenhum imóvel cadastrado nesta rua.</div>'
                    }
                </div>
            </div>
        </div>
    `;
}

/**
 * Aplica event listeners para os botões após renderizar
 */
function aplicarEventListeners() {
    // Aqui podemos adicionar qualquer event listener para botões dinâmicos
}

/**
 * Salva os territórios no localStorage
 */
function salvarTerritorios() {
    try {
        localStorage.setItem('territorios', JSON.stringify(territorios));
    } catch (error) {
        console.error('Erro ao salvar territórios:', error);
        mostrarMensagem('Erro ao salvar dados. Verifique o espaço disponível no navegador.', 'danger');
    }
}

/**
 * Gera um ID único
 * @returns {string} - ID único
 */
function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Formata a região para exibição
 * @param {string} regiao - Código da região
 * @returns {string} - Nome formatado
 */
function formatarRegiao(regiao) {
    const regioes = {
        'norte': 'Zona Norte',
        'sul': 'Zona Sul',
        'leste': 'Zona Leste',
        'oeste': 'Zona Oeste',
        'centro': 'Centro',
        'outra': 'Outra Região'
    };
    return regioes[regiao] || regiao;
}

/**
 * Formata o tipo de rua para exibição
 * @param {string} tipo - Tipo da rua
 * @returns {string} - Tipo formatado
 */
function formatarTipoRua(tipo) {
    const tipos = {
        'rua': 'Rua',
        'avenida': 'Avenida',
        'travessa': 'Travessa',
        'alameda': 'Alameda',
        'viela': 'Viela',
        'outro': ''
    };
    return tipos[tipo] || '';
}

/**
 * Formata o tipo de imóvel para exibição
 * @param {string} tipo - Tipo do imóvel
 * @returns {string} - Tipo formatado
 */
function formatarTipoImovel(tipo) {
    const tipos = {
        'residencial': 'Residencial',
        'comercial': 'Comercial',
        'predio': 'Prédio',
        'vila': 'Vila',
        'terreno': 'Terreno',
        'outro': 'Outro'
    };
    return tipos[tipo] || tipo;
}

/**
 * Obtém a cor do badge para o tipo de imóvel
 * @param {string} tipo - Tipo do imóvel
 * @returns {string} - Classe CSS da cor
 */
function obterCorTipoImovel(tipo) {
    const cores = {
        'residencial': 'success',
        'comercial': 'primary',
        'predio': 'info',
        'vila': 'warning',
        'terreno': 'secondary',
        'outro': 'dark'
    };
    return cores[tipo] || 'dark';
}

/**
 * Formata a data para uso em nome de arquivo
 * @param {Date} data - Objeto data
 * @returns {string} - Data formatada (YYYY-MM-DD)
 */
function formatarDataArquivo(data) {
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

/**
 * Mostra uma mensagem de notificação
 * @param {string} mensagem - Texto da mensagem
 * @param {string} tipo - Tipo da mensagem (success, danger, warning, info)
 */
function mostrarMensagem(mensagem, tipo) {
    // Verificar se o NotificationService está disponível
    if (typeof NotificationService !== 'undefined') {
        NotificationService.show(mensagem, tipo);
        return;
    }
    
    // Implementação alternativa
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    // Adicionar ao topo da página
    const main = document.querySelector('main');
    main.insertBefore(alertDiv, main.firstChild);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Expor funções para o escopo global
window.abrirModalRua = abrirModalRua;
window.abrirModalImovel = abrirModalImovel;
window.abrirModalConfirmarRemocao = abrirModalConfirmarRemocao;

// Inicializar a página quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);

/**
 * Cria o HTML para um imóvel
 * @param {Object} imovel - Objeto do imóvel
 * @returns {string} - HTML do imóvel
 */
function criarHTMLImovel(imovel) {
    const tipoClasse = `tipo-${imovel.tipo}`;
    
    return `
        <div class="col-md-3 col-sm-6 mb-3" data-imovel-id="${imovel.id}">
            <div class="card h-100 imovel-card ${tipoClasse}">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title mb-1">Nº ${imovel.numero}</h5>
                        <button class="btn btn-sm btn-outline-danger" onclick="abrirModalConfirmarRemocao('imovel', '${imovel.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <span class="badge bg-${obterCorTipoImovel(imovel.tipo)} mb-2">${formatarTipoImovel(imovel.tipo)}</span>
                    ${imovel.complemento ? `<p class="card-text mb-1"><small>Complemento: ${imovel.complemento}</small></p>` : ''}
                    ${imovel.observacoes ? `<p class="card-text text-muted"><small>${imovel.observacoes}</small></p>` : ''}
                </div>
            </div>
        </div>
    `;
}