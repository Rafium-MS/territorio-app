// Arrays para armazenar os dados
let territorios = [];
let prediosVilas = [];
let atendimentos = {};
let saidasCampo = [
    { id: 1, nome: 'Saída 1' },
    { id: 2, nome: 'Saída 2' },
    { id: 3, nome: 'Saída 3' }
];

// Elementos DOM
const formCadastro = document.getElementById('form-cadastro');
const selectTerritorio = document.getElementById('select-territorio');
const selectRua = document.getElementById('select-rua');
const listaImoveis = document.getElementById('lista-imoveis');
const loading = document.getElementById('loading');
const semDados = document.getElementById('sem-dados');
const filtroPredios = document.getElementById('filtro-predios');
const filtroVilas = document.getElementById('filtro-vilas');
const filtroConcluidos = document.getElementById('filtro-concluidos');
const filtroDesignados = document.getElementById('filtro-designados');

// Modais
const modalDetalhes = new bootstrap.Modal(document.getElementById('modal-detalhes'));
const modalAtendimento = new bootstrap.Modal(document.getElementById('modal-atendimento'));

// Elementos do formulário de atendimento
const atendimentoPredioId = document.getElementById('atendimento-predio-id');
const atendimentoUnidade = document.getElementById('atendimento-unidade');
const atendimentoInfo = document.getElementById('atendimento-info');
const atendimentoData = document.getElementById('atendimento-data');
const atendimentoResultado = document.getElementById('atendimento-resultado');
const atendimentoObservacoes = document.getElementById('atendimento-observacoes');
const btnConfirmarAtendimento = document.getElementById('btn-confirmar-atendimento');
const btnRemoverAtendimento = document.getElementById('btn-remover-atendimento');

// Elementos para detalhes do prédio/vila
const gridApartamentos = document.getElementById('grid-apartamentos');
const timelineHistorico = document.getElementById('timeline-historico');
const btnAdicionarRegistro = document.getElementById('btn-adicionar-registro');
const formNovoRegistro = document.getElementById('form-novo-registro');
const btnCancelarRegistro = document.getElementById('btn-cancelar-registro');
const formRegistro = document.getElementById('form-registro');

// Elementos para designação
const alertaSemDesignacao = document.getElementById('alerta-sem-designacao');
const infoDesignacao = document.getElementById('info-designacao');
const formDesignacao = document.getElementById('form-designar');
const btnEncerrarDesignacao = document.getElementById('btn-encerrar-designacao');
const designacaoSaida = document.getElementById('designacao-saida');

// Função para carregar os dados dos territórios
function carregarTerritorios() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const territoriosJSON = localStorage.getItem('territorios');
            
            if (territoriosJSON) {
                territorios = JSON.parse(territoriosJSON);
            } else {
                // Dados de exemplo se não existir no localStorage
                territorios = [
                    {
                        id: 'exemplo-1',
                        nome: 'Quadra 10 - Setor Central',
                        ruas: [
                            {
                                id: 'rua-exemplo-1',
                                nome: 'Rua das Flores',
                                imoveis: [
                                    { id: 'imovel-1', numero: '123', tipo: 'residencial', ruaId: 'rua-exemplo-1' },
                                    { id: 'imovel-2', numero: '125', tipo: 'comercial', ruaId: 'rua-exemplo-1' },
                                    { id: 'imovel-3', numero: '127', tipo: 'residencial', ruaId: 'rua-exemplo-1' },
                                    { id: 'imovel-4', numero: '129', tipo: 'predio', ruaId: 'rua-exemplo-1' }
                                ]
                            },
                            {
                                id: 'rua-exemplo-2',
                                nome: 'Avenida Principal',
                                imoveis: [
                                    { id: 'imovel-5', numero: '200', tipo: 'comercial', ruaId: 'rua-exemplo-2' },
                                    { id: 'imovel-6', numero: '202', tipo: 'comercial', ruaId: 'rua-exemplo-2' },
                                    { id: 'imovel-7', numero: '204', tipo: 'vila', ruaId: 'rua-exemplo-2' }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'exemplo-2',
                        nome: 'Quadra 12 - Setor Norte',
                        ruas: [
                            {
                                id: 'rua-exemplo-3',
                                nome: 'Rua dos Ipês',
                                imoveis: [
                                    { id: 'imovel-8', numero: '45', tipo: 'residencial', ruaId: 'rua-exemplo-3' },
                                    { id: 'imovel-9', numero: '47', tipo: 'residencial', ruaId: 'rua-exemplo-3' },
                                    { id: 'imovel-10', numero: '49', tipo: 'predio', ruaId: 'rua-exemplo-3' }
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

// Função para carregar os dados dos prédios e vilas
function carregarPrediosVilas() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const prediosVilasJSON = localStorage.getItem('prediosVilas');
            
            if (prediosVilasJSON) {
                prediosVilas = JSON.parse(prediosVilasJSON);
            } else {
                // Dados de exemplo se não existir no localStorage
                prediosVilas = [
                    {
                        id: 'imovel-1',
                        numero: '123',
                        tipo: 'residencial',
                        nome: 'Edifício Primavera',
                        totalUnidades: 24,
                        tipoPortaria: '24h',
                        tipoAcesso: 'facil',
                        observacoes: 'Prédio com 24 apartamentos e portaria 24 horas.'
                    },
                    {
                        id: 'imovel-2',
                        numero: '125',
                        tipo: 'comercial',
                        nome: '',
                        totalUnidades: 0,
                        tipoPortaria: 'sem',
                        tipoAcesso: 'restrito',
                        observacoes: 'Loja comercial'
                    },
                    {
                        id: 'imovel-3',
                        numero: '127',
                        tipo: 'residencial',
                        nome: '',
                        totalUnidades: 0,
                        tipoPortaria: 'eletronica',
                        tipoAcesso: 'interfone',
                        observacoes: 'Prédio residencial com portaria eletrônica.'
                    },
                    {
                        id: 'imovel-4',
                        numero: '129',
                        tipo: 'predio',
                        nome: 'Edifício Central',
                        totalUnidades: 12,
                        tipoPortaria: 'diurna',
                        tipoAcesso: 'dificil',
                        observacoes: 'Prédio com 12 apartamentos e portaria diurna.'
                    },
                    {
                        id: 'imovel-5',
                        numero: '200',
                        tipo: 'comercial',
                        nome: '',
                        totalUnidades: 0,
                        tipoPortaria: 'sem',
                        tipoAcesso: 'restrito',
                        observacoes: 'Loja comercial'
                    },
                    {
                        id: 'imovel-6',
                        numero: '202',
                        tipo: 'comercial',
                        nome: '',
                        totalUnidades: 0,
                        tipoPortaria: 'sem',
                        tipoAcesso: 'restrito',
                        observacoes: 'Loja comercial'
                    },
                ];
            }
            
            resolve(prediosVilas);
        }, 500);
    });
}

// Função para inicializar a aplicação
async function inicializar() {
    loading.classList.remove('d-none');
    
    await carregarTerritorios();
    await carregarPrediosVilas();
    
    loading.classList.add('d-none');
    atualizarListaImoveis();
}

// Função para atualizar a lista de imóveis
function atualizarListaImoveis() {
    listaImoveis.innerHTML = '';
    
    const prediosFiltrados = prediosVilas.filter(imovel => {
        if (!filtroPredios.checked && imovel.tipo === 'predio') return false;
        if (!filtroVilas.checked && imovel.tipo === 'vila') return false;
        if (filtroConcluidos.checked && imovel.concluido) return false;
        if (filtroDesignados.checked && !imovel.designado) return false;
        return true;
    });
    
    if (prediosFiltrados.length === 0) {
        semDados.classList.remove('d-none');
    } else {
        semDados.classList.add('d-none');
        
        prediosFiltrados.forEach(imovel => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card">
                    <div class="card-header ${imovel.tipo === 'predio' ? 'card-header-predio' : 'card-header-vila'}">
                        <h5 class="mb-0">${imovel.nome || 'Sem Nome'}</h5>
                    </div>
                    <div class="card-body">
                        <p><strong>Endereço:</strong> ${imovel.numero}</p>
                        <p><strong>Tipo:</strong> ${imovel.tipo}</p>
                        <p><strong>Total de Unidades:</strong> ${imovel.totalUnidades}</p>
                        <p><strong>Portaria:</strong> ${imovel.tipoPortaria}</p>
                        <p><strong>Acesso:</strong> ${imovel.tipoAcesso}</p>
                        <p><strong>Observações:</strong> ${imovel.observacoes}</p>
                        <button class="btn btn-primary btn-sm" onclick="abrirDetalhes('${imovel.id}')">Detalhes</button>
                    </div>
                </div>
            `;
            listaImoveis.appendChild(card);
        });
    }
}

// Função para abrir os detalhes de um imóvel
function abrirDetalhes(id) {
    const imovel = prediosVilas.find(imovel => imovel.id === id);
    
    if (imovel) {
        document.getElementById('detalhe-localizacao').innerText = imovel.numero;
        document.getElementById('detalhe-portaria').innerText = imovel.tipoPortaria;
        document.getElementById('detalhe-unidades').innerText = `${imovel.totalUnidades} apartamentos`;
        document.getElementById('detalhe-acesso').innerText = imovel.tipoAcesso;
        
        modalDetalhes.show();
    }
}

// Inicializar a aplicação
inicializar();