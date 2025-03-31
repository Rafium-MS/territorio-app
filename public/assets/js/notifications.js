// assets/js/notifications.js

/**
 * Serviço de notificações para o Sistema de Territórios
 * Versão: 1.1.0
 */

const NotificationService = {
    /**
     * Mostra uma notificação
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo da notificação (success, danger, warning, info)
     * @param {number} duration - Duração em milissegundos
     */
    show(message, type = 'success', duration = 3000) {
        const container = document.getElementById('notification-container') || this.createContainer();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Verificar se o tipo tem um ícone associado
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle me-2"></i>';
                break;
            case 'danger':
                icon = '<i class="fas fa-exclamation-circle me-2"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle me-2"></i>';
                break;
            case 'info':
                icon = '<i class="fas fa-info-circle me-2"></i>';
                break;
        }
        
        notification.innerHTML = `
            <div class="notification-content">
                ${icon}${message}
            </div>
            <button type="button" class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Adicionar ao container
        container.appendChild(notification);
        
        // Adicionar evento de fechar
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide(notification);
            });
        }
        
        // Mostrar com animação
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Esconder automaticamente após a duração
        if (duration > 0) {
            this.autoHide(notification, duration);
        }
        
        return notification;
    },
    
    /**
     * Esconde uma notificação automaticamente
     * @param {HTMLElement} notification - Elemento da notificação
     * @param {number} duration - Duração em milissegundos
     */
    autoHide(notification, duration) {
        setTimeout(() => {
            this.hide(notification);
        }, duration);
    },
    
    /**
     * Esconde uma notificação
     * @param {HTMLElement} notification - Elemento da notificação
     */
    hide(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },
    
    /**
     * Cria o container para as notificações
     * @returns {HTMLElement} - Container das notificações
     */
    createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
        return container;
    },
    
    /**
     * Mostra uma notificação de sucesso
     * @param {string} message - Mensagem a ser exibida
     * @param {number} duration - Duração em milissegundos
     */
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    },
    
    /**
     * Mostra uma notificação de erro
     * @param {string} message - Mensagem a ser exibida
     * @param {number} duration - Duração em milissegundos
     */
    error(message, duration = 3000) {
        return this.show(message, 'danger', duration);
    },
    
    /**
     * Mostra uma notificação de alerta
     * @param {string} message - Mensagem a ser exibida
     * @param {number} duration - Duração em milissegundos
     */
    warning(message, duration = 3000) {
        return this.show(message, 'warning', duration);
    },
    
    /**
     * Mostra uma notificação informativa
     * @param {string} message - Mensagem a ser exibida
     * @param {number} duration - Duração em milissegundos
     */
    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    },
    
    /**
     * Mostra uma notificação com confirmação
     * @param {string} message - Mensagem a ser exibida
     * @param {Function} onConfirm - Função a ser executada ao confirmar
     * @param {Function} onCancel - Função a ser executada ao cancelar
     */
    confirm(message, onConfirm, onCancel) {
        const container = document.getElementById('notification-container') || this.createContainer();
        
        const notification = document.createElement('div');
        notification.className = 'notification notification-confirm';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-question-circle me-2"></i>${message}
            </div>
            <div class="notification-actions mt-2">
                <button type="button" class="btn btn-sm btn-danger me-2" id="btn-confirm">Confirmar</button>
                <button type="button" class="btn btn-sm btn-secondary" id="btn-cancel">Cancelar</button>
            </div>
        `;
        
        // Adicionar ao container
        container.appendChild(notification);
        
        // Adicionar eventos
        const btnConfirm = notification.querySelector('#btn-confirm');
        const btnCancel = notification.querySelector('#btn-cancel');
        
        if (btnConfirm) {
            btnConfirm.addEventListener('click', () => {
                if (typeof onConfirm === 'function') {
                    onConfirm();
                }
                this.hide(notification);
            });
        }
        
        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                if (typeof onCancel === 'function') {
                    onCancel();
                }
                this.hide(notification);
            });
        }
        
        // Mostrar com animação
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        return notification;
    }
};

// Adicionar estilos
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        #notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 350px;
        }
        
        .notification {
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transform: translateX(120%);
            transition: transform 0.3s ease-in-out;
            opacity: 0.95;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            flex: 1;
            padding-right: 10px;
        }
        
        .notification-close {
            background: transparent;
            border: none;
            color: inherit;
            font-size: 0.9rem;
            opacity: 0.7;
            cursor: pointer;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        .notification-success {
            background-color: #28a745;
            color: white;
        }
        
        .notification-danger {
            background-color: #dc3545;
            color: white;
        }
        
        .notification-warning {
            background-color: #ffc107;
            color: #212529;
        }
        
        .notification-info {
            background-color: #17a2b8;
            color: white;
        }
        
        .notification-confirm {
            background-color: #343a40;
            color: white;
        }
        
        /* Para tema escuro */
        [data-theme="dark"] .notification {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        /* Responsividade */
        @media (max-width: 576px) {
            #notification-container {
                width: 100%;
                max-width: none;
                top: auto;
                bottom: 0;
                right: 0;
                padding: 10px;
            }
            
            .notification {
                width: 100%;
                margin-bottom: 5px;
                transform: translateY(100%);
            }
            
            .notification.show {
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
});

// Expor para uso global
window.NotificationService = NotificationService;