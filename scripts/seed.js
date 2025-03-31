// scripts/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Modelos
const User = require('../models/User');
const Territorio = require('../models/Territorio');
const SaidaCampo = require('../models/SaidaCampo');
const Designacao = require('../models/Designacao');
const Atendimento = require('../models/Atendimento');

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Dados de exemplo
const usuarios = [
  {
    nome: 'Administrador',
    email: 'admin@exemplo.com',
    senha: 'senha123',
    cargo: 'admin'
  },
  {
    nome: 'Usuário Regular',
    email: 'usuario@exemplo.com',
    senha: 'senha123',
    cargo: 'usuario'
  }
];

const saidasCampo = [
  {
    nome: 'Saída 1',
    data: new Date('2025-03-25'),
    diaSemana: 'Terça-feira',
    horario: '09:00',
    dirigente: 'João Silva'
  },
  {
    nome: 'Saída 2',
    data: new Date('2025-03-26'),
    diaSemana: 'Quarta-feira',
    horario: '19:30',
    dirigente: 'Maria Oliveira'
  },
  {
    nome: 'Saída 3',
    data: new Date('2025-03-28'),
    diaSemana: 'Sexta-feira',
    horario: '14:00',
    dirigente: 'Carlos Santos'
  }
];

// Limpar banco de dados
const limparBancoDados = async () => {
  try {
    await User.deleteMany({});
    await Territorio.deleteMany({});
    await SaidaCampo.deleteMany({});
    await Designacao.deleteMany({});
    await Atendimento.deleteMany({});
    
    console.log('Banco de dados limpo');
  } catch (error) {
    console.error('Erro ao limpar banco de dados:', error);
    process.exit(1);
  }
};

// Criar usuários
const criarUsuarios = async () => {
  try {
    const usuariosCriados = [];
    
    for (const usuario of usuarios) {
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(usuario.senha, salt);
      
      const novoUsuario = await User.create({
        nome: usuario.nome,
        email: usuario.email,
        senha: senhaHash,
        cargo: usuario.cargo
      });
      
      usuariosCriados.push(novoUsuario);
    }
    
    console.log(`${usuariosCriados.length} usuários criados`);
    return usuariosCriados;
  } catch (error) {
    console.error('Erro ao criar usuários:', error);
    process.exit(1);
  }
};

// Criar saídas de campo
const criarSaidasCampo = async () => {
  try {
    const saidasCriadas = await SaidaCampo.insertMany(saidasCampo);
    console.log(`${saidasCriadas.length} saídas de campo criadas`);
    return saidasCriadas;
  } catch (error) {
    console.error('Erro ao criar saídas de campo:', error);
    process.exit(1);
  }
};

// Criar territórios
const criarTerritorios = async () => {
  try {
    // Ler dados de territórios do localStorage (se disponível)
    let territoriosData = [];
    const localStoragePath = path.join(__dirname, 'localStorage_territorios.json');
    
    if (fs.existsSync(localStoragePath)) {
      const data = fs.readFileSync(localStoragePath, 'utf8');
      territoriosData = JSON.parse(data);
    } else {
      // Dados de exemplo
      territoriosData = [
        {
          nome: 'Território 1 - Centro',
          descricao: 'Região central da cidade',
          ruas: [
            {
              nome: 'Rua das Flores',
              imoveis: [
                { numero: '123', tipo: 'residencial' },
                { numero: '125', tipo: 'comercial' },
                { numero: '127', tipo: 'residencial' }
              ]
            },
            {
              nome: 'Avenida Principal',
              imoveis: [
                { numero: '200', tipo: 'comercial' },
                { numero: '202', tipo: 'comercial' }
              ]
            }
          ]
        },
        {
          nome: 'Território 2 - Norte',
          descricao: 'Região norte da cidade',
          ruas: [
            {
              nome: 'Rua dos Ipês',
              imoveis: [
                { numero: '45', tipo: 'residencial' },
                { numero: '47', tipo: 'residencial' }
              ]
            }
          ]
        },
        {
          nome: 'Território 3 - Sul',
          descricao: 'Região sul da cidade',
          ruas: [
            {
              nome: 'Rua das Palmeiras',
              imoveis: [
                { numero: '10', tipo: 'residencial' },
                { numero: '12', tipo: 'residencial' }
              ]
            }
          ]
        }
      ];
    }
    
    const territoriosCriados = [];
    
    for (const territorioData of territoriosData) {
      const novoTerritorio = await Territorio.create(territorioData);
      territoriosCriados.push(novoTerritorio);
    }
    
    console.log(`${territoriosCriados.length} territórios criados`);
    return territoriosCriados;
  } catch (error) {
    console.error('Erro ao criar territórios:', error);
    process.exit(1);
  }
};

// Criar designações
const criarDesignacoes = async (territorios, saidas) => {
  try {
    // Criar datas
    const hoje = new Date();
    
    const dataDesignacao1 = new Date();
    dataDesignacao1.setDate(hoje.getDate() - 30);
    
    const dataDesignacao2 = new Date();
    dataDesignacao2.setDate(hoje.getDate() - 15);
    
    const dataDesignacao3 = new Date(hoje);
    
    const dataDevolucao1 = new Date(dataDesignacao1);
    dataDevolucao1.setDate(dataDesignacao1.getDate() + 30);
    
    const dataDevolucao2 = new Date(dataDesignacao2);
    dataDevolucao2.setDate(dataDesignacao2.getDate() + 30);
    
    const dataDevolucao3 = new Date(dataDesignacao3);
    dataDevolucao3.setDate(dataDesignacao3.getDate() + 30);
    
    const designacoesData = [
      {
        territorioId: territorios[0]._id,
        saidaCampoId: saidas[0]._id,
        responsavel: 'João Silva',
        dataDesignacao: dataDesignacao1,
        dataDevolucao: dataDevolucao1,
        status: 'concluido',
        dataConclusao: dataDevolucao1,
        resultado: 'completo',
        observacoes: 'Concluído com sucesso'
      },
      {
        territorioId: territorios[1]._id,
        saidaCampoId: saidas[1]._id,
        responsavel: 'Maria Oliveira',
        dataDesignacao: dataDesignacao2,
        dataDevolucao: dataDevolucao2,
        status: 'ativo',
        observacoes: 'Priorizando residenciais'
      },
      {
        territorioId: territorios[2]._id,
        saidaCampoId: saidas[2]._id,
        responsavel: 'Carlos Santos',
        dataDesignacao: dataDesignacao3,
        dataDevolucao: dataDevolucao3,
        status: 'ativo',
        observacoes: 'Território do dia'
      }
    ];
    
    const designacoesCriadas = await Designacao.insertMany(designacoesData);
    console.log(`${designacoesCriadas.length} designações criadas`);
    
    return designacoesCriadas;
  } catch (error) {
    console.error('Erro ao criar designações:', error);
    process.exit(1);
  }
};

// Criar atendimentos
const criarAtendimentos = async (territorios) => {
  try {
    const atendimentosData = [];
    
    // Para cada território
    for (const territorio of territorios) {
      // Para algumas ruas e imóveis aleatórios
      for (const rua of territorio.ruas) {
        for (const imovel of rua.imoveis) {
          // Criar atendimentos para 50% dos imóveis
          if (Math.random() > 0.5) {
            const dataAtendimento = new Date();
            dataAtendimento.setDate(dataAtendimento.getDate() - Math.floor(Math.random() * 30));
            
            const resultados = ['positivo', 'ausente', 'recusado', 'outro'];
            const resultado = resultados[Math.floor(Math.random() * resultados.length)];
            
            atendimentosData.push({
              imovelId: imovel._id.toString(),
              ruaId: rua._id.toString(),
              territorioId: territorio._id,
              data: dataAtendimento,
              resultado: resultado,
              observacoes: `Atendimento registrado em ${dataAtendimento.toLocaleDateString()}`,
              responsavel: 'Usuário de Teste'
            });
          }
        }
      }
    }
    
    const atendimentosCriados = await Atendimento.insertMany(atendimentosData);
    console.log(`${atendimentosCriados.length} atendimentos criados`);
    
    return atendimentosCriados;
  } catch (error) {
    console.error('Erro ao criar atendimentos:', error);
    process.exit(1);
  }
};

// Executar seed
const seed = async () => {
  try {
    await limparBancoDados();
    
    const usuarios = await criarUsuarios();
    const saidas = await criarSaidasCampo();
    const territorios = await criarTerritorios();
    const designacoes = await criarDesignacoes(territorios, saidas);
    const atendimentos = await criarAtendimentos(territorios);
    
    console.log('Seed concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante o seed:', error);
    process.exit(1);
  }
};

// Executar
seed();