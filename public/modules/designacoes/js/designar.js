// Variáveis globais
let territorios = [];
let saidasCampo = [];
let designacoes = [];
let atendimentos = {};

// Elementos DOM principais
const formDesignacao = document.getElementById('form-designacao');
const selectTerritorio = document.getElementById('territorio');
const selectSaidaCampo = document.getElementById('saida-campo');
const inputResponsavel = document.getElementById('responsavel');
const inputDataDesignacao = document.getElementById('data-designacao');
const inputDataDevolucao = document.getElementById('data-devolucao');
const inputObservacoes = document.getElementById('observacoes');
const designacoesContainer = document.getElementById('designacoes-container');
const loadingIndicator = document.getElementById('loading');
const semDadosAlert = document.getElementById('sem-dados');

// Elementos de filtro
const filtroStatus = document.getElementById('filtro-status');
const filtroSaida = document.getElementById('filtro-saida');
const filtroResponsavel = document.getElementById('filtro-responsavel');
const btnLimparFiltros = document.getElementById('btn-limpar-filtros');

// Elementos do modal de conclusão
const modalConcluir = new bootstrap.Modal(document.getElementById('modal-concluir'));
const designacaoIdInput = document.getElementById('designacao-id');
const modalInfoDesignacao = document.getElementById('modal-info-designacao');
const dataConclusaoInput = document.getElementById('data-conclusao');
const resultadoSelect = document.getElementById('resultado');
const observacoesConclusaoInput = document.getElementById('observacoes-conclusao');
const btnConfirmarConclusao = document.getElementById('btn-confirmar-conclusao');

// Elementos do modal de detalhes
const modalDetalhes = new bootstrap.Modal(document.getElementById('modal-detalhes'));

// Função para inicializar a página
async function init() {
    // Definir data padrão para os inputs
    const hoje = new Date().toISOString().split('T')[0];
    inputDataDesignacao.value = hoje;
    dataConclusaoInput.value = hoje;
    
    // Calcular data de devolução padrão (hoje + 30 dias)
    const dataDevolucao = new Date();
    dataDevolucao.setDate(dataDevolucao.getDate() + 30);
    inputDataDevolucao.value = dataDevolucao.toISOString().split('T')[0];
    
    // Carregar dados
    await carregarDados();
    
    // Configurar event listeners
    setupEventListeners();
}

// Função para carregar dados
async function carregarDados() {
    try {
        // Simular carregamento de dados do servidor
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Carregar territórios
        const territoriosJSON = localStorage.getItem('territorios');
        if (territoriosJSON) {
            territorios = JSON.parse(territoriosJSON);
        } else {
            // Dados de exemplo
            territorios = [
                {
                    id: 'territorio-1',
                    nome: 'Território 1 - Centro',
                    descricao: 'Região central da cidade'
                },
                {
                    id: 'territorio-2',
                    nome: 'Território 2 - Norte',
                    descricao: 'Região norte da cidade'
                },
                {
                    id: 'territorio-3',
                    nome: 'Território 3 - Sul',
                    descricao: 'Região sul da cidade'
                },
                {
                    id: 'territorio-4',
                    nome: 'Território 4 - Leste',
                    descricao: 'Região leste da cidade'
                },
                {
                    id: 'territorio-5',
                    nome: 'Território 5 - Oeste',
                    descricao: 'Região oeste da cidade'
                }
            ];
            localStorage.setItem('territorios', JSON.stringify(territorios));
        }
        
        // Carregar saídas de campo
        const saidasCampoJSON = localStorage.getItem('saidasCampo');
        if (saidasCampoJSON) {
            saidasCampo = JSON.parse(saidasCampoJSON);
        } else {
            // Dados de exemplo
            saidasCampo = [
                {
                    id: 'saida-1',
                    nome: 'Saída 1',
                    diaSemana: 'Terça-feira',
                    horario: '09:00'
                },
                {
                    id: 'saida-2',
                    nome: 'Saída 2',
                    diaSemana: 'Quarta-feira',
                    horario: '19:30'
                },
                {
                    id: 'saida-3',
                    nome: 'Saída 3',
                    diaSemana: 'Sexta-feira',
                    horario: '14:00'
                }
            ];
            localStorage.setItem('saidasCampo', JSON.stringify(saidasCampo));
        }
        
        // Carregar designações
        const designacoesJSON = localStorage.getItem('designacoes');
        if (designacoesJSON) {
            designacoes = JSON.parse(designacoesJSON);
        } else {
            // Dados de exemplo
            const hoje = new Date();
            
            const dataDesignacao1 = new Date();
            dataDesignacao1.setDate(hoje.getDate() - 30);
            
            const dataDesignacao2 = new Date();
            dataDesignacao2.setDate(hoje.getDate() - 15);
            
            const dataDesignacao3 = new Date();
            dataDesignacao3.setDate(hoje.getDate() - 3);
            
            const dataDevolucao1 = new Date(dataDesignacao1);
            dataDevolucao1.setDate(dataDesignacao1.getDate() + 30);
            
            const dataDevolucao2 = new Date(dataDesignacao2);
            dataDevolucao2.setDate(dataDesignacao2.getDate() + 30);
            
            const dataDevolucao3 = new Date(dataDesignacao3);
            dataDevolucao3.setDate(dataDesignacao3.getDate() + 30);
            
            designacoes = [
                {
                    id: 'designacao-1',
                    territorioId: 'territorio-1',
                    saidaCampoId: 'saida-1',
                    responsavel: 'João Silva',
                    dataDesignacao: dataDesignacao1.toISOString().split('T')[0],
                    dataDevolucao: dataDevolucao1.toISOString().split('T')[0],
                    status: 'ativo',
                    observacoes: 'Prioridade para residenciais'
                },
                {
                    id: 'designacao-2',
                    territorioId: 'territorio-3',
                    saidaCampoId: 'saida-2',
                    responsavel: 'Maria Oliveira',
                    dataDesignacao: dataDesignacao2.toISOString().split('T')[0],
                    dataDevolucao: dataDevolucao2.toISOString().split('T')[0],
                    status: 'ativo',
                    observacoes: ''
                },
                {
                    id: 'designacao-3',
                    territorioId: 'territorio-5',
                    saidaCampoId: 'saida-3',
                    responsavel: 'Carlos Santos',
                    dataDesignacao: dataDesignacao3.toISOString().split('T')[0],
                    dataDevolucao: dataDevolucao3.toISOString().split('T')[0],
                    status: 'ativo',
                    observacoes: 'Foco em prédios'
                },
                {
                    id: 'designacao-4',
                    territorioId: 'territorio-2',
                    saidaCampoId: 'saida-1',
                    responsavel: 'Ana Souza',
                    dataDesignacao: '2025-01-15',
                    dataDevolucao: '2025-02-15',
                    dataConclusao: '2025-02-10',
                    status: 'concluido',
                    resultado: 'completo',
                    observacoes: 'Território completamente atendido.'
                }
            ];
            localStorage.setItem('designacoes', JSON.stringify(designacoes));
        }
        
        // Carregar atendimentos
        const atendimentosJSON = localStorage.getItem('atendimentos');
        if (atendimentosJSON) {
            atendimentos = JSON.parse(atendimentosJSON);
        }
        
        // Preencher selects
        preencherSelectTerritorios();
        preencherSelectSaidas();
        preencherFiltroSaidas();
        
        // Esconder indicador de carregamento
        loadingIndicator.classList.add('d-none');
        
        // Renderizar designações
        renderizarDesignacoes();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarMensagem('Erro ao carregar dados. Por favor, tente novamente.', 'danger');
        
        // Esconder indicador de carregamento e mostrar mensagem de erro
        loadingIndicator.classList.add('d-none');
        semDadosAlert.classList.remove('d-none');
    }
}

// Função para configurar event listeners
function setupEventListeners() {
    // Event listener para o formulário de designação
    formDesignacao.addEventListener('submit', function(e) {
        e.preventDefault();
        criarDesignacao();
    });
    
    // Event listener para o data de designação (calcular data de devolução)
    inputDataDesignacao.addEventListener('change', function() {
        if (this.value) {
            const dataDesignacao = new Date(this.value);
            const dataDevolucao = new Date(dataDesignacao);
            dataDevolucao.setDate(dataDesignacao.getDate() + 30);
            inputDataDevolucao.value = dataDevolucao.toISOString().split('T')[0];
        }
    });
    
    // Event listeners para filtros
    filtroStatus.addEventListener('change', renderizarDesignacoes);
    filtroSaida.addEventListener('change', renderizarDesignacoes);
    filtroResponsavel.addEventListener('input', renderizarDesignacoes);
    
    // Event listener para o botão de limpar filtros
    btnLimparFiltros.addEventListener('click', function() {
        filtroStatus.value = 'ativo';
        filtroSaida.value = '';
        filtroResponsavel.value = '';
        renderizarDesignacoes();
    });
    
    // Event listener para o botão de exportar
    document.getElementById('btn-exportar').addEventListener('click', exportarDados);
    
    // Event listener para o botão de confirmar conclusão
    btnConfirmarConclusao.addEventListener('click', concluirDesignacao);
}

// Função para preencher o select de territórios
function preencherSelectTerritorios() {
    // Limpar opções atuais
    selectTerritorio.innerHTML = '<option value="">Selecione um território</option>';
    
    // Obter territórios sem designações ativas
    const territoriosDisponiveis = territorios.filter(territorio => {
        return !designacoes.some(designacao => 
            designacao.territorioId === territorio.id && 
            designacao.status === 'ativo'
        );
    });
    
    // Adicionar opções para cada território disponível
    territoriosDisponiveis.forEach(territorio => {
        const option = document.createElement('option');
        option.value = territorio.id;
        option.textContent = territorio.nome;
        selectTerritorio.appendChild(option);
    });
    
    // Verificar se há territórios disponíveis
    if (territoriosDisponiveis.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Não há territórios disponíveis';
        option.disabled = true;
        selectTerritorio.appendChild(option);
    }
}

// Função para preencher o select de saídas
function preencherSelectSaidas() {
    // Limpar opções atuais
    selectSaidaCampo.innerHTML = '<option value="">Selecione uma saída de campo</option>';
    
    // Adicionar opções para cada saída
    saidasCampo.forEach(saida => {
        const option = document.createElement('option');
        option.value = saida.id;
        option.textContent = `${saida.nome} (${saida.diaSemana}, ${saida.horario})`;
        selectSaidaCampo.appendChild(option);
    });
}

// Função para preencher o filtro de saídas
function preencherFiltroSaidas() {
    // Limpar opções atuais
    filtroSaida.innerHTML = '<option value="">Todas</option>';
    
    // Adicionar opções para cada saída
    saidasCampo.forEach(saida => {
        const option = document.createElement('option');
        option.value = saida.id;
        option.textContent = saida.nome;
        filtroSaida.appendChild(option);
    });
}

// Função para criar uma nova designação
function criarDesignacao() {
    const territorioId = selectTerritorio.value;
    const saidaCampoId = selectSaidaCampo.value;
    const responsavel = inputResponsavel.value;
    const dataDesignacao = inputDataDesignacao.value;
    const dataDevolucao = inputDataDevolucao.value;
    const observacoes = inputObservacoes.value;
    
    // Validar campos obrigatórios
    if (!territorioId || !saidaCampoId || !responsavel || !dataDesignacao) {
        mostrarMensagem('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
    }
    
    // Verificar se o território já está designado
    const territorioJaDesignado = designacoes.some(designacao => 
        designacao.territorioId === territorioId && 
        designacao.status === 'ativo'
    );
    
    if (territorioJaDesignado) {
        mostrarMensagem('Este território já está designado.', 'warning');
        return;
    }
    
    // Criar nova designação
    const novaDesignacao = {
        id: 'designacao-' + Date.now(),
        territorioId,
        saidaCampoId,
        responsavel,
        dataDesignacao,
        dataDevolucao: dataDevolucao || null,
        status: 'ativo',
        observacoes,
        dataCriacao: new Date().toISOString()
    };
    
    // Adicionar à lista de designações
    designacoes.push(novaDesignacao);
    
    // Salvar no localStorage
    localStorage.setItem('designacoes', JSON.stringify(designacoes));
    
    // Limpar formulário
    formDesignacao.reset();
    
    // Atualizar selects e lista
    preencherSelectTerritorios();
    renderizarDesignacoes();
    
    // Mostrar mensagem de sucesso
    mostrarMensagem('Designação criada com sucesso!', 'success');
}

// Função para renderizar as designações
function renderizarDesignacoes() {
    // Limpar container
    designacoesContainer.innerHTML = '';
    
    // Aplicar filtros
    const statusFiltro = filtroStatus.value;
    const saidaFiltro = filtroSaida.value;
    const responsavelFiltro = filtroResponsavel.value.toLowerCase();
    
    let designacoesFiltradas = [...designacoes];
    
    // Filtrar por status
    if (statusFiltro !== 'todos') {
        designacoesFiltradas = designacoesFiltradas.filter(designacao => 
            designacao.status === statusFiltro
        );
    }
    
    // Filtrar por saída
    if (saidaFiltro) {
        designacoesFiltradas = designacoesFiltradas.filter(designacao => 
            designacao.saidaCampoId === saidaFiltro
        );
    }
    
    // Filtrar por responsável
    if (responsavelFiltro) {
        designacoesFiltradas = designacoesFiltradas.filter(designacao => 
            designacao.responsavel.toLowerCase().includes(responsavelFiltro)
        );
    }
    
    // Ordenar por data de designação (mais recentes primeiro)
    designacoesFiltradas.sort((a, b) => new Date(b.dataDesignacao) - new Date(a.dataDesignacao));
    
    // Verificar se há designações
    if (designacoesFiltradas.length === 0) {
        semDadosAlert.classList.remove('d-none');
        return;
    }
    
    // Esconder alerta de "sem dados"
    semDadosAlert.classList.add('d-none');
    
    // Renderizar cada designação
    designacoesFiltradas.forEach(designacao => {
        const designacaoElement = criarElementoDesignacao(designacao);
        designacoesContainer.appendChild(designacaoElement);
    });
}

// Função para criar elemento de designação
function criarElementoDesignacao(designacao) {
    // Buscar informações relacionadas
    const territorio = territorios.find(t => t.id === designacao.territorioId) || { nome: 'Território não encontrado' };
    const saida = saidasCampo.find(s => s.id === designacao.saidaCampoId) || { nome: 'Saída não encontrada' };
    
    // Determinar status visual
    let statusClass = 'ativo';
    let statusBadge = '<span class="badge bg-primary badge-designacao">Ativo</span>';
    
    if (designacao.status === 'concluido') {
        statusClass = 'concluido';
        statusBadge = '<span class="badge bg-success badge-designacao">Concluído</span>';
    } else {
        // Verificar se está vencido
        const hoje = new Date();
        const dataDevolucao = new Date(designacao.dataDevolucao);
        
        if (dataDevolucao < hoje) {
            statusClass = 'vencido';
            statusBadge = '<span class="badge bg-warning badge-designacao">Vencido</span>';
        }
    }
    
    // Criar elemento
    const cardDiv = document.createElement('div');
    cardDiv.className = 'designacao-card';
    cardDiv.id = `designacao-${designacao.id}`;
    
    // Calcular o progresso (implementação básica)
    let progresso = 0;
    let totalImoveis = 0;
    let imoveisAtendidos = 0;
    
    // Verificar se o território tem ruas e imóveis
    const territorioCompleto = territorios.find(t => {
        if (t.id === designacao.territorioId && t.ruas) {
            t.ruas.forEach(rua => {
                if (rua.imoveis) {
                    totalImoveis += rua.imoveis.length;
                    rua.imoveis.forEach(imovel => {
                        if (atendimentos[imovel.id]) {
                            imoveisAtendidos++;
                        }
                    });
                }
            });
            return true;
        }
        return false;
    });
    
    if (totalImoveis > 0) {
        progresso = Math.round((imoveisAtendidos / totalImoveis) * 100);
    }
    
    // Conteúdo HTML
    cardDiv.innerHTML = `
        <div class="designacao-header ${statusClass}">
            <div>
                <h4 class="designacao-title">${territorio.nome}</h4>
                <p class="designacao-subtitle">Designado para: ${designacao.responsavel}</p>
            </div>
            <div>
                ${statusBadge}
            </div>
        </div>
        <div class="designacao-body">
            <div class="designacao-info">
                <div class="info-item">
                    <div class="info-label">Saída de Campo</div>
                    <div class="info-value">${saida.nome}</div>
                </div>
                    <div class="info-item">
                        <div class="info-label">Devolução Prevista</div>
                        <div class="info-value">${designacao.dataDevolucao ? formatarData(designacao.dataDevolucao) : '-'}</div>
                    </div>
                    ${designacao.dataConclusao ? `
                    <div class="info-item">
                        <div class="info-label">Data de Conclusão</div>
                        <div class="info-value">${formatarData(designacao.dataConclusao)}</div>
                    </div>
                    ` : ''}
                </div>
                
                ${designacao.observacoes ? `
                <div class="mt-2">
                    <small class="text-muted">Observações: ${designacao.observacoes}</small>
                </div>
                ` : ''}
                
                <div class="progress-container">
                    <div class="progress-label">
                        <span>Progresso:</span>
                        <span>${progresso}% (${imoveisAtendidos}/${totalImoveis})</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-success" role="progressbar" style="width: ${progresso}%;" aria-valuenow="${progresso}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                
                <div class="designacao-actions">
                    ${designacao.status === 'ativo' ? `
                    <button class="btn btn-sm btn-outline-success" onclick="abrirModalConcluir('${designacao.id}')">
                        <i class="fas fa-check me-1"></i> Concluir
                    </button>
                    ` : ''}
                    <button class="btn btn-sm btn-outline-primary" onclick="abrirModalDetalhes('${designacao.id}')">
                        <i class="fas fa-info-circle me-1"></i> Detalhes
                    </button>
                    <a href="/modules/territorios/visualizar.html?territorio=${designacao.territorioId}" class="btn btn-sm btn-outline-secondary">
                        <i class="fas fa-map-marked-alt me-1"></i> Ver Território
                    </a>
                </div>
            </div>
        `;
        
        return cardDiv;
    }
    
    // Função para abrir o modal de conclusão
    function abrirModalConcluir(designacaoId) {
        // Buscar a designação
        const designacao = designacoes.find(d => d.id === designacaoId);
        if (!designacao) {
            mostrarMensagem('Designação não encontrada!', 'danger');
            return;
        }
        
        // Buscar o território
        const territorio = territorios.find(t => t.id === designacao.territorioId) || { nome: 'Território não encontrado' };
        
        // Preencher campos do modal
        designacaoIdInput.value = designacaoId;
        modalInfoDesignacao.textContent = `Concluir designação do território: ${territorio.nome}`;
        
        // Mostrar modal
        modalConcluir.show();
    }
    
    // Função para concluir designação
    function concluirDesignacao() {
        const designacaoId = designacaoIdInput.value;
        const dataConclusao = dataConclusaoInput.value;
        const resultado = resultadoSelect.value;
        const observacoesConclusao = observacoesConclusaoInput.value;
        
        // Validar campos obrigatórios
        if (!designacaoId || !dataConclusao || !resultado) {
            mostrarMensagem('Por favor, preencha todos os campos obrigatórios.', 'warning');
            return;
        }
        
        // Buscar e atualizar a designação
        const designacaoIndex = designacoes.findIndex(d => d.id === designacaoId);
        if (designacaoIndex === -1) {
            mostrarMensagem('Designação não encontrada!', 'danger');
            return;
        }
        
        // Atualizar designação
        designacoes[designacaoIndex] = {
            ...designacoes[designacaoIndex],
            status: 'concluido',
            dataConclusao,
            resultado,
            observacoesConclusao,
            dataAtualizacao: new Date().toISOString()
        };
        
        // Salvar no localStorage
        localStorage.setItem('designacoes', JSON.stringify(designacoes));
        
        // Fechar modal
        modalConcluir.hide();
        
        // Atualizar lista de designações
        renderizarDesignacoes();
        
        // Atualizar select de territórios disponíveis
        preencherSelectTerritorios();
        
        // Mostrar mensagem de sucesso
        mostrarMensagem('Designação concluída com sucesso!', 'success');
    }
    
    // Função para abrir o modal de detalhes
    function abrirModalDetalhes(designacaoId) {
        // Buscar a designação
        const designacao = designacoes.find(d => d.id === designacaoId);
        if (!designacao) {
            mostrarMensagem('Designação não encontrada!', 'danger');
            return;
        }
        
        // Buscar informações relacionadas
        const territorio = territorios.find(t => t.id === designacao.territorioId) || { nome: 'Território não encontrado' };
        const saida = saidasCampo.find(s => s.id === designacao.saidaCampoId) || { nome: 'Saída não encontrada' };
        
        // Determinar status visual
        let statusHTML = '<span class="badge bg-primary">Ativo</span>';
        
        if (designacao.status === 'concluido') {
            statusHTML = '<span class="badge bg-success">Concluído</span>';
        } else {
            // Verificar se está vencido
            const hoje = new Date();
            const dataDevolucao = new Date(designacao.dataDevolucao);
            
            if (dataDevolucao < hoje) {
                statusHTML = '<span class="badge bg-warning">Vencido</span>';
            }
        }
        
        // Calcular progresso
        let progresso = 0;
        let totalImoveis = 0;
        let imoveisAtendidos = 0;
        
        // Verificar se o território tem ruas e imóveis
        const territorioCompleto = territorios.find(t => {
            if (t.id === designacao.territorioId && t.ruas) {
                t.ruas.forEach(rua => {
                    if (rua.imoveis) {
                        totalImoveis += rua.imoveis.length;
                        rua.imoveis.forEach(imovel => {
                            if (atendimentos[imovel.id]) {
                                imoveisAtendidos++;
                            }
                        });
                    }
                });
                return true;
            }
            return false;
        });
        
        if (totalImoveis > 0) {
            progresso = Math.round((imoveisAtendidos / totalImoveis) * 100);
        }
        
        // Preencher dados no modal
        document.getElementById('detalhe-territorio').textContent = territorio.nome;
        document.getElementById('detalhe-responsavel').textContent = designacao.responsavel;
        document.getElementById('detalhe-saida').textContent = saida.nome;
        document.getElementById('detalhe-status').innerHTML = statusHTML;
        document.getElementById('detalhe-data-designacao').textContent = formatarData(designacao.dataDesignacao);
        document.getElementById('detalhe-data-devolucao').textContent = designacao.dataDevolucao ? formatarData(designacao.dataDevolucao) : '-';
        document.getElementById('detalhe-data-conclusao').textContent = designacao.dataConclusao ? formatarData(designacao.dataConclusao) : '-';
        document.getElementById('detalhe-observacoes').textContent = designacao.observacoes || '-';
        document.getElementById('detalhe-resultado').textContent = designacao.resultado ? formatarResultado(designacao.resultado) : '-';
        
        // Atualizar barra de progresso
        document.getElementById('detalhe-progresso-porcentagem').textContent = `${progresso}% (${imoveisAtendidos}/${totalImoveis})`;
        document.getElementById('detalhe-progresso-barra').style.width = `${progresso}%`;
        document.getElementById('detalhe-progresso-barra').setAttribute('aria-valuenow', progresso);
        
        // Configurar link para ver território
        document.getElementById('btn-ver-territorio').href = `/modules/territorios/visualizar.html?territorio=${designacao.territorioId}`;
        
        // Mostrar modal
        modalDetalhes.show();
    }
    
    // Função para exportar dados
    function exportarDados() {
        // Filtrar designações conforme os filtros aplicados
        const statusFiltro = filtroStatus.value;
        const saidaFiltro = filtroSaida.value;
        const responsavelFiltro = filtroResponsavel.value.toLowerCase();
        
        let designacoesFiltradas = [...designacoes];
        
        // Aplicar filtros
        if (statusFiltro !== 'todos') {
            designacoesFiltradas = designacoesFiltradas.filter(designacao => 
                designacao.status === statusFiltro
            );
        }
        
        if (saidaFiltro) {
            designacoesFiltradas = designacoesFiltradas.filter(designacao => 
                designacao.saidaCampoId === saidaFiltro
            );
        }
        
        if (responsavelFiltro) {
            designacoesFiltradas = designacoesFiltradas.filter(designacao => 
                designacao.responsavel.toLowerCase().includes(responsavelFiltro)
            );
        }
        
        // Preparar dados para CSV
        const dadosCSV = [];
        
        designacoesFiltradas.forEach(designacao => {
            const territorio = territorios.find(t => t.id === designacao.territorioId) || { nome: 'Território não encontrado' };
            const saida = saidasCampo.find(s => s.id === designacao.saidaCampoId) || { nome: 'Saída não encontrada' };
            
            dadosCSV.push({
                'Território': territorio.nome,
                'Responsável': designacao.responsavel,
                'Saída de Campo': saida.nome,
                'Data de Designação': formatarData(designacao.dataDesignacao),
                'Devolução Prevista': designacao.dataDevolucao ? formatarData(designacao.dataDevolucao) : '-',
                'Status': designacao.status === 'ativo' ? 'Ativo' : 'Concluído',
                'Data de Conclusão': designacao.dataConclusao ? formatarData(designacao.dataConclusao) : '-',
                'Resultado': designacao.resultado ? formatarResultado(designacao.resultado) : '-',
                'Observações': designacao.observacoes || '-'
            });
        });
        
        // Converter para CSV
        let csv = '';
        
        // Adicionar cabeçalho
        if (dadosCSV.length > 0) {
            csv += Object.keys(dadosCSV[0]).join(',') + '\n';
            
            // Adicionar linhas
            dadosCSV.forEach(linha => {
                csv += Object.values(linha).map(valor => `"${valor}"`).join(',') + '\n';
            });
        }
        
        // Gerar arquivo para download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `designacoes_${formatarDataArquivo(new Date())}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Função para formatar data no formato brasileiro
    function formatarData(dataString) {
        return moment(dataString).format('DD/MM/YYYY');
    }
    
    // Função para formatar data para nome de arquivo
    function formatarDataArquivo(data) {
        return moment(data).format('YYYY-MM-DD');
    }
    
    // Função para formatar resultado
    function formatarResultado(resultado) {
        const resultados = {
            'completo': 'Território Completo',
            'parcial': 'Parcialmente Trabalhado',
            'problemas': 'Dificuldades Encontradas'
        };
        
        return resultados[resultado] || resultado;
    }
    
    // Função para mostrar mensagem
    function mostrarMensagem(mensagem, tipo) {
        // Verificar se existe NotificationService
        if (typeof NotificationService !== 'undefined') {
            NotificationService.show(mensagem, tipo);
            return;
        }
        
        // Criar elemento de alerta
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
    
    // Expor funções para uso global (para eventos onclick em elementos HTML)
    window.abrirModalConcluir = abrirModalConcluir;
    window.abrirModalDetalhes = abrirModalDetalhes;
    
    // Inicializar página
    document.addEventListener('DOMContentLoaded', init);