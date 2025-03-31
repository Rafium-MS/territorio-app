# Sistema de Gerenciamento de Territórios

Uma aplicação web para gerenciar territórios, controlar atividades de campo, designações e estatísticas de atendimento.

## Recursos

- Dashboard com estatísticas de atendimentos
- Cadastro e gerenciamento de territórios
- Controle de saídas de campo
- Sistema de designação de territórios
- Visualização do território do dia
- Controle de atendimentos (residenciais, comerciais, prédios e vilas)
- Relatórios e exportação de dados

## Tecnologias Utilizadas

- HTML5, CSS3, JavaScript
- Bootstrap 5
- Chart.js para visualização de dados
- Express.js para o servidor
- LocalStorage para persistência de dados no cliente

## Requisitos de Sistema

- Node.js (v14 ou superior)
- NPM (v6 ou superior)
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/territorio-app.git
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

## Estrutura do Projeto

```
territorio-app/
├── public/                # Arquivos públicos
│   ├── assets/            # Recursos (CSS, JS, imagens)
│   │   ├── css/           # Arquivos CSS
│   │   ├── js/            # JavaScript comum
│   │   └── img/           # Imagens
│   ├── modules/           # Módulos da aplicação
│   │   └── territorios/   # Módulo de territórios
│   │       ├── css/       # CSS específico do módulo
│   │       ├── js/        # JavaScript específico do módulo
│   │       └── *.html     # Páginas HTML do módulo
│   ├── components/        # Componentes reutilizáveis
│   └── index.html         # Página inicial (Dashboard)
├── server.js              # Servidor Express
├── package.json           # Dependências e scripts
└── README.md              # Este arquivo
```

## Scripts Disponíveis

- `npm start` - Inicia o servidor de produção
- `npm run dev` - Inicia o servidor de desenvolvimento com recarregamento automático
- `npm run build` - Compila os assets para produção
- `npm test` - Executa testes
- `npm run lint` - Verifica o código com ESLint

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Seu Nome - [seu-email@exemplo.com](mailto:seu-email@exemplo.com)

Link do Projeto: [https://github.com/seu-usuario/territorio-app](https://github.com/seu-usuario/territorio-app)