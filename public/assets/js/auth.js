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
            
            const response = await fetch('/api/auth/me', {
                headers: {
                    'x-auth-token': this.getToken()
                }
            });
            
            if (!response.ok) {
                throw new Error('Não foi possível obter os dados do usuário');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter usuário:', error);
            return null;
        }
    },
    
    // Login
    async login(email, senha) {
        try {
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
            
            return true;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    },
    
    // Registro
    async register(nome, email, senha) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, email, senha })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.msg || 'Erro ao registrar usuário');
            }
            
            // Armazenar token
            localStorage.setItem('token', data.token);
            
            return true;
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    },
    
    // Logout
    logout() {
        localStorage.removeItem('token');
        // Redirecionar para a página de login
        window.location.href = '/login.html';
    },
    
    // Verificar permissão
    async hasPermission(role) {
        const user = await this.getCurrentUser();
        return user && user.cargo === role;
    }
};

// Verificar autenticação em páginas restritas
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se a página atual requer autenticação
    const publicPages = ['/login.html', '/register.html'];
    const currentPath = window.location.pathname;
    
    if (!publicPages.includes(currentPath) && !AuthService.isAuthenticated()) {
        // Redirecionar para página de login
        window.location.href = '/login.html';
        return;
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
            // Aqui você pode atualizar a UI com informações do usuário
            console.log('Usuário logado:', user.nome);
        }
    };
    
    // Chamar apenas em páginas autenticadas
    if (AuthService.isAuthenticated()) {
        showUserInfo();
    }
});

// Exportar para uso global
window.AuthService = AuthService;