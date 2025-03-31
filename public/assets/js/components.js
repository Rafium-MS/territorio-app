// assets/js/components.js

const Components = {
    createCard(title, content, type = 'default') {
        return `
            <div class="card mb-4">
                <div class="card-header ${type === 'default' ? 'bg-primary' : 'bg-' + type} text-white">
                    <h5 class="mb-0">${title}</h5>
                </div>
                <div class="card-body">
                    ${content}
                </div>
            </div>
        `;
    },
    
    createAlert(message, type = 'info') {
        return `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
            </div>
        `;
    },
    
    // Outros componentes...
};