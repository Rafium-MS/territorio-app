// Array para armazenar as saídas de campo
let saidasCampo = [];

// Elementos DOM
const saidaCampoForm = document.getElementById('saida-campo-form');
const dataInput = document.getElementById('data');
const diaSemanaSelect = document.getElementById('dia-semana');
const tabelaSaidas = document.getElementById('tabela-saidas');
const semSaidasAlert = document.getElementById('sem-saidas');

// Função para preencher automaticamente o dia da semana ao selecionar uma data
dataInput.addEventListener('change', function() {
    const data = new Date(this.value);
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const diaSemana = diasSemana[data.getDay()];
    
    diaSemanaSelect.value = diaSemana;
});

// Função para adicionar uma nova saída de campo
saidaCampoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;
    const diaSemana = document.getElementById('dia-semana').value;
    const horario = document.getElementById('horario').value;
    const dirigente = document.getElementById('dirigente').value;
    
    // Cria a nova saída de campo
    const novaSaida = {
        id: Date.now().toString(),
        nome: nome,
        data: data,
        diaSemana: diaSemana,
        horario: horario,
        dirigente: dirigente || '-'
    };
    
    // Adiciona ao array
    saidasCampo.push(novaSaida);
    
    // Salva no localStorage
    salvarSaidasCampo();
    
    // Atualiza a tabela
    atualizarTabelaSaidas();
    
    // Limpa o formulário
    this.reset();
    
    // Exibe mensagem de sucesso
    mostrarMensagem('Saída de campo cadastrada com sucesso!', 'success');
});

// Função para salvar as saídas de campo no localStorage
function salvarSaidasCampo() {
    localStorage.setItem('saidasCampo', JSON.stringify(saidasCampo));
}

// Função para carregar as saídas de campo do localStorage
function carregarSaidasCampo() {
    const saidasCampoJSON = localStorage.getItem('saidasCampo');
    
    if (saidasCampoJSON) {
        saidasCampo = JSON.parse(saidasCampoJSON);
    } else {
        // Cria algumas saídas de exemplo se não houver nenhuma
        saidasCampo = [
            {
                id: '1',
                nome: 'Saída 1',
                data: '2025-03-25',
                diaSemana: 'Terça-feira',
                horario: '09:00',
                dirigente: 'João Silva'
            },
            {
                id: '2',
                nome: 'Saída 2',
                data: '2025-03-26',
                diaSemana: 'Quarta-feira',
                horario: '19:30',
                dirigente: 'Maria Oliveira'
            },
            {
                id: '3',
                nome: 'Saída 3',
                data: '2025-03-28',
                diaSemana: 'Sexta-feira',
                horario: '14:00',
                dirigente: 'Carlos Santos'
            }
        ];
        
        // Salva as saídas de exemplo no localStorage
        salvarSaidasCampo();
    }
}

// Função para atualizar a tabela de saídas
function atualizarTabelaSaidas() {
    const tbody = tabelaSaidas.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    
    if (saidasCampo.length === 0) {
        semSaidasAlert.classList.remove('d-none');
        return;
    }
    
    semSaidasAlert.classList.add('d-none');
    
    // Ordena as saídas por data
    const saidasOrdenadas = [...saidasCampo].sort((a, b) => new Date(a.data) - new Date(b.data));
    
    saidasOrdenadas.forEach(saida => {
        const dataFormatada = formatarData(saida.data);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${saida.nome}</td>
            <td>${dataFormatada}</td>
            <td>${saida.diaSemana}</td>
            <td>${saida.horario}</td>
            <td>${saida.dirigente}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editarSaida('${saida.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="removerSaida('${saida.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Função para editar uma saída
function editarSaida(id) {
    const saida = saidasCampo.find(s => s.id === id);
    
    if (saida) {
        document.getElementById('nome').value = saida.nome;
        document.getElementById('data').value = saida.data;
        document.getElementById('dia-semana').value = saida.diaSemana;
        document.getElementById('horario').value = saida.horario;
        document.getElementById('dirigente').value = saida.dirigente !== '-' ? saida.dirigente : '';
        
        // Remove a saída do array (será adicionada novamente quando o formulário for enviado)
        saidasCampo = saidasCampo.filter(s => s.id !== id);
        
        // Atualiza a tabela
        atualizarTabelaSaidas();
        
        // Mostra mensagem
        mostrarMensagem('Edite os dados e clique em "Cadastrar Saída" para salvar as alterações.', 'info');
    }
}

// Função para remover uma saída
function removerSaida(id) {
    if (confirm('Tem certeza que deseja remover esta saída de campo?')) {
        saidasCampo = saidasCampo.filter(s => s.id !== id);
        
        // Salva as alterações
        salvarSaidasCampo();
        
        // Atualiza a tabela
        atualizarTabelaSaidas();
        
        // Mostra mensagem
        mostrarMensagem('Saída de campo removida com sucesso!', 'success');
    }
}

// Função auxiliar para formatar data
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Função para mostrar mensagens
function mostrarMensagem(mensagem, tipo) {
    // Se o NotificationService estiver disponível, use-o
    if (typeof NotificationService !== 'undefined') {
        NotificationService.show(mensagem, tipo);
        return;
    }
    
    // Caso contrário, cria um alert simples
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    // Adiciona ao topo da página
    const main = document.querySelector('main');
    main.insertBefore(alertDiv, main.firstChild);
    
    // Remove após 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Função para tornar as funções acessíveis globalmente
window.editarSaida = editarSaida;
window.removerSaida = removerSaida;

// Inicializa a página
document.addEventListener('DOMContentLoaded', function() {
    carregarSaidasCampo();
    atualizarTabelaSaidas();
});