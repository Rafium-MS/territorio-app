# Sistema de Gerenciamento de Territórios

Uma aplicação web moderna para gerenciar territórios, controlar atividades de campo, designações e estatísticas de atendimento.

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/version-1.0.0-blue)
![Licença](https://img.shields.io/badge/license-MIT-green)

## 📋 Visão Geral

O Sistema de Gerenciamento de Territórios é uma ferramenta completa para gestão territorial, facilitando o controle de atividades de campo, designações e monitoramento de progresso. Ideal para organizações que necessitam coordenar trabalho em diferentes áreas geográficas.

## ✨ Recursos

- **Dashboard Interativo**: Visualização rápida de estatísticas e informações relevantes
- **Gestão de Territórios**: Cadastro e gerenciamento completo de territórios e suas subdivisões
- **Controle de Saídas**: Agendamento e gestão de saídas de campo
- **Sistema de Designação**: Atribuição de territórios a responsáveis com datas e prazos
- **Território do Dia**: Visualização rápida do território designado para a data atual
- **Controle de Atendimentos**: Registro detalhado de atendimentos por tipo de imóvel:
  - Residenciais
  - Comerciais
  - Prédios
  - Vilas
- **Relatórios e Estatísticas**: Geração de relatórios personalizados e exportação de dados

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Bootstrap 5 para layout responsivo
  - Chart.js para visualização de dados e gráficos
  - Moment.js para manipulação de datas
  - FontAwesome para ícones

- **Backend**:
  - Node.js
  - Express.js para servidor web
  - LocalStorage (versão atual) para persistência de dados

## 🔧 Requisitos de Sistema

- Node.js (v14 ou superior)
- NPM (v6 ou superior)
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## 📦 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Rafio-silverio/territorio-app.git
   cd territorio-app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação em:
   ```
   http://localhost:3000
   ```

## 📂 Estrutura do Projeto

```
territorio-app/
├── public/                # Arquivos públicos
│   ├── assets/            # Recursos compartilhados
│   │   ├── css/           # Arquivos CSS globais
│   │   │   ├── main.css           # Estilos globais
│   │   │   ├── dashboard.css      # Estilos do dashboard
│   │   │   └── forms.css          # Estilos de formulários
│   │   ├── js/            # JavaScript comum
│   │   │   ├── common.js          # Utilitários comuns
│   │   │   ├── data.js            # Manipulação de dados
│   │   │   ├── components.js      # Componentes reutilizáveis
│   │   │   ├── charts.js          # Configuração de gráficos
│   │   │   └── notifications.js   # Sistema de notificações
│   │   └── img/           # Imagens
│   ├── modules/           # Módulos da aplicação
│   │   ├── territorios/   # Módulo de territórios
│   │   │   ├── css/       # CSS específico
│   │   │   ├── js/        # JavaScript específico
│   │   │   └── *.html     # Páginas HTML
│   │   ├── saidas/        # Módulo de saídas de campo
│   │   ├── designacoes/   # Módulo de designações
│   │   └── predios-vilas/ # Módulo de prédios e vilas
│   ├── components/        # Componentes reutilizáveis
│   │   ├── header.html    # Cabeçalho padrão
│   │   ├── footer.html    # Rodapé padrão
│   │   └── sidebar.html   # Barra lateral de navegação
│   └── index.html         # Página inicial (Dashboard)
├── server.js              # Servidor Express
├── package.json           # Dependências e scripts
└── README.md              # Este arquivo
```

## 🚀 Scripts Disponíveis

- `npm start` - Inicia o servidor de produção
- `npm run dev` - Inicia o servidor de desenvolvimento com recarregamento automático
- `npm run build` - Compila os assets para produção
- `npm test` - Executa testes
- `npm run lint` - Verifica o código com ESLint

## 🖥️ Páginas Principais

- **Dashboard**: Visão geral com estatísticas e informações relevantes
- **Cadastro de Territórios**: Gerenciamento de territórios e suas subdivisões
- **Saídas de Campo**: Controle de saídas programadas
- **Designação**: Sistema de atribuição de territórios
- **Território do Dia**: Visualização do território designado para hoje
- **Visualização de Territórios**: Visualização detalhada com controle de atendimentos
- **Cadastro de Prédios e Vilas**: Gerenciamento de imóveis específicos
- **Relatórios**: Geração de relatórios e exportação de dados

## 🔄 Roadmap

### Em desenvolvimento:
- Visualização de Territórios
  - Mapa visual do território com Leaflet
  - Filtros avançados
  - Sistema aprimorado de registro de atendimentos

- Território do Dia
  - Interface moderna com indicadores visuais
  - Sistema de lembretes

- Designação de Territórios
  - Calendário visual para designações
  - Sistema de notificações

- Dashboard
  - Gráficos dinâmicos
  - Widgets configuráveis

### Próximas funcionalidades:
- Sistema de autenticação de usuários
- Banco de dados remoto para sincronização
- Aplicativo móvel para uso em campo
- Integração com mapas e geolocalização
- Importação/exportação de dados em vários formatos

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

Rafael Silvério Santos - [silveriorafaelsantos@gmail.com](mailto:silveriorafaelsantos@gmail.com)

Link do Projeto: [https://github.com/Rafio-silverio/territorio-app](https://github.com/Rafio-silverio/territorio-app)

---

⭐️ De [Rafio-silver](https://github.com/Rafio-silver)
