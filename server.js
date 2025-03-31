const express = require('express');
const path = require('path');
const connectDB = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao banco de dados
connectDB();

// Middleware para parsing de JSON e urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Importar rotas (a serem criadas)
const territorioRoutes = require('./routes/territorios');
const designacaoRoutes = require('./routes/designacoes');
const saidaCampoRoutes = require('./routes/saidas');
const atendimentoRoutes = require('./routes/atendimentos');

// Usar rotas
app.use('/api/territorios', territorioRoutes);
app.use('/api/designacoes', designacaoRoutes);
app.use('/api/saidas', saidaCampoRoutes);
app.use('/api/atendimentos', atendimentoRoutes);

// Rota principal (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT}`);
});