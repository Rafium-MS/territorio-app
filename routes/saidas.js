// routes/saidas.js
const express = require('express');
const router = express.Router();
const SaidaCampo = require('../models/SaidaCampo');
const Designacao = require('../models/Designacao');
const { protect, authorize } = require('../middleware/auth');

// @rota    GET api/saidas
// @desc    Obter todas as saídas de campo
// @acesso  Público (posteriormente privado)
router.get('/', async (req, res) => {
  try {
    const saidasCampo = await SaidaCampo.find().sort({ diaSemana: 1, horario: 1 });
    res.json(saidasCampo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/saidas/proximas
// @desc    Obter as próximas saídas de campo
// @acesso  Público (posteriormente privado)
router.get('/proximas', async (req, res) => {
  try {
    const hoje = new Date();
    
    // Obter todas as saídas
    const saidasCampo = await SaidaCampo.find();
    
    // Filtrar e ordenar as próximas saídas
    const proximasSaidas = saidasCampo
      .map(saida => {
        // Calcular a próxima ocorrência da saída
        const proximaData = calcularProximaOcorrencia(saida.diaSemana, saida.horario);
        return {
          ...saida.toObject(),
          proximaData
        };
      })
      .filter(saida => saida.proximaData >= hoje)
      .sort((a, b) => a.proximaData - b.proximaData)
      .slice(0, 5); // Limitar a 5 próximas saídas
    
    res.json(proximasSaidas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/saidas/calendario/:mes/:ano
// @desc    Obter saídas de campo para um mês específico
// @acesso  Público (posteriormente privado)
router.get('/calendario/:mes/:ano', async (req, res) => {
  try {
    const mes = parseInt(req.params.mes);
    const ano = parseInt(req.params.ano);
    
    if (isNaN(mes) || isNaN(ano) || mes < 1 || mes > 12) {
      return res.status(400).json({ msg: 'Mês ou ano inválido' });
    }
    
    // Obter todas as saídas
    const saidasCampo = await SaidaCampo.find();
    
    // Calcular datas das saídas para o mês especificado
    const diasMes = new Date(ano, mes, 0).getDate(); // Último dia do mês
    const calendario = [];
    
    for (let dia = 1; dia <= diasMes; dia++) {
      const data = new Date(ano, mes - 1, dia);
      const diaSemana = obterNomeDiaSemana(data.getDay());
      
      // Filtar saídas para este dia da semana
      const saidasDoDia = saidasCampo.filter(saida => 
        saida.diaSemana === diaSemana
      ).map(saida => ({
        id: saida._id,
        nome: saida.nome,
        horario: saida.horario,
        dirigente: saida.dirigente
      }));
      
      if (saidasDoDia.length > 0) {
        calendario.push({
          data: data,
          dia,
          diaSemana,
          saidas: saidasDoDia
        });
      }
    }
    
    res.json(calendario);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/saidas/:id
// @desc    Obter saída de campo por ID
// @acesso  Público (posteriormente privado)
router.get('/:id', async (req, res) => {
  try {
    const saidaCampo = await SaidaCampo.findById(req.params.id);
    
    if (!saidaCampo) {
      return res.status(404).json({ msg: 'Saída de campo não encontrada' });
    }
    
    res.json(saidaCampo);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Saída de campo não encontrada' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/saidas/:id/designacoes
// @desc    Obter designações relacionadas a uma saída de campo
// @acesso  Público (posteriormente privado)
router.get('/:id/designacoes', async (req, res) => {
  try {
    const designacoes = await Designacao.find({ 
      saidaCampoId: req.params.id,
      status: 'ativo'
    })
      .populate('territorioId', 'nome descricao')
      .sort({ dataDesignacao: -1 });
    
    res.json(designacoes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    POST api/saidas
// @desc    Criar uma nova saída de campo
// @acesso  Público (posteriormente privado)
router.post('/', async (req, res) => {
  try {
    const { nome, data, diaSemana, horario, dirigente } = req.body;
    
    // Validações
    if (!nome || !diaSemana || !horario) {
      return res.status(400).json({ msg: 'Nome, dia da semana e horário são obrigatórios' });
    }
    
    // Verificar se já existe uma saída com o mesmo nome
    const saidaExistente = await SaidaCampo.findOne({ nome });
    if (saidaExistente) {
      return res.status(400).json({ msg: 'Já existe uma saída de campo com este nome' });
    }
    
    // Criar nova saída de campo
    const novaSaida = new SaidaCampo({
      nome,
      data: data || new Date(),
      diaSemana,
      horario,
      dirigente: dirigente || ''
    });
    
    const saidaCampo = await novaSaida.save();
    
    res.json(saidaCampo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    PUT api/saidas/:id
// @desc    Atualizar uma saída de campo
// @acesso  Público (posteriormente privado)
router.put('/:id', async (req, res) => {
  try {
    const { nome, data, diaSemana, horario, dirigente } = req.body;
    
    // Verificar se a saída existe
    let saidaCampo = await SaidaCampo.findById(req.params.id);
    
    if (!saidaCampo) {
      return res.status(404).json({ msg: 'Saída de campo não encontrada' });
    }
    
    // Verificar se o novo nome já existe (se estiver alterando o nome)
    if (nome && nome !== saidaCampo.nome) {
      const saidaExistente = await SaidaCampo.findOne({ nome });
      if (saidaExistente) {
        return res.status(400).json({ msg: 'Já existe uma saída de campo com este nome' });
      }
    }
    
    // Preparar dados para atualização
    const camposAtualizacao = {};
    if (nome) camposAtualizacao.nome = nome;
    if (data) camposAtualizacao.data = data;
    if (diaSemana) camposAtualizacao.diaSemana = diaSemana;
    if (horario) camposAtualizacao.horario = horario;
    if (dirigente !== undefined) camposAtualizacao.dirigente = dirigente;
    camposAtualizacao.updatedAt = Date.now();
    
    // Atualizar saída de campo
    saidaCampo = await SaidaCampo.findByIdAndUpdate(
      req.params.id,
      { $set: camposAtualizacao },
      { new: true }
    );
    
    res.json(saidaCampo);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Saída de campo não encontrada' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    DELETE api/saidas/:id
// @desc    Deletar uma saída de campo
// @acesso  Público (posteriormente privado com permissão de admin)
router.delete('/:id', async (req, res) => {
  try {
    // Verificar se a saída existe
    const saidaCampo = await SaidaCampo.findById(req.params.id);
    
    if (!saidaCampo) {
      return res.status(404).json({ msg: 'Saída de campo não encontrada' });
    }
    
    // Verificar se existem designações usando esta saída
    const designacoesAtivas = await Designacao.findOne({ 
      saidaCampoId: req.params.id,
      status: 'ativo'
    });
    
    if (designacoesAtivas) {
      return res.status(400).json({ 
        msg: 'Esta saída possui designações ativas. Conclua ou remova as designações antes de excluir a saída.'
      });
    }
    
    // Remover a saída
    await saidaCampo.remove();
    
    res.json({ msg: 'Saída de campo removida' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Saída de campo não encontrada' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// Função auxiliar para calcular a próxima ocorrência de um dia da semana
function calcularProximaOcorrencia(diaSemana, horario) {
  const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const diaIndex = diasSemana.indexOf(diaSemana);
  
  if (diaIndex === -1) return null;
  
  const hoje = new Date();
  const diaAtual = hoje.getDay();
  
  // Calcular quantos dias faltam para o próximo dia da semana
  let diasPara = diaIndex - diaAtual;
  if (diasPara <= 0) {
    // Se já passou ou é hoje, considerar a próxima semana
    diasPara += 7;
  }
  
  // Criar data para o próximo dia da semana
  const proximaData = new Date(hoje);
  proximaData.setDate(hoje.getDate() + diasPara);
  
  // Configurar horário
  const [horas, minutos] = horario.split(':').map(Number);
  proximaData.setHours(horas, minutos, 0, 0);
  
  // Se for hoje e o horário já passou, avançar uma semana
  if (diasPara === 0 && proximaData < hoje) {
    proximaData.setDate(proximaData.getDate() + 7);
  }
  
  return proximaData;
}

// Função auxiliar para obter o nome do dia da semana a partir do índice
function obterNomeDiaSemana(index) {
  const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return diasSemana[index];
}

module.exports = router;