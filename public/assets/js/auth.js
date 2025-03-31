// public/assets/js/auth.js

const AuthService = {
    // Verificar se o usuário está autenticado
    isAuthenticated() {
        return localStorage.getItem('token') !== null;
    },
    
    // Obter token
    getToken() {
        return localStorage.getItem('token');
    },
    
    // Obter usuário atual
    async getCurrentUser() {
        try {
            if (!this.isAuthenticated()) {
                return null;
            }
            
            // Primeiro tenta buscar do cache local
            const cachedUser = localStorage.getItem('currentUser');
            if (cachedUser) {
                return JSON.parse(cachedUser);
            }
            
            // Se não tiver no cache, busca do servidor 
            const response = await fetch('/api/auth/me', {
                headers: {
                    'x-auth-token': this.getToken()
                }
            });
            
            if (!response.ok) {
                throw new Error('Não foi possível obter os dados do usuário');
            }
            
            const userData = await response.json();
            // Armazena no cache
            localStorage.setItem('currentUser', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Erro ao obter usuário:', error);
            
            // Fallback para modo offline
            const fallbackUser = localStorage.getItem('offlineUser');
            if (fallbackUser) {
                return JSON.parse(fallbackUser);
            }
            
            return null;
        }
    },
    
    // Login
    async login(email, senha) {
        try {
            // Tenta fazer login no servidor
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.msg || 'Erro ao fazer login');
            }
            
            // Armazenar token
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Configurar expiração do token (8 horas)
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 8);
            localStorage.setItem('tokenExpires', expiresAt.toString());
            
            return true;
        } catch (error) {
            console.error('Erro no login:', error);
            
            // Simular login para modo offline (apenas desenvolvimento)
            if (process.env.NODE_ENV === 'development' && email === 'admin@exemplo.com') {
                const fakeToken = 'fake-token-' + Date.now();
                const fakeUser = {
                    id: '1',
                    nome: 'Administrador',
                    email: 'admin@exemplo.com',
                    cargo: 'admin'
                };
                
                localStorage.setItem('token', fakeToken);
                localStorage.setItem('currentUser', JSON.stringify(fakeUser));
                localStorage.setItem('offlineUser', JSON.stringify(fakeUser));
                
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 8);
                localStorage.setItem('tokenExpires', expiresAt.toString());
                
                return true;
            }
            
            throw error;
        }
    },
    
    // Registro
    async register(nome, email, senha, cargo = 'usuario') {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, email, senha, cargo })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.msg || 'Erro ao registrar usuário');
            }
            
            // Armazenar token
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            return true;
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    },
    
    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('tokenExpires');
        // Redirecionar para a página de login
        window.location.href = '/login.html';
    },
    
    // Verificar permissão
    async hasPermission(role) {
        const user = await this.getCurrentUser();
        
        if (!user) return false;
        
        // Se o papel for 'admin', eles têm todas as permissões
        if (user.cargo === 'admin') return true;
        
        // Para outros papéis, verificar se corresponde
        return user.cargo === role;
    },
    
    // Verificar se o token expirou
    isTokenExpired() {
        const expiresAt = localStorage.getItem('tokenExpires');
        if (!expiresAt) return true;
        
        return new Date() > new Date(expiresAt);
    },
    
    // Renovar token
    async refreshToken() {
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'x-auth-token': this.getToken()
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.msg || 'Erro ao renovar token');
            }
            
            // Atualizar token
            localStorage.setItem('token', data.token);
            
            // Atualizar expiração
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 8);
            localStorage.setItem('tokenExpires', expiresAt.toString());
            
            return true;
        } catch (error) {
            console.error('Erro ao renovar token:', error);
            return false;
        }
    }
};

// Verificar autenticação em páginas restritas
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar se a página atual requer autenticação
    const publicPages = ['/login.html', '/register.html', '/recuperar-senha.html'];
    const currentPath = window.location.pathname;
    
    if (!publicPages.includes(currentPath)) {
        // Verificar se o usuário está autenticado
        if (!AuthService.isAuthenticated()) {
            // Redirecionar para página de login
            window.location.href = '/login.html?redirect=' + encodeURIComponent(currentPath);
            return;
        }
        
        // Verificar se o token expirou
        if (AuthService.isTokenExpired()) {
            // Tentar renovar o token
            const refreshSuccess = await AuthService.refreshToken();
            
            if (!refreshSuccess) {
                // Se não conseguir renovar, fazer logout
                AuthService.logout();
                return;
            }
        }
        
        // Verificar permissões específicas de página
        const adminOnlyPages = [
            '/admin/',
            '/modules/usuarios/'
        ];
        
        if (adminOnlyPages.some(page => currentPath.startsWith(page))) {
            const isAdmin = await AuthService.hasPermission('admin');
            
            if (!isAdmin) {
                // Redirecionar para página de acesso negado
                window.location.href = '/acesso-negado.html';
                return;
            }
        }
    }
    
    // Configurar eventos globais
    
    // Botão de logout
    const logoutBtn = document.querySelector('a[href="#"].nav-link');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            AuthService.logout();
        });
    }
    
    // Exibir informações do usuário atual
    const showUserInfo = async () => {
        const user = await AuthService.getCurrentUser();
        if (user) {
            // Atualizar nome do usuário no header, se existir o elemento
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = user.nome;
            }
            
            // Exibir/ocultar elementos baseados no cargo
            const adminElements = document.querySelectorAll('.admin-only');
            adminElements.forEach(el => {
                el.style.display = user.cargo === 'admin' ? '' : 'none';
            });
        }
    };
    
    // Chamar apenas em páginas autenticadas
    if (AuthService.isAuthenticated() && !publicPages.includes(currentPath)) {
        showUserInfo();
    }
});

// Exportar para uso global
window.AuthService = AuthService;