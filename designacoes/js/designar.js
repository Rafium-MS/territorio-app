/**
 * Sistema de Designação de Territórios
 * Gerencia designações, visualização em lista ou calendário, e conclusões
 */

// ======= Variáveis Globais =======
let territorios = [];
let saidasCampo = [];
let designacoes = [];
let atendimentos = {};
let currentMonth = new Date();

// ======= Elementos DOM =======
// Elementos principais
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

// Elementos do calendário
const calendarView = document.getElementById('calendario-view');
const btnCalendarioView = document.getElementById('btn-calendario-view');
const calendarMonthYear = document.getElementById('calendar-month-year');
const calendarGrid = document.getElementById('calendar-grid');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

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

// ======= Funções de Inicialização =======

/**
 * Inicializa a página
 */
async function init() {
    // Definir data padrão para os inputs
    const hoje = new Date().toISOString().split('T')[0];
    inputDataDesignacao.value = hoje;
    dataConclusaoInput.value = hoje;
    
    // Calcular data de devolução padrão (hoje + 30 dias)
    const dataDevolucao = new Date();
    dataDevolucao.setDate(dataDevolucao.getDate() + 30);
    inputDataDevolucao.value = dataDevolucao.toISOString().split('T')[0];
    
    // Verificar parâmetros da URL
    checkUrlParams();
    
    // Carregar dados
    await carregarDados();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Renderizar calendário inicial
    renderizarCalendario();
}

/**
 * Verifica parâmetros da URL para ações específicas
 */
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('concluir')) {
        const designacaoId = urlParams.get('concluir');
        // Abrir modal de conclusão após carregar a página
        setTimeout(() => abrirModalConcluir(designacaoId), 1000);
    }
}

/**
 * Carrega todos os dados necessários
 */
async function carregarDados() {
    try {
        loadingIndicator.classList.remove('d-none');
        
        // Carregar dados de territórios, saídas de campo e designações
        await Promise.all([
            carregarTerritorios(),
            carregarSaidasCampo(),
            carregarDesignacoes(),
            carregarAtendimentos()
        ]);
        
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

/**
 * Carrega dados de territórios do localStorage ou cria exemplos
 */
async function carregarTerritorios() {
    return new Promise(resolve => {
        setTimeout(() => {
            const territoriosJSON = localStorage.getItem('territorios');
            
            if (territoriosJSON) {
                territorios = JSON.parse(territoriosJSON);
            } else {
                // Dados de exemplo
                territorios = [
                    {
                        id: 'territorio-1',
                        nome: 'Território 1 - Centro',
                        descricao: 'Região central da cidade',
                        ruas: [
                            {
                                id: 'rua-1',
                                nome: 'Rua das Flores',
                                imoveis: [
                                    { id: 'imovel-1', numero: '123', tipo: 'residencial', ruaId: 'rua-1' },
                                    { id: 'imovel-2', numero: '125', tipo: 'comercial', ruaId: 'rua-1' },
                                    { id: 'imovel-3', numero: '127', tipo: 'residencial', ruaId: 'rua-1' }
                                ]
                            },
                            {
                                id: 'rua-2',
                                nome: 'Avenida Principal',
                                imoveis: [
                                    { id: 'imovel-4', numero: '200', tipo: 'comercial', ruaId: 'rua-2' },
                                    { id: 'imovel-5', numero: '202', tipo: 'comercial', ruaId: 'rua-2' }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'territorio-2',
                        nome: 'Território 2 - Norte',
                        descricao: 'Região norte da cidade',
                        ruas: [
                            {
                                id: 'rua-3',
                                nome: 'Rua dos Ipês',
                                imoveis: [
                                    { id: 'imovel-6', numero: '45', tipo: 'residencial', ruaId: 'rua-3' },
                                    { id: 'imovel-7', numero: '47', tipo: 'residencial', ruaId: 'rua-3' }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'territorio-3',
                        nome: 'Território 3 - Sul',
                        descricao: 'Região sul da cidade',
                        ruas: [
                            {
                                id: 'rua-4',
                                nome: 'Rua das Palmeiras',
                                imoveis: [
                                    { id: 'imovel-8', numero: '10', tipo: 'residencial', ruaId: 'rua-4' },
                                    { id: 'imovel-9', numero: '12', tipo: 'residencial', ruaId: 'rua-4' }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'territorio-4',
                        nome: 'Território 4 - Leste',
                        descricao: 'Região leste da cidade',
                        ruas: [
                            {
                                id: 'rua-5',
                                nome: 'Rua das Acácias',
                                imoveis: [
                                    { id: 'imovel-10', numero: '301', tipo: 'residencial', ruaId: 'rua-5' },
                                    { id: 'imovel-11', numero: '303', tipo: 'residencial', ruaId: 'rua-5' }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'territorio-5',
                        nome: 'Território 5 - Oeste',
                        descricao: 'Região oeste da cidade',
                        ruas: [
                            {
                                id: 'rua-6',
                                nome: 'Rua dos Lírios',
                                imoveis: [
                                    { id: 'imovel-12', numero: '500', tipo: 'comercial', ruaId: 'rua-6' },
                                    { id: 'imovel-13', numero: '502', tipo: 'residencial', ruaId: 'rua-6' }
                                ]
                            }
                        ]
                    }
                ];
                
                localStorage.setItem('territorios', JSON.stringify(territorios));
            }
            
            resolve(territorios);
        }, 500);
    });
}

/**
 * Carrega dados de saídas de campo do localStorage ou cria exemplos
 */
async function carregarSaidasCampo() {
    return new Promise(resolve => {
        setTimeout(() => {
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
            
            resolve(saidasCampo);
        }, 500);
    });
}

/**
 * Carrega dados de designações do localStorage ou cria exemplos
 */
async function carregarDesignacoes() {
    return new Promise(resolve => {
        setTimeout(() => {
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
            
            resolve(designacoes);
        }, 500);
    });
}