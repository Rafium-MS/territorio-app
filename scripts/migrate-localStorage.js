// scripts/migrate-localStorage.js
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Modelos
const Territorio = require('../models/Territorio');
const SaidaCampo = require('../models/SaidaCampo');
const Designacao = require('../models/Designacao');
const Atendimento = require('../models/Atendimento');

// Função para ler os dados da pasta localStorage (simulada)
const lerDadosLocalStorage = () => {
  try {
    // Pasta onde estão os arquivos JSON simulando o localStorage
    const localStoragePath = path.join(__dirname, 'localStorage_data');
    
    // Verificar se a pasta existe
    if (!fs.existsSync(localStoragePath)) {
      console.log('Pasta localStorage_data não encontrada. Criando pasta...');
      fs.mkdirSync(localStoragePath, { recursive: true });
    }
    
    // Ler arquivos
    const dados = {};
    
    // Arquivos possíveis
    const arquivos = [
      { nome: 'territorios.json', chave: 'territorios' },
      { nome: 'saidasCampo.json', chave: 'saidasCampo' },
      { nome: 'designacoes.json', chave: 'designacoes' },
      { nome: 'atendimentos.json', chave: 'atendimentos' }
    ];
    
    arquivos.forEach(arquivo => {
      const arquivoPath = path.join(localStoragePath, arquivo.nome);
      
      if (fs.existsSync(arquivoPath)) {
        const conteudo = fs.readFileSync(arquivoPath, 'utf8');
        dados[arquivo.chave] = JSON.parse(conteudo);
        console.log(`Arquivo ${arquivo.nome} carregado com sucesso.`);
      } else {
        console.log(`Arquivo ${arquivo.nome} não encontrado.`);
        dados[arquivo.chave] = [];
      }
    });
    
    return dados;
  } catch (error) {
    console.error('Erro ao ler dados do localStorage:', error);
    return {
      territorios: [],
      saidasCampo: [],
      designacoes: [],
      atendimentos: {}
    };
  }
};

// Função para extrair dados do localStorage real da aplicação
// Nota: Esta função deve ser usada no browser para gerar os arquivos JSON
const extrairDadosDoNavegador = () => {
  console.log(`
  // Cole este código no console do navegador enquanto está usando a aplicação:
  
  const dados = {
    territorios: JSON.parse(localStorage.getItem('territorios') || '[]'),
    saidasCampo: JSON.parse(localStorage.getItem('saidasCampo') || '[]'),
    designacoes: JSON.parse(localStorage.getItem('designacoes') || '[]'),
    atendimentos: JSON.parse(localStorage.getItem('atendimentos') || '{}')
  };
  
  // Converter dados para JSON e exibir
  const dadosJSON = JSON.stringify(dados, null, 2);
  console.log(dadosJSON);
  
  // Opcional: fazer download dos dados
  const blob = new Blob([dadosJSON], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'localStorage_dados.json';
  a.click();
  `);
};

// Migrar territórios
const migrarTerritorios = async (territorios) => {
  try {
    console.log(`Migrando ${territorios.length} territórios...`);
    
    for (const territorio of territorios) {
      // Converter os IDs conforme necessário
      const territorioMongoDB = {
        nome: territorio.nome,
        descricao: territorio.descricao || '',
        ruas: territorio.ruas || []
      };
      
      // Criar território no MongoDB
      await Territorio.create(territorioMongoDB);
    }
    
    console.log('Migração de territórios concluída!');
  } catch (error) {
    console.error('Erro ao migrar territórios:', error);
  }
};

// Migrar saídas de campo
const migrarSaidasCampo = async (saidasCampo) => {
  try {
    console.log(`Migrando ${saidasCampo.length} saídas de campo...`);
    
    for (const saida of saidasCampo) {
      // Converter formato de data se necessário
      const data = new Date(saida.data);
      
      const saidaMongoDB = {
        nome: saida.nome,
        data: data,
        diaSemana: saida.diaSemana,
        horario: saida.horario,
        dirigente: saida.dirigente || ''
      };
      
      // Criar saída no MongoDB
      await SaidaCampo.create(saidaMongoDB);
    }
    
    console.log('Migração de saídas de campo concluída!');
  } catch (error) {
    console.error('Erro ao migrar saídas de campo:', error);
  }
};

// Migrar designações
const migrarDesignacoes = async (designacoes) => {
  try {
    console.log(`Migrando ${designacoes.length} designações...`);
    
    // Obter todos os territórios e saídas de campo para fazer o mapeamento de IDs
    const territorios = await Territorio.find();
    const saidasCampo = await SaidaCampo.find();
    
    // Criar mapeamento de IDs antigos para novos
    const mapTerritorios = {};
    territorios.forEach((territorio, index) => {
      mapTerritorios[`territorio-${index + 1}`] = territorio._id;
    });
    
    const mapSaidas = {};
    saidasCampo.forEach((saida, index) => {
      mapSaidas[`saida-${index + 1}`] = saida._id;
    });
    
    for (const designacao of designacoes) {
      // Mapear IDs antigos para novos
      const territorioId = mapTerritorios[designacao.territorioId] || territorios[0]._id;
      const saidaCampoId = mapSaidas[designacao.saidaCampoId] || saidasCampo[0]._id;
      
      const designacaoMongoDB = {
        territorioId: territorioId,
        saidaCampoId: saidaCampoId,
        responsavel: designacao.responsavel,
        dataDesignacao: new Date(designacao.dataDesignacao),
        dataDevolucao: new Date(designacao.dataDevolucao),
        dataConclusao: designacao.dataConclusao ? new Date(designacao.dataConclusao) : undefined,
        status: designacao.status,
        resultado: designacao.resultado || '',
        observacoes: designacao.observacoes || ''
      };
      
      // Criar designação no MongoDB
      await Designacao.create(designacaoMongoDB);
    }
    
    console.log('Migração de designações concluída!');
  } catch (error) {
    console.error('Erro ao migrar designações:', error);
  }
};

// Migrar atendimentos
const migrarAtendimentos = async (atendimentos) => {
  try {
    console.log('Migrando atendimentos...');
    
    // Obter todos os territórios para fazer o mapeamento de IDs
    const territorios = await Territorio.find();
    
    // Criar mapeamento de IDs de territórios
    const mapTerritorios = {};
    territorios.forEach((territorio, index) => {
      mapTerritorios[`territorio-${index + 1}`] = territorio._id;
    });
    
    // Atendimentos no localStorage são um objeto com chave = imovelId
    for (const [imovelId, atendimento] of Object.entries(atendimentos)) {
      // Encontrar o território e rua que contém este imóvel
      let territorioId, ruaId;
      
      // Procurar em todos os territórios
      for (const territorio of territorios) {
        for (const rua of territorio.ruas) {
          const imovelEncontrado = rua.imoveis.find(
            imovel => imovel._id.toString() === imovelId || 
                     imovel.id === imovelId
          );
          
          if (imovelEncontrado) {
            territorioId = territorio._id;
            ruaId = rua._id;
            break;
          }
        }
        if (territorioId) break;
      }
      
      // Se não encontrou, pular este atendimento
      if (!territorioId || !ruaId) {
        console.log(`Imóvel ${imovelId} não encontrado, pulando atendimento...`);
        continue;
      }
      
      const atendimentoMongoDB = {
        imovelId: imovelId,
        ruaId: ruaId.toString(),
        territorioId: territorioId,
        data: new Date(atendimento.data),
        resultado: atendimento.resultado || 'outro',
        observacoes: atendimento.observacoes || '',
        responsavel: atendimento.responsavel || 'Sistema'
      };
      
      // Criar atendimento no MongoDB
      await Atendimento.create(atendimentoMongoDB);
    }
    
    console.log('Migração de atendimentos concluída!');
  } catch (error) {
    console.error('Erro ao migrar atendimentos:', error);
  }
};

// Função principal de migração
const migrar = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Conectado ao MongoDB...');
    
    // Perguntar se deseja limpar o banco de dados antes
    const limparAntes = process.argv.includes('--limpar');
    
    if (limparAntes) {
      console.log('Limpando banco de dados...');
      await Territorio.deleteMany({});
      await SaidaCampo.deleteMany({});
      await Designacao.deleteMany({});
      await Atendimento.deleteMany({});
      console.log('Banco de dados limpo!');
    }
    
    // Imprimir instruções sobre como extrair dados do localStorage
    extrairDadosDoNavegador();
    
    // Ler dados do localStorage
    const dados = lerDadosLocalStorage();
    
    // Migrar dados
    if (dados.territorios.length > 0) {
      await migrarTerritorios(dados.territorios);
    }
    
    if (dados.saidasCampo.length > 0) {
      await migrarSaidasCampo(dados.saidasCampo);
    }
    
    if (dados.designacoes.length > 0) {
      await migrarDesignacoes(dados.designacoes);
    }
    
    if (Object.keys(dados.atendimentos).length > 0) {
      await migrarAtendimentos(dados.atendimentos);
    }
    
    console.log('Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
};

// Executar migração
migrar();