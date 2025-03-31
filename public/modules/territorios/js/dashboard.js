// Função para inicializar os gráficos do dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o gráfico de progresso de atendimentos por território
    initAtendimentosChart();
    
    // Inicializar o gráfico de tipos de imóveis
    initTiposImoveisChart();
    
    // Inicializar o gráfico de atendimentos por semana
    initAtendimentosSemanaChart();
    
    // Inicializar o território do dia
    carregarTerritorioDoDia();
    
    // Carregar as próximas saídas
    carregarProximasSaidas();
    
    // Carregar as últimas designações
    carregarUltimasDesignacoes();
    
    // Carregar os lembretes
    carregarLembretes();
});

// Função para inicializar o gráfico de progresso de atendimentos por território
function initAtendimentosChart() {
    const ctx = document.getElementById('atendimentosChart').getContext('2d');
    
    // Dados de exemplo (em uma aplicação real, você buscaria esses dados do seu serviço)
    const dados = {
        territorios: ['Território 1', 'Território 2', 'Território 3', 'Território 4', 'Território 5'],
        percentuais: [85, 65, 50, 90, 40]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dados.territorios,
            datasets: [{
                label: 'Percentual de Atendimentos',
                data: dados.percentuais,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

// Função para inicializar o gráfico de tipos de imóveis
function initTiposImoveisChart() {
    const ctx = document.getElementById('tiposImoveisChart').getContext('2d');
    
    // Dados de exemplo
    const dados = {
        labels: ['Residencial', 'Comercial', 'Prédios', 'Vilas'],
        data: [60, 15, 20, 5]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: dados.labels,
            datasets: [{
                data: dados.data,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Função para inicializar o gráfico de atendimentos por semana
function initAtendimentosSemanaChart() {
    const ctx = document.getElementById('atendimentosSemanaChart').getContext('2d');
    
    // Dados de exemplo
    const dados = {
        semanas: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        atendimentos: [12, 19, 8, 15]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dados.semanas,
            datasets: [{
                label: 'Atendimentos',
                data: dados.atendimentos,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Função para carregar o território do dia
function carregarTerritorioDoDia() {
    // Em uma aplicação real, você buscaria esses dados do seu serviço
    // Aqui estamos apenas usando os dados já definidos no HTML
}

// Função para carregar as próximas saídas
function carregarProximasSaidas() {
    // Em uma aplicação real, você buscaria esses dados do seu serviço
    // Aqui estamos apenas usando os dados já definidos no HTML
}

// Função para carregar as últimas designações
function carregarUltimasDesignacoes() {
    // Em uma aplicação real, você buscaria esses dados do seu serviço
    // Aqui estamos apenas usando os dados já definidos no HTML
}

// Função para carregar os lembretes
function carregarLembretes() {
    // Em uma aplicação real, você buscaria esses dados do seu serviço
    // Aqui estamos apenas usando os dados já definidos no HTML
    
    // Adicionar funcionalidade para o botão de adicionar lembrete
    document.querySelector('.card-footer button').addEventListener('click', function() {
        // Implementar lógica para adicionar lembrete
        console.log('Adicionar lembrete clicado');
        
        // Exemplo: poderia abrir um modal aqui
        // const modalLembrete = new bootstrap.Modal(document.getElementById('modal-lembrete'));
        // modalLembrete.show();
    });
}