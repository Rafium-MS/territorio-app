/**
 * Renderiza o gráfico de atendimentos por período
 * @param {Object} dados - Dados coletados
 */
function renderizarGraficoAtendimentosPeriodo(dados) {
    const ctx = document.getElementById('atendimentosPeriodoChart').getContext('2d');
    
    // Preparar dados para o gráfico
    const labels = [];
    const data = [];
    
    // Formatar labels para exibição (mês/ano)
    Object.entries(dados.periodos).forEach(([mes, quantidade]) => {
        const [ano, mesNum] = mes.split('-');
        const nomeMes = new Date(ano, mesNum - 1).toLocaleString('pt-BR', { month: 'short' });
        labels.push(`${nomeMes}/${ano}`);
        data.push(quantidade);
    });
    
    // Destruir gráfico anterior se existir
    if (atendimentosPeriodoChart) {
        atendimentosPeriodoChart.destroy();
    }
    
    // Criar novo gráfico
    atendimentosPeriodoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Atendimentos',
                data: data,
                fill: false,
                borderColor: '#007bff',
                tension: 0.1,
                backgroundColor: '#007bff',
                pointBackgroundColor: '#007bff',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#007bff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false,
                    text: 'Atendimentos por Período'
                }
            },
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

/**
 * Preenche a tabela de estatísticas
 * @param {Object} dados - Dados coletados
 */
function preencherTabelaEstatisticas(dados) {
    const tbody = document.getElementById('tabela-estatisticas');
    tbody.innerHTML = '';
    
    // Calcular totais
    const totalImoveis = dados.tipos.residencial.total + 
                        dados.tipos.comercial.total + 
                        dados.tipos.predio.total + 
                        dados.tipos.vila.total;
    
    const totalAtendidos = dados.tipos.residencial.atendidos + 
                          dados.tipos.comercial.atendidos + 
                          dados.tipos.predio.atendidos + 
                          dados.tipos.vila.atendidos;
    
    // Criar linhas da tabela
    const linhas = [
        {
            metrica: 'Total de Imóveis',
            residencial: dados.tipos.residencial.total,
            comercial: dados.tipos.comercial.total,
            predio: dados.tipos.predio.total,
            vila: dados.tipos.vila.total,
            total: totalImoveis
        },
        {
            metrica: 'Imóveis Atendidos',
            residencial: dados.tipos.residencial.atendidos,
            comercial: dados.tipos.comercial.atendidos,
            predio: dados.tipos.predio.atendidos,
            vila: dados.tipos.vila.atendidos,
            total: totalAtendidos
        },
        {
            metrica: 'Percentual de Atendimento',
            residencial: dados.tipos.residencial.total > 0 ? 
                Math.round((dados.tipos.residencial.atendidos / dados.tipos.residencial.total) * 100) : 0,
            comercial: dados.tipos.comercial.total > 0 ? 
                Math.round((dados.tipos.comercial.atendidos / dados.tipos.comercial.total) * 100) : 0,
            predio: dados.tipos.predio.total > 0 ? 
                Math.round((dados.tipos.predio.atendidos / dados.tipos.predio.total) * 100) : 0,
            vila: dados.tipos.vila.total > 0 ? 
                Math.round((dados.tipos.vila.atendidos / dados.tipos.vila.total) * 100) : 0,
            total: totalImoveis > 0 ? Math.round((totalAtendidos / totalImoveis) * 100) : 0
        }
    ];
    
    // Adicionar linhas à tabela
    linhas.forEach(linha => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <th>${linha.metrica}</th>
            <td>${linha.metrica === 'Percentual de Atendimento' ? `${linha.residencial}%` : linha.residencial}</td>
            <td>${linha.metrica === 'Percentual de Atendimento' ? `${linha.comercial}%` : linha.comercial}</td>
            <td>${linha.metrica === 'Percentual de Atendimento' ? `${linha.predio}%` : linha.predio}</td>
            <td>${linha.metrica === 'Percentual de Atendimento' ? `${linha.vila}%` : linha.vila}</td>
            <td><strong>${linha.metrica === 'Percentual de Atendimento' ? `${linha.total}%` : linha.total}</strong></td>
        `;
        
        tbody.appendChild(tr);
    });
}

/**
 * Exporta os dados do território atual
 */
function exportarDados() {
    if (!territorioAtual) {
        mostrarMensagem('Selecione um território para exportar.', 'warning');
        return;
    }
    
    // Preparar dados
    const dados = {
        territorio: territorioAtual.nome,
        descricao: territorioAtual.descricao || '',
        data: new Date().toLocaleDateString(),
        ruas: []
    };
    
    // Coletar dados de cada rua
    territorioAtual.ruas.forEach(rua => {
        const ruaDados = {
            nome: rua.nome,/**
 * Cria o elemento HTML para um imóvel
 * @param {Object} imovel - Objeto do imóvel
 * @param {Object} rua - Objeto da rua a que o imóvel pertence
 * @returns {HTMLElement} - Elemento DOM do imóvel
 */
function criarElementoImovel(imovel, rua) {
    const atendimento = atendimentos[imovel.id];
    const isAtendido = !!atendimento;
    
    const imovelDiv = document.createElement('div');
    imovelDiv.className = `property-card${isAtendido ? ' attended' : ''}`;
    imovelDiv.id = `imovel-${imovel.id}`;
    imovelDiv.setAttribute('data-imovel-id', imovel.id);
    
    // Formatar tipo para exibição
    const tipoFormatado = formatarTipoImovel(imovel.tipo);
    const tipoClasse = imovel.tipo;
    
    // Texto do card
    imovelDiv.innerHTML = `
        <div class="property-header">
            <div class="property-number">Nº ${imovel.numero}</div>
            <span class="property-type ${tipoClasse}">${tipoFormatado}</span>
        </div>
        <div class="property-body">
            ${isAtendido ? `
                <div class="attendance-date">
                    <i class="fas fa-calendar-check me-1"></i> ${formatarData(atendimento.data)}
                </div>
                <div class="attendance-result">
                    <span class="badge bg-${obterCorResultado(atendimento.resultado)}">${formatarResultado(atendimento.resultado)}</span>
                </div>
            ` : ''}
        </div>
        <div class="property-actions">
            <button class="btn btn-sm btn-outline-primary btn-attend" title="Registrar Atendimento">
                <i class="fas fa-clipboard-check"></i>
            </button>
            <button class="btn btn-sm btn-outline-info btn-details" title="Ver Detalhes">
                <i class="fas fa-info-circle"></i>
            </button>
        </div>
    `;
    
    // Event listener para botão de atendimento
    const btnAttend = imovelDiv.querySelector('.btn-attend');
    btnAttend.addEventListener('click', (e) => {
        e.stopPropagation();
        abrirModalAtendimento(imovel.id);
    });
    
    // Event listener para botão de detalhes
    const btnDetails = imovelDiv.querySelector('.btn-details');
    btnDetails.addEventListener('click', (e) => {
        e.stopPropagation();
        abrirModalDetalhesImovel(imovel.id, rua);
    });
    
    // Event listener para o card inteiro (para abrir modal de detalhes)
    imovelDiv.addEventListener('click', () => {
        abrirModalDetalhesImovel(imovel.id, rua);
    });
    
    return imovelDiv;
}

/**
 * Atualiza as estatísticas do território
 */
function atualizarEstatisticas() {
    if (!territorioAtual) return;
    
    // Contar imóveis
    let totalImoveis = 0;
    let totalAtendidos = 0;
    let totalRuas = 0;
    
    // Aplicar os mesmos filtros que estão sendo usados na visualização
    territorioAtual.ruas.forEach(rua => {
        const imoveisFiltrados = filtrarImoveis(rua.imoveis);
        
        if (imoveisFiltrados.length > 0) {
            totalRuas++;
            totalImoveis += imoveisFiltrados.length;
            
            imoveisFiltrados.forEach(imovel => {
                if (atendimentos[imovel.id]) {
                    totalAtendidos++;
                }
            });
        }
    });
    
    // Atualizar estatísticas
    statTotalImoveis.textContent = totalImoveis;
    statAtendidos.textContent = totalAtendidos;
    statRuas.textContent = totalRuas;
    statPendentes.textContent = totalImoveis - totalAtendidos;
    
    // Atualizar barra de progresso
    const porcentagem = totalImoveis > 0 ? Math.round((totalAtendidos / totalImoveis) * 100) : 0;
    progressoAtendimentos.style.width = `${porcentagem}%`;
    progressoAtendimentos.setAttribute('aria-valuenow', porcentagem);
    progressoPorcentagem.textContent = `${porcentagem}% (${totalAtendidos}/${totalImoveis})`;
}

/**
 * Abre o modal de atendimento
 * @param {string} imovelId - ID do imóvel
 */
function abrirModalAtendimento(imovelId) {
    // Buscar informações do imóvel
    let imovelEncontrado = null;
    let ruaEncontrada = null;
    
    for (const rua of territorioAtual.ruas) {
        const imovel = rua.imoveis.find(i => i.id === imovelId);
        if (imovel) {
            imovelEncontrado = imovel;
            ruaEncontrada = rua;
            break;
        }
    }
    
    if (!imovelEncontrado || !ruaEncontrada) {
        mostrarMensagem('Imóvel não encontrado!', 'danger');
        return;
    }
    
    // Preencher dados do modal
    imovelIdInput.value = imovelId;
    modalInfoImovel.textContent = `Imóvel: Nº ${imovelEncontrado.numero} (${formatarTipoImovel(imovelEncontrado.tipo)}) - ${ruaEncontrada.nome}`;
    
    // Verificar se já existe atendimento
    const atendimento = atendimentos[imovelId];
    
    // Atualizar histórico de atendimentos
    if (atendimento) {
        dataAtendimentoInput.value = atendimento.data;
        resultadoAtendimentoSelect.value = atendimento.resultado || '';
        observacoesInput.value = atendimento.observacoes || '';
        btnRemoverAtendimento.classList.remove('d-none');
        
        historicoAtendimentos.innerHTML = `
            <p class="mb-1"><i class="fas fa-history me-2"></i> <strong>Último atendimento:</strong> ${formatarData(atendimento.data)}</p>
            <p class="mb-1"><strong>Resultado:</strong> <span class="badge bg-${obterCorResultado(atendimento.resultado)}">${formatarResultado(atendimento.resultado)}</span></p>
            ${atendimento.observacoes ? `<p class="mb-0"><strong>Observações:</strong> ${atendimento.observacoes}</p>` : ''}
        `;
    } else {
        const hoje = new Date().toISOString().split('T')[0];
        dataAtendimentoInput.value = hoje;
        resultadoAtendimentoSelect.value = '';
        observacoesInput.value = '';
        btnRemoverAtendimento.classList.add('d-none');
        
        historicoAtendimentos.innerHTML = `
            <p class="mb-0"><i class="fas fa-info-circle me-2"></i> Este imóvel ainda não foi atendido.</p>
        `;
    }
    
    // Mostrar modal
    modalAtendimento.show();
}

/**
 * Abre o modal de detalhes do imóvel
 * @param {string} imovelId - ID do imóvel
 * @param {Object} rua - Objeto da rua (opcional)
 */
function abrirModalDetalhesImovel(imovelId, rua) {
    // Buscar informações do imóvel
    let imovelEncontrado = null;
    let ruaEncontrada = rua;
    
    if (!ruaEncontrada) {
        for (const r of territorioAtual.ruas) {
            const imovel = r.imoveis.find(i => i.id === imovelId);
            if (imovel) {
                imovelEncontrado = imovel;
                ruaEncontrada = r;
                break;
            }
        }
    } else {
        imovelEncontrado = ruaEncontrada.imoveis.find(i => i.id === imovelId);
    }
    
    if (!imovelEncontrado || !ruaEncontrada) {
        mostrarMensagem('Imóvel não encontrado!', 'danger');
        return;
    }
    
    // Preencher dados do modal
    document.getElementById('modal-detalhes-imovel-label').textContent = `Imóvel Nº ${imovelEncontrado.numero}`;
    document.getElementById('detalhe-endereco').textContent = `${ruaEncontrada.nome}, ${imovelEncontrado.numero}`;
    document.getElementById('detalhe-tipo').textContent = formatarTipoImovel(imovelEncontrado.tipo);
    
    // Verificar atendimentos
    const atendimento = atendimentos[imovelId];
    
    if (atendimento) {
        document.getElementById('detalhe-status').innerHTML = `
            <span class="badge bg-${obterCorResultado(atendimento.resultado)}">${formatarResultado(atendimento.resultado)}</span>
        `;
        document.getElementById('detalhe-ultimo-atendimento').textContent = formatarData(atendimento.data);
        
        // Histórico completo
        document.getElementById('historico-completo').innerHTML = `
            <div class="alert alert-info">
                <p class="mb-1"><strong>Data:</strong> ${formatarData(atendimento.data)}</p>
                <p class="mb-1"><strong>Resultado:</strong> <span class="badge bg-${obterCorResultado(atendimento.resultado)}">${formatarResultado(atendimento.resultado)}</span></p>
                ${atendimento.observacoes ? `<p class="mb-0"><strong>Observações:</strong> ${atendimento.observacoes}</p>` : '<p class="mb-0">Sem observações adicionais.</p>'}
            </div>
        `;
        
        // Observações
        document.getElementById('observacoes-imovel').innerHTML = atendimento.observacoes ? `<p>${atendimento.observacoes}</p>` : '<p class="text-muted">Sem observações registradas.</p>';
    } else {
        document.getElementById('detalhe-status').innerHTML = '<span class="badge bg-secondary">Não Atendido</span>';
        document.getElementById('detalhe-ultimo-atendimento').textContent = 'Nunca atendido';
        document.getElementById('historico-completo').innerHTML = '<p class="text-muted">Nenhum atendimento registrado para este imóvel.</p>';
        document.getElementById('observacoes-imovel').innerHTML = '<p class="text-muted">Nenhuma observação registrada para este imóvel.</p>';
    }
    
    // Configurar botão de registrar atendimento
    btnRegistrarAtendimentoDetalhe.setAttribute('data-imovel-id', imovelId);
    
    // Mostrar modal
    modalDetalhesImovel.show();
}

/**
 * Registra um atendimento para um imóvel
 */
function registrarAtendimento() {
    const imovelId = imovelIdInput.value;
    const data = dataAtendimentoInput.value;
    const resultado = resultadoAtendimentoSelect.value;
    const observacoes = observacoesInput.value;
    
    // Validar campos
    if (!imovelId || !data || !resultado) {
        mostrarMensagem('Por favor, preencha todos os campos obrigatórios!', 'warning');
        return;
    }
    
    // Atualizar ou criar atendimento
    atendimentos[imovelId] = {
        data: data,
        resultado: resultado,
        observacoes: observacoes,
        timestamp: new Date().toISOString()
    };
    
    // Salvar atendimentos
    localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
    
    // Fechar modal
    modalAtendimento.hide();
    
    // Atualizar UI
    renderizarRuas();
    atualizarEstatisticas();
    
    // Se estiver na tab de mapa, atualizar marcadores
    if (document.getElementById('mapa-tab').classList.contains('active') && mapa) {
        atualizarMarcadores();
    }
    
    // Se estiver na tab de estatísticas, atualizar gráficos
    if (document.getElementById('stats-tab').classList.contains('active')) {
        renderizarEstatisticas();
    }
    
    // Mostrar mensagem
    mostrarMensagem('Atendimento registrado com sucesso!', 'success');
}

/**
 * Inicializa o mapa
 */
function inicializarMapa() {
    if (!territorioAtual) return;
    
    // Limpar mapa anterior
    if (mapa) {
        mapa.remove();
        mapa = null;
    }
    
    // Inicializar mapa
    mapa = L.map('mapa-territorio').setView([0, 0], 15);
    
    // Adicionar camada base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    
    // Criar marcadores
    criarMarcadores();
}

/**
 * Cria marcadores no mapa
 */
function criarMarcadores() {
    if (!mapa || !territorioAtual) return;
    
    // Limpar marcadores anteriores
    marcadores.forEach(marcador => {
        mapa.removeLayer(marcador);
    });
    marcadores = [];
    
    // Coordenadas fictícias para simular mapa real
    // Em um sistema real, estas seriam coordenadas reais obtidas de um serviço de geocodificação
    let centerLat = -23.550520;
    let centerLng = -46.633308;
    
    // Simulação de coordenadas para ruas e imóveis
    const limiteRuas = territorioAtual.ruas.length;
    const ruasVisiveis = [];
    
    territorioAtual.ruas.forEach((rua, ruaIndex) => {
        const imoveisFiltrados = filtrarImoveis(rua.imoveis);
        if (imoveisFiltrados.length === 0) return;
        
        ruasVisiveis.push(rua);
        
        // Ângulo para distribuir as ruas em um círculo
        const angle = (ruaIndex / limiteRuas) * 2 * Math.PI;
        const ruaLat = centerLat + Math.sin(angle) * 0.01;
        const ruaLng = centerLng + Math.cos(angle) * 0.01;
        
        // Criar linha representando a rua
        const ruaLine = L.polyline([[centerLat, centerLng], [ruaLat, ruaLng]], {
            color: '#3388ff',
            weight: 3,
            opacity: 0.7
        }).addTo(mapa);
        
        ruaLine.bindTooltip(rua.nome, {
            permanent: true,
            direction: 'center',
            className: 'street-label'
        });
        
        marcadores.push(ruaLine);
        
        // Distribuir imóveis ao longo da rua
        const imoveisVisiveis = imoveisFiltrados.length;
        
        imoveisFiltrados.forEach((imovel, imovelIndex) => {
            // Calcular posição do imóvel na rua
            const factor = (imovelIndex + 1) / (imoveisVisiveis + 1);
            const imovelLat = centerLat + Math.sin(angle) * 0.01 * factor;
            const imovelLng = centerLng + Math.cos(angle) * 0.01 * factor;
            
            // Determinar cor do marcador
            const atendimento = atendimentos[imovel.id];
            const isAtendido = !!atendimento;
            const cor = obterCorParaMarcador(imovel.tipo, isAtendido);
            
            // Criar marcador
            const marcador = L.circleMarker([imovelLat, imovelLng], {
                radius: 8,
                fillColor: cor,
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(mapa);
            
            // Adicionar popup
            marcador.bindPopup(`
                <div class="map-popup">
                    <h6>${rua.nome}, Nº ${imovel.numero}</h6>
                    <p><strong>Tipo:</strong> ${formatarTipoImovel(imovel.tipo)}</p>
                    <p><strong>Status:</strong> ${isAtendido ? formatarResultado(atendimento.resultado) : 'Não Atendido'}</p>
                    ${isAtendido ? `<p><strong>Data:</strong> ${formatarData(atendimento.data)}</p>` : ''}
                    <button class="btn btn-sm btn-primary btn-atender-mapa" data-imovel-id="${imovel.id}">
                        ${isAtendido ? 'Atualizar Atendimento' : 'Registrar Atendimento'}
                    </button>
                </div>
            `);
            
            // Event listener para botão no popup
            marcador.on('popupopen', () => {
                document.querySelector(`.btn-atender-mapa[data-imovel-id="${imovel.id}"]`).addEventListener('click', () => {
                    mapa.closePopup();
                    abrirModalAtendimento(imovel.id);
                });
            });
            
            marcadores.push(marcador);
        });
    });
    
    // Centralizar mapa se houver marcadores
    if (marcadores.length > 0) {
        const bounds = L.featureGroup(marcadores).getBounds();
        mapa.fitBounds(bounds, { padding: [50, 50] });
    }
}

/**
 * Renderiza as estatísticas e gráficos
 */
function renderizarEstatisticas() {
    if (!territorioAtual) return;
    
    // Obter dados para os gráficos
    const dadosEstatisticas = coletarDadosEstatisticas();
    
    // Renderizar gráficos
    renderizarGraficoTiposImoveis(dadosEstatisticas);
    renderizarGraficoStatusAtendimentos(dadosEstatisticas);
    renderizarGraficoAtendimentosPeriodo(dadosEstatisticas);
    
    // Preencher tabela de resumo
    preencherTabelaEstatisticas(dadosEstatisticas);
}

/**
 * Coleta dados para os gráficos e estatísticas
 * @returns {Object} - Objeto com dados para os gráficos
 */
function coletarDadosEstatisticas() {
    // Inicializar contadores
    const contadores = {
        tipos: {
            residencial: { total: 0, atendidos: 0 },
            comercial: { total: 0, atendidos: 0 },
            predio: { total: 0, atendidos: 0 },
            vila: { total: 0, atendidos: 0 }
        },
        resultados: {
            positivo: 0,
            ausente: 0,
            recusado: 0,
            outro: 0,
            naoAtendido: 0
        },
        periodos: {}
    };
    
    // Inicializar períodos (últimos 6 meses)
    const hoje = new Date();
    for (let i = 5; i >= 0; i--) {
        const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const mesStr = mesAnterior.toISOString().slice(0, 7); // formato: YYYY-MM
        contadores.periodos[mesStr] = 0;
    }
    
    // Coletar dados
    territorioAtual.ruas.forEach(rua => {
        rua.imoveis.forEach(imovel => {
            // Verificar se o tipo existe, senão considerar como "outro"
            const tipo = contadores.tipos[imovel.tipo] ? imovel.tipo : 'outro';
            
            // Incrementar contador de tipo
            if (contadores.tipos[tipo]) {
                contadores.tipos[tipo].total++;
                
                // Verificar atendimento
                const atendimento = atendimentos[imovel.id];
                if (atendimento) {
                    contadores.tipos[tipo].atendidos++;
                    
                    // Incrementar contador de resultado
                    const resultado = atendimento.resultado || 'outro';
                    contadores.resultados[resultado]++;
                    
                    // Incrementar contador de período
                    const dataAtendimento = new Date(atendimento.data);
                    const mesStr = dataAtendimento.toISOString().slice(0, 7);
                    if (contadores.periodos[mesStr] !== undefined) {
                        contadores.periodos[mesStr]++;
                    }
                } else {
                    contadores.resultados.naoAtendido++;
                }
            }
        });
    });
    
    return contadores;
}

/**
 * Renderiza o gráfico de tipos de imóveis
 * @param {Object} dados - Dados coletados
 */
function renderizarGraficoTiposImoveis(dados) {
    const ctx = document.getElementById('tiposImoveisChart').getContext('2d');
    
    // Preparar dados para o gráfico
    const labels = ['Residencial', 'Comercial', 'Prédio', 'Vila'];
    const atendidos = [
        dados.tipos.residencial.atendidos,
        dados.tipos.comercial.atendidos,
        dados.tipos.predio.atendidos,
        dados.tipos.vila.atendidos
    ];
    const naoAtendidos = [
        dados.tipos.residencial.total - dados.tipos.residencial.atendidos,
        dados.tipos.comercial.total - dados.tipos.comercial.atendidos,
        dados.tipos.predio.total - dados.tipos.predio.atendidos,
        dados.tipos.vila.total - dados.tipos.vila.atendidos
    ];
    
    // Destruir gráfico anterior se existir
    if (tiposImoveisChart) {
        tiposImoveisChart.destroy();
    }
    
    // Criar novo gráfico
    tiposImoveisChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Atendidos',
                    data: atendidos,
                    backgroundColor: '#28a745',
                    borderColor: '#28a745',
                    borderWidth: 1
                },
                {
                    label: 'Não Atendidos',
                    data: naoAtendidos,
                    backgroundColor: '#6c757d',
                    borderColor: '#6c757d',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Tipos de Imóveis'
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

/**
 * Renderiza o gráfico de status de atendimentos
 * @param {Object} dados - Dados coletados
 */
function renderizarGraficoStatusAtendimentos(dados) {
    const ctx = document.getElementById('statusAtendimentosChart').getContext('2d');
    
    // Preparar dados para o gráfico
    const labels = ['Positivo', 'Ausente', 'Recusado', 'Outro', 'Não Atendido'];
    const data = [
        dados.resultados.positivo,
        dados.resultados.ausente,
        dados.resultados.recusado,
        dados.resultados.outro,
        dados.resultados.naoAtendido
    ];
    const backgroundColors = [
        '#28a745', // Verde para positivo
        '#ffc107', // Amarelo para ausente
        '#dc3545', // Vermelho para recusado
        '#17a2b8', // Azul para outro
        '#6c757d'  // Cinza para não atendido
    ];
    
    // Destruir gráfico anterior se existir
    if (statusAtendimentosChart) {
        statusAtendimentosChart.destroy();
    }
    
    // Criar novo gráfico
    statusAtendimentosChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: false,
                    text: 'Status de Atendimentos'
                }
            }
        }
    });
}

// Variáveis globais
let territorios = [];
let saidasCampo = [];
let atendimentos = {};
let territorioAtual = null;
let mapa = null;
let marcadores = [];

// Elementos DOM principais
const selectTerritorio = document.getElementById('select-territorio');
const selectSaida = document.getElementById('select-saida');
const btnLimparFiltros = document.getElementById('btn-limpar-filtros');
const btnAplicarFiltros = document.getElementById('btn-aplicar-filtros');
const btnDesignarTerritorio = document.getElementById('btn-designar-territorio');
const btnExportarDados = document.getElementById('btn-exportar-dados');
const btnImprimir = document.getElementById('btn-imprimir');
const btnViewMode = document.getElementById('btn-view-mode');

// Elementos de filtro
const filtroResidencial = document.getElementById('filtro-residencial');
const filtroComercial = document.getElementById('filtro-comercial');
const filtroPredio = document.getElementById('filtro-predio');
const filtroVila = document.getElementById('filtro-vila');
const filtroAtendidos = document.getElementById('filtro-atendidos');
const filtroNaoAtendidos = document.getElementById('filtro-nao-atendidos');
const filtroRecusados = document.getElementById('filtro-recusados');
const filtroDataInicio = document.getElementById('filtro-data-inicio');
const filtroDataFim = document.getElementById('filtro-data-fim');

// Elementos de visualização
const loadingIndicator = document.getElementById('loading');
const semDadosAlert = document.getElementById('sem-dados');
const territorioHeader = document.getElementById('territory-header');
const territorioStats = document.getElementById('territory-stats');
const progressContainer = document.getElementById('progress-container');
const progressoAtendimentos = document.getElementById('progresso-atendimentos');
const progressoPorcentagem = document.getElementById('progresso-porcentagem');
const ruasContainer = document.getElementById('ruas-container');
const mapaTerritorio = document.getElementById('mapa-territorio');

// Elementos de estatísticas
const statTotalImoveis = document.getElementById('stat-total-imoveis');
const statAtendidos = document.getElementById('stat-atendidos');
const statRuas = document.getElementById('stat-ruas');
const statPendentes = document.getElementById('stat-pendentes');

// Elementos do modal de atendimento
const modalAtendimento = new bootstrap.Modal(document.getElementById('modal-atendimento'));
const modalDetalhesImovel = new bootstrap.Modal(document.getElementById('modal-detalhes-imovel'));
const imovelIdInput = document.getElementById('imovel-id');
const modalInfoImovel = document.getElementById('modal-info-imovel');
const historicoAtendimentos = document.getElementById('historico-atendimentos');
const dataAtendimentoInput = document.getElementById('data-atendimento');
const resultadoAtendimentoSelect = document.getElementById('resultado-atendimento');
const observacoesInput = document.getElementById('observacoes');
const btnRemoverAtendimento = document.getElementById('btn-remover-atendimento');
const btnConfirmarAtendimento = document.getElementById('btn-confirmar-atendimento');
const btnRegistrarAtendimentoDetalhe = document.getElementById('btn-registrar-atendimento-detalhe');

// Gráficos
let tiposImoveisChart = null;
let statusAtendimentosChart = null;
let atendimentosPeriodoChart = null;

/**
 * Inicializa a página
 */
function init() {
    // Definir data padrão para o input de data de atendimento
    const hoje = new Date().toISOString().split('T')[0];
    dataAtendimentoInput.value = hoje;
    
    // Carregar dados
    carregarDados()
        .then(() => {
            // Configurar event listeners
            configurarEventListeners();
            
            // Verificar se há território na URL
            const urlParams = new URLSearchParams(window.location.search);
            const territorioId = urlParams.get('territorio');
            
            if (territorioId) {
                selectTerritorio.value = territorioId;
                carregarTerritorio(territorioId);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            mostrarMensagem('Erro ao carregar dados. Por favor, tente novamente.', 'danger');
            loadingIndicator.classList.add('d-none');
            semDadosAlert.classList.remove('d-none');
        });
}

/**
 * Carrega os dados necessários para a página
 */
async function carregarDados() {
    loadingIndicator.classList.remove('d-none');
    
    try {
        // Carregar territórios
        const territoriosJSON = localStorage.getItem('territorios');
        if (territoriosJSON) {
            territorios = JSON.parse(territoriosJSON);
        } else {
            territorios = [];
        }
        
        // Carregar saídas de campo
        const saidasCampoJSON = localStorage.getItem('saidasCampo');
        if (saidasCampoJSON) {
            saidasCampo = JSON.parse(saidasCampoJSON);
        } else {
            saidasCampo = [];
        }
        
        // Carregar atendimentos
        const atendimentosJSON = localStorage.getItem('atendimentos');
        if (atendimentosJSON) {
            atendimentos = JSON.parse(atendimentosJSON);
        } else {
            atendimentos = {};
        }
        
        // Preencher selects
        preencherSelectTerritorios();
        preencherSelectSaidas();
        
        loadingIndicator.classList.add('d-none');
        
        if (territorios.length === 0) {
            semDadosAlert.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        throw error;
    }
}

/**
 * Preenche o select de territórios
 */
function preencherSelectTerritorios() {
    // Limpar opções atuais
    selectTerritorio.innerHTML = '<option value="">Selecione um território</option>';
    
    // Ordenar territórios por nome
    const territoriosOrdenados = [...territorios].sort((a, b) => a.nome.localeCompare(b.nome));
    
    // Adicionar opções para cada território
    territoriosOrdenados.forEach(territorio => {
        const option = document.createElement('option');
        option.value = territorio.id;
        option.textContent = territorio.nome;
        selectTerritorio.appendChild(option);
    });
}

/**
 * Preenche o select de saídas de campo
 */
function preencherSelectSaidas() {
    // Limpar opções atuais
    selectSaida.innerHTML = '<option value="">Todas as saídas</option>';
    
    // Ordenar saídas por nome
    const saidasOrdenadas = [...saidasCampo].sort((a, b) => a.nome.localeCompare(b.nome));
    
    // Adicionar opções para cada saída
    saidasOrdenadas.forEach(saida => {
        const option = document.createElement('option');
        option.value = saida.id;
        option.textContent = saida.nome;
        selectSaida.appendChild(option);
    });
}

/**
 * Carrega os dados de um território específico
 * @param {string} territorioId - ID do território a ser carregado
 */
function carregarTerritorio(territorioId) {
    // Resetar estado
    ruasContainer.innerHTML = '';
    if (mapa && mapa.remove) {
        mapa.remove();
        mapa = null;
    }
    marcadores = [];
    
    if (!territorioId) {
        // Esconder elementos do território
        territorioHeader.classList.add('d-none');
        territorioStats.classList.add('d-none');
        progressContainer.classList.add('d-none');
        semDadosAlert.classList.remove('d-none');
        return;
    }
    
    // Encontrar o território
    const territorio = territorios.find(t => t.id === territorioId);
    if (!territorio) {
        mostrarMensagem('Território não encontrado.', 'danger');
        semDadosAlert.classList.remove('d-none');
        return;
    }
    
    // Armazenar território atual
    territorioAtual = territorio;
    
    // Atualizar cabeçalho do território
    document.getElementById('territorio-nome').textContent = territorio.nome;
    document.getElementById('territorio-descricao').textContent = territorio.descricao || '';
    
    // Mostrar elementos do território
    territorioHeader.classList.remove('d-none');
    territorioStats.classList.remove('d-none');
    progressContainer.classList.remove('d-none');
    semDadosAlert.classList.add('d-none');
    
    // Aplicar filtros e renderizar
    aplicarFiltros();
    
    // Se estiver na tab de mapa, inicializar o mapa
    if (document.getElementById('mapa-tab').classList.contains('active')) {
        setTimeout(() => {
            inicializarMapa();
        }, 100);
    }
    
    // Se estiver na tab de estatísticas, renderizar os gráficos
    if (document.getElementById('stats-tab').classList.contains('active')) {
        renderizarEstatisticas();
    }
}

/**
 * Aplica os filtros atuais e renderiza os dados
 */
function aplicarFiltros() {
    if (!territorioAtual) return;
    
    // Renderizar ruas filtradas
    renderizarRuas();
    
    // Atualizar estatísticas
    atualizarEstatisticas();
}

/**
 * Renderiza as ruas do território atual com os filtros aplicados
 */
function renderizarRuas() {
    // Verificar se há território selecionado
    if (!territorioAtual) return;
    
    // Limpar container
    ruasContainer.innerHTML = '';
    
    // Filtrar por saída de campo
    const saidaId = selectSaida.value;
    
    // Iterar sobre cada rua
    const ruasFiltradas = territorioAtual.ruas.filter(rua => {
        // Aqui poderia haver uma condição para filtrar rua por saída de campo
        return true;
    });
    
    // Se não houver ruas após filtros
    if (ruasFiltradas.length === 0) {
        const alerta = document.createElement('div');
        alerta.className = 'alert alert-info';
        alerta.innerHTML = '<i class="fas fa-info-circle me-2"></i> Este território não possui ruas cadastradas.';
        ruasContainer.appendChild(alerta);
        return;
    }
    
    // Ordenar ruas por nome
    ruasFiltradas.sort((a, b) => a.nome.localeCompare(b.nome));
    
    // Para cada rua, verificar se há imóveis após aplicar os filtros
    let totalRuasVisiveis = 0;
    
    ruasFiltradas.forEach(rua => {
        // Filtrar imóveis
        const imoveisFiltrados = filtrarImoveis(rua.imoveis);
        
        // Verificar se há imóveis após filtros
        if (imoveisFiltrados.length === 0) return;
        
        // Incrementar contador de ruas visíveis
        totalRuasVisiveis++;
        
        // Criar elemento da rua
        const ruaElement = criarElementoRua(rua, imoveisFiltrados);
        ruasContainer.appendChild(ruaElement);
    });
    
    // Verificar se há ruas visíveis
    if (totalRuasVisiveis === 0) {
        const alerta = document.createElement('div');
        alerta.className = 'alert alert-info';
        alerta.innerHTML = '<i class="fas fa-info-circle me-2"></i> Nenhum imóvel encontrado com os filtros selecionados.';
        ruasContainer.appendChild(alerta);
    }
}

/**
 * Filtra imóveis de acordo com os filtros selecionados
 * @param {Array} imoveis - Array de imóveis para filtrar
 * @returns {Array} - Array de imóveis filtrados
 */
function filtrarImoveis(imoveis) {
    return imoveis.filter(imovel => {
        // Filtrar por tipo
        if (imovel.tipo === 'residencial' && !filtroResidencial.checked) return false;
        if (imovel.tipo === 'comercial' && !filtroComercial.checked) return false;
        if (imovel.tipo === 'predio' && !filtroPredio.checked) return false;
        if (imovel.tipo === 'vila' && !filtroVila.checked) return false;
        
        // Filtrar por status de atendimento
        const atendimento = atendimentos[imovel.id];
        const foiAtendido = !!atendimento;
        
        if (foiAtendido && !filtroAtendidos.checked) return false;
        if (!foiAtendido && !filtroNaoAtendidos.checked) return false;
        
        if (atendimento && atendimento.resultado === 'recusado' && !filtroRecusados.checked) return false;
        
        // Filtrar por período
        if (filtroDataInicio.value || filtroDataFim.value) {
            if (!atendimento) return false;
            
            const dataAtendimento = new Date(atendimento.data);
            
            if (filtroDataInicio.value) {
                const dataInicio = new Date(filtroDataInicio.value);
                if (dataAtendimento < dataInicio) return false;
            }
            
            if (filtroDataFim.value) {
                const dataFim = new Date(filtroDataFim.value);
                dataFim.setHours(23, 59, 59); // Incluir o dia inteiro
                if (dataAtendimento > dataFim) return false;
            }
        }
        
        return true;
    });
}

/**
 * Cria o elemento HTML para uma rua e seus imóveis
 * @param {Object} rua - Objeto da rua
 * @param {Array} imoveisFiltrados - Array de imóveis filtrados
 * @returns {HTMLElement} - Elemento DOM da rua
 */
function criarElementoRua(rua, imoveisFiltrados) {
    const ruaDiv = document.createElement('div');
    ruaDiv.className = 'street-card';
    ruaDiv.id = `rua-${rua.id}`;
    
    // Cabeçalho da rua
    const ruaHeader = document.createElement('div');
    ruaHeader.className = 'street-header';
    
    // Total de atendidos na rua
    const totalImoveis = imoveisFiltrados.length;
    const totalAtendidos = imoveisFiltrados.filter(imovel => atendimentos[imovel.id]).length;
    
    ruaHeader.innerHTML = `
        <h5 class="street-name">
            <i class="fas fa-road me-2"></i> ${formatarTipoRua(rua.tipo)} ${rua.nome}
        </h5>
        <span class="street-badge ${totalAtendidos === totalImoveis ? 'bg-success' : 'bg-info'}">${totalAtendidos}/${totalImoveis} atendidos</span>
    `;
    
    // Corpo da rua com os imóveis
    const ruaBody = document.createElement('div');
    ruaBody.className = 'street-body';
    
    // Grid de imóveis
    const propertyGrid = document.createElement('div');
    propertyGrid.className = 'property-grid';
    
    // Adicionar cada imóvel
    imoveisFiltrados.forEach(imovel => {
        const imovelElement = criarElementoImovel(imovel, rua);
        propertyGrid.appendChild(imovelElement);
    });
    
    ruaBody.appendChild(propertyGrid);
    
    // Montar tudo
    ruaDiv.appendChild(ruaHeader);
    ruaDiv.appendChild(ruaBody);
    
    return ruaDiv;
}