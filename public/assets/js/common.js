// Funções para manipulação do DOM
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// Funções de navegação
function navigateTo(page) {
    window.location.href = page;
}

// Funções de formatação
function formatDate(dateString) {
    const data = new Date(dateString);
    return data.toLocaleDateString('pt-BR');
}

// Carregar sidebar dinamicamente
function loadSidebar() {
    const sidebarContainer = $('#sidebar-container');
    
    if (!sidebarContainer) {
        console.error('Elemento sidebar-container não encontrado');
        return;
    }
    
    // Tentar carregar a sidebar usando fetch
    fetch('/components/sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar sidebar: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            sidebarContainer.innerHTML = html;
            highlightCurrentPage();
        })
        .catch(error => {
            console.error('Erro ao carregar sidebar:', error);
            
            // Fallback: carregar uma versão básica da sidebar
            sidebarContainer.innerHTML = `
                <div class="sidebar-sticky pt-3">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link" href="/index.html">
                                <i class="fas fa-home"></i> Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/modules/territorios/cadastro.html">
                                <i class="fas fa-map-marked-alt"></i> Cadastro de Territórios
                            </a>
                        </li>
                    </ul>
                </div>
            `;
        });
}

// Destacar a página atual no menu
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    
    // Tenta encontrar o link exato
    let menuItem = $(`#sidebar-menu a[href="${currentPath}"]`);
    
    // Se não encontrar, tenta um match parcial
    if (!menuItem) {
        const menuItems = $$('#sidebar-menu a');
        for (const item of menuItems) {
            if (currentPath.includes(item.getAttribute('href'))) {
                menuItem = item;
                break;
            }
        }
    }
    
    if (menuItem) {
        menuItem.classList.add('active');
    }
}

// Verificar sessão do usuário
function checkUserSession() {
    // Implementação da verificação de sessão
    // Pode ser expandida no futuro
    console.log('Verificação de sessão do usuário');
}

// Configurar listeners de eventos
function setupEventListeners() {
    // Implementação dos listeners globais
    console.log('Configurando listeners de eventos');
    
    // Exemplo: logout
    const logoutLink = $('a.nav-link[href="#"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Implementar lógica de logout
            alert('Função de logout não implementada');
        });
    }
}

// Inicialização comum a todas as páginas
function initPage() {
    console.log('Inicializando página');
    
    // Carregar elementos comuns
    loadSidebar();
    
    // Configurar listeners
    setupEventListeners();
    
    // Verificar sessão
    checkUserSession();
}

// Exportar funções para uso global
window.$ = $;
window.$$ = $$;
window.navigateTo = navigateTo;
window.formatDate = formatDate;