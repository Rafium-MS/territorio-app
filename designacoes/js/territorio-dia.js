// Variáveis globais
let territorios = [];
let designacoes = [];
let saidasCampo = [];
let atendimentos = {};
let designacaoHoje = null;

// Elementos DOM
const loading = document.getElementById('loading');
const territorioContainer = document.getElementById('territorio-container');
const semTerritorioContainer = document.getElementById('sem-territorio-container');
const proximasDesignacoesContainer = document.getElementById('proximas-designacoes');
const semProximasAlert = document.getElementById('sem-proximas');

// Função para inicializar a página
async function init() {
    // Carregar dados
    await carregarDados();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Carregar território do dia
    carregarTerritorioDoDia();
    
    // Carregar próximas designações
    carregarProximasDesignacoes();
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
                }
            ];
            localStorage.setItem('territorios', JSON.stringify(territorios));
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
            
            const dataDesignacao3 = new Date(hoje);
            
            const dataDesignacao4 = new Date();
            dataDesignacao4.setDate(hoje.getDate() + 7);
            
            const dataDevolucao1 = new Date(dataDesignacao1);
            dataDevolucao1.setDate(dataDesignacao1.getDate() + 30);
            
            const dataDevolucao2 = new Date(dataDesignacao2);
            dataDevolucao2.setDate(dataDesignacao2.getDate() + 30);
            
            const dataDevolucao3 = new Date(dataDesignacao3);
            dataDevolucao3.setDate(dataDesignacao3.getDate() + 30);
            
            const dataDevolucao4 = new Date(dataDesignacao4);
            dataDevolucao4.setDate(dataDesignacao4.getDate() + 30);
            
            designacoes = [
                {
                    id: 'designacao-1',
                    territorioId: 'territorio-1',
                    saidaCampoId: 'saida-1',
                    responsavel: 'João Silva',
                    dataDesignacao: dataDesignacao1.toISOString().split('T')[0],
                    dataDevolucao: dataDevolucao1.toISOString().split('T')[0],
                    status: 'concluido',
                    dataConclusao: dataDevolucao1.toISOString().split('T')[0],
                    observacoes: 'Concluído com sucesso'
                },
                {
                    id: 'designacao-2',
                    territorioId: 'territorio-2',
                    saidaCampoId: 'saida-2',
                    responsavel: 'Maria Oliveira',
                    dataDesignacao: dataDesignacao2.toISOString().split('T')[0],
                    dataDevolucao: dataDevolucao2.toISOString().split('T')[0],
                    status: 'ativo',
                    observacoes: 'Priorizando residenciais'
                },
                {
                    id: 'designacao-3',
                    territorioId: 'territorio-3',
                    saidaCampoId: 'saida-3',
                    responsavel: 'Carlos Santos',
                    dataDesignacao: dataDesignacao3.toISOString().split('T')[0],
                    dataDevolucao: dataDevolucao3.toISOString().split('T')[0],
                    status: 'ativo',
                    observacoes: 'Território do dia'
                },
                {
                    id: 'designacao-4',
                    territorioId: 'territorio-1',
                    saidaCampoId: 'saida-1',
                    responsavel: 'Ana Souza',
                    dataDesignacao: dataDesignacao4.toISOString().split('T')[0],
                    dataDevolucao: dataDevolucao4.toISOString().split('T')[0],
                    status: 'ativo',
                    observacoes: 'Designação futura'
                }
            ];
            localStorage.setItem('designacoes', JSON.stringify(designacoes));
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
        
        // Carregar atendimentos
        const atendimentosJSON = localStorage.getItem('atendimentos');
        if (atendimentosJSON) {
            atendimentos = JSON.parse(atendimentosJSON);
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarMensagem('Erro ao carregar dados. Por favor, tente novamente.', 'danger');
    }
}

// Função para configurar event listeners
function setupEventListeners() {
    // Botão imprimir
    document.getElementById('btn-imprimir').addEventListener('click', function() {
        window.print();
    });
    
    // Botões do território do dia
    if (document.getElementById('btn-visualizar')) {
        document.getElementById('btn-visualizar').addEventListener('click', function(e) {
            if (designacaoHoje) {
                e.preventDefault();
                window.location.href = `/modules/territorios/visualizar.html?territorio=${designacaoHoje.territorioId}`;
            }
        });
    }
    
    if (document.getElementById('btn-registrar')) {
        document.getElementById('btn-registrar').addEventListener('click', function(e) {
            if (designacaoHoje) {
                e.preventDefault();
                window.location.href = `/modules/territorios/visualizar.html?territorio=${designacaoHoje.territorioId}`;
            }
        });
    }
    
    if (document.getElementById('btn-concluir')) {
        document.getElementById('btn-concluir').addEventListener('click', function(e) {
            if (designacaoHoje) {
                e.preventDefault();
                window.location.href = `/modules/territorios/designar.html?concluir=${designacaoHoje.id}`;
            }
        });
    }
}

// Função para carregar o território do dia
function carregarTerritorioDoDia() {
    // Ocultar loading
    loading.classList.add('d-none');
    
    // Obter data atual
    const hoje = new Date();
    const dataHoje = hoje.toISOString().split('T')[0];
    
    // Buscar designação ativa para a data atual
    designacaoHoje = designacoes.find(designacao => {
        return designacao.status === 'ativo' && 
               new Date(designacao.dataDesignacao) <= hoje && 
               new Date(designacao.dataDevolucao) >= hoje;
    });
    
    // Verificar se há território designado para hoje
    if (!designacaoHoje) {
        semTerritorioContainer.classList.remove('d-none');
        return;
    }
    
    // Buscar informações do território
    const territorio = territorios.find(t => t.id === designacaoHoje.territorioId);
    if (!territorio) {
        semTerritorioContainer.classList.remove('d-none');
        mostrarMensagem('Erro: Território não encontrado.', 'danger');
        return;
    }
    
    // Buscar informações da saída de campo
    const saida = saidasCampo.find(s => s.id === designacaoHoje.saidaCampoId);
    
    // Contar total de ruas e imóveis
    let totalRuas = territorio.ruas ? territorio.ruas.length : 0;
    let totalImoveis = 0;
    let imoveisAtendidos = 0;
    
    // Obter total de imóveis e atendimentos
    if (territorio.ruas) {
        territorio.ruas.forEach(rua => {
            if (rua.imoveis) {
                totalImoveis += rua.imoveis.length;
                rua.imoveis.forEach(imovel => {
                    if (atendimentos[imovel.id]) {
                        imoveisAtendidos++;
                    }
                });
            }
        });
    }
    
    // Calcular progresso
    const progresso = totalImoveis > 0 ? Math.round((imoveisAtendidos / totalImoveis) * 100) : 0;
    
    // Obter última visita (implementação básica)
    let ultimaVisita = 'Não há registro';
    
    // Se houver atendimentos, verificar a data mais recente
    if (Object.keys(atendimentos).length > 0) {
        let dataUltimaVisita = null;
        
        // Verificar se o território tem imóveis
        if (territorio.ruas) {
            territorio.ruas.forEach(rua => {
                if (rua.imoveis) {
                    rua.imoveis.forEach(imovel => {
                        const atendimento = atendimentos[imovel.id];
                        if (atendimento && atendimento.data) {
                            const dataAtendimento = new Date(atendimento.data);
                            if (!dataUltimaVisita || dataAtendimento > dataUltimaVisita) {
                                dataUltimaVisita = dataAtendimento;
                            }
                        }
                    });
                }
            });
        }
        
        if (dataUltimaVisita) {
            ultimaVisita = formatarData(dataUltimaVisita.toISOString().split('T')[0]);
        }
    }
    
    // Preencher informações do território
    document.getElementById('territorio-nome').textContent = territorio.nome;
    document.getElementById('territorio-descricao').textContent = territorio.descricao || '';
    document.getElementById('saida-campo').textContent = saida ? saida.nome : 'Saída não especificada';
    document.getElementById('total-ruas').textContent = totalRuas;
    document.getElementById('total-imoveis').textContent = totalImoveis;
    document.getElementById('data-designacao').textContent = formatarData(designacaoHoje.dataDesignacao);
    document.getElementById('data-devolucao').textContent = formatarData(designacaoHoje.dataDevolucao);
    document.getElementById('responsavel').textContent = designacaoHoje.responsavel;
    document.getElementById('ultima-visita').textContent = ultimaVisita;
    document.getElementById('observacoes').textContent = designacaoHoje.observacoes || '-';
    
    // Atualizar barra de progresso
    document.getElementById('progresso-porcentagem').textContent = `${progresso}% (${imoveisAtendidos}/${totalImoveis})`;
    document.getElementById('progresso-atendimentos').style.width = `${progresso}%`;
    document.getElementById('progresso-atendimentos').setAttribute('aria-valuenow', progresso);
    
    // Atualizar links
    document.getElementById('btn-visualizar').href = `/modules/territorios/visualizar.html?territorio=${designacaoHoje.territorioId}`;
    document.getElementById('btn-registrar').href = `/modules/territorios/visualizar.html?territorio=${designacaoHoje.territorioId}`;
    document.getElementById('btn-concluir').href = `/modules/territorios/designar.html?concluir=${designacaoHoje.id}`;
    
    // Mostrar container do território
    territorioContainer.classList.remove('d-none');
    territorioContainer.classList.add('fade-in');
}

// Função para carregar próximas designações
function carregarProximasDesignacoes() {
    // Obter data atual
    const hoje = new Date();
    
    // Filtrar designações futuras (data de designação > hoje)
    const designacoesFuturas = designacoes.filter(designacao => {
        return designacao.status === 'ativo' && 
               new Date(designacao.dataDesignacao) > hoje;
    });
    
    // Ordenar por data de designação (mais próximas primeiro)
    designacoesFuturas.sort((a, b) => new Date(a.dataDesignacao) - new Date(b.dataDesignacao));
    
    // Limitar a 5 designações
    const proximasDesignacoes = designacoesFuturas.slice(0, 5);
    
    // Verificar se há próximas designações
    if (proximasDesignacoes.length === 0) {
        semProximasAlert.classList.remove('d-none');
        return;
    }
    
    // Renderizar designações
    proximasDesignacoesContainer.innerHTML = '';
    
    proximasDesignacoes.forEach(designacao => {
        // Buscar território
        const territorio = territorios.find(t => t.id === designacao.territorioId) || { nome: 'Território não encontrado' };
        
        // Buscar saída de campo
        const saida = saidasCampo.find(s => s.id === designacao.saidaCampoId) || { nome: 'Saída não encontrada' };
        
        // Criar linha na tabela
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${territorio.nome}</td>
            <td>${saida.nome}</td>
            <td>${designacao.responsavel}</td>
            <td>${formatarData(designacao.dataDesignacao)}</td>
            <td>${formatarData(designacao.dataDevolucao)}</td>
            <td>
                <a href="/modules/territorios/visualizar.html?territorio=${designacao.territorioId}" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-eye"></i>
                </a>
            </td>
        `;
        
        proximasDesignacoesContainer.appendChild(tr);
    });
}

// Função para formatar data no formato brasileiro
function formatarData(dataString) {
    return moment(dataString).format('DD/MM/YYYY');
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

// Inicializar página
document.addEventListener('DOMContentLoaded', init);