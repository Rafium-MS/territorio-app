// routes/atendimentos.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Atendimento = require('../models/Atendimento');
const Territorio = require('../models/Territorio');
const Designacao = require('../models/Designacao');
const { protect, authorize } = require('../middleware/auth');

// @rota    GET api/atendimentos
// @desc    Obter todos os atendimentos
// @acesso  Público (posteriormente privado)
router.get('/', async (req, res) => {
  try {
    // Permitir filtragem por território, rua, data, etc.
    const { 
      territorioId, 
      ruaId, 
      dataInicio, 
      dataFim, 
      resultado,
      responsavel 
    } = req.query;
    
    // Construir filtro
    const filtro = {};
    if (territorioId) filtro.territorioId = territorioId;
    if (ruaId) filtro.ruaId = ruaId;
    if (responsavel) filtro.responsavel = { $regex: responsavel, $options: 'i' };
    if (resultado) filtro.resultado = resultado;
    
    // Filtro de data
    if (dataInicio || dataFim) {
      filtro.data = {};
      if (dataInicio) filtro.data.$gte = new Date(dataInicio);
      if (dataFim) filtro.data.$lte = new Date(dataFim);
    }
    
    const atendimentos = await Atendimento.find(filtro)
      .sort({ data: -1 });
    
    res.json(atendimentos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/atendimentos/imovel/:imovelId
// @desc    Obter atendimento de um imóvel específico
// @acesso  Público (posteriormente privado)
router.get('/imovel/:imovelId', async (req, res) => {
  try {
    const atendimento = await Atendimento.findOne({ 
      imovelId: req.params.imovelId 
    }).sort({ data: -1 });
    
    if (!atendimento) {
      return res.status(404).json({ msg: 'Atendimento não encontrado' });
    }
    
    res.json(atendimento);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/atendimentos/territorio/:territorioId
// @desc    Obter todos os atendimentos de um território
// @acesso  Público (posteriormente privado)
router.get('/territorio/:territorioId', async (req, res) => {
  try {
    // Verificar se o território existe
    const territorio = await Territorio.findById(req.params.territorioId);
    if (!territorio) {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    // Buscar todos os atendimentos do território
    const atendimentos = await Atendimento.find({ 
      territorioId: req.params.territorioId 
    }).sort({ data: -1 });
    
    res.json(atendimentos);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/atendimentos/estatisticas/:territorioId
// @desc    Obter estatísticas de atendimentos de um território
// @acesso  Público (posteriormente privado)
router.get('/estatisticas/:territorioId', async (req, res) => {
  try {
    // Verificar se o território existe
    const territorio = await Territorio.findById(req.params.territorioId);
    if (!territorio) {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    // Contagens gerais
    const totalAtendimentos = await Atendimento.countDocuments({ 
      territorioId: req.params.territorioId 
    });
    
    // Contagem por resultado
    const atendimentosPorResultado = await Atendimento.aggregate([
      { $match: { territorioId: mongoose.Types.ObjectId(req.params.territorioId) } },
      { $group: { _id: '$resultado', count: { $sum: 1 } } }
    ]);
    
    // Atendimentos por rua
    const atendimentosPorRua = await Atendimento.aggregate([
      { $match: { territorioId: mongoose.Types.ObjectId(req.params.territorioId) } },
      { $group: { _id: '$ruaId', count: { $sum: 1 } } }
    ]);
    
    // Calcular total de imóveis no território
    let totalImoveis = 0;
    let imoveisAtendidos = 0;
    
    // Para cada rua, contar imóveis e verificar atendimentos
    for (const rua of territorio.ruas) {
      // Contar imóveis na rua
      const imoveisRua = rua.imoveis ? rua.imoveis.length : 0;
      totalImoveis += imoveisRua;
      
      // Contar imóveis atendidos
      const imoveisAtendidosNaRua = await Atendimento.countDocuments({
        territorioId: req.params.territorioId,
        ruaId: rua._id.toString()
      });
      
      imoveisAtendidos += imoveisAtendidosNaRua;
    }
    
    // Calcular porcentagem
    const porcentagemAtendida = totalImoveis > 0 ? 
      (imoveisAtendidos / totalImoveis) * 100 : 0;
    
    res.json({
      totalAtendimentos,
      totalImoveis,
      imoveisAtendidos,
      porcentagemAtendida: porcentagemAtendida.toFixed(2),
      atendimentosPorResultado,
      atendimentosPorRua
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/atendimentos/dashboard
// @desc    Obter estatísticas para o dashboard
// @acesso  Público (posteriormente privado)
router.get('/dashboard/estatisticas', async (req, res) => {
  try {
    // Total de atendimentos
    const totalAtendimentos = await Atendimento.countDocuments();
    
    // Atendimentos por resultado
    const atendimentosPorResultado = await Atendimento.aggregate([
      { $group: { _id: '$resultado', count: { $sum: 1 } } }
    ]);
    
    // Atendimentos por dia (últimos 30 dias)
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);
    
    const atendimentosPorDia = await Atendimento.aggregate([
      { $match: { data: { $gte: dataLimite } } },
      { $group: { 
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$data' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Formatar os dados para gráficos
    const dadosGrafico = {
      labels: atendimentosPorDia.map(item => item._id),
      datasets: [
        {
          label: 'Atendimentos por Dia',
          data: atendimentosPorDia.map(item => item.count)
        }
      ]
    };
    
    res.json({
      totalAtendimentos,
      atendimentosPorResultado,
      dadosGrafico
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    POST api/atendimentos
// @desc    Registrar um novo atendimento
// @acesso  Público (posteriormente privado)
router.post('/', async (req, res) => {
  try {
    const { 
      imovelId, 
      ruaId, 
      territorioId, 
      data, 
      resultado, 
      observacoes,
      responsavel 
    } = req.body;
    
    // Validações básicas
    if (!imovelId || !ruaId || !territorioId || !data || !resultado) {
      return res.status(400).json({ msg: 'Por favor, preencha todos os campos obrigatórios' });
    }
    
    // Verificar se o território existe
    const territorio = await Territorio.findById(territorioId);
    if (!territorio) {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    // Verificar se a rua pertence ao território
    const ruaEncontrada = territorio.ruas.id(ruaId);
    if (!ruaEncontrada) {
      return res.status(404).json({ msg: 'Rua não encontrada neste território' });
    }
    
    // Verificar se o imóvel existe na rua
    const imovelEncontrado = ruaEncontrada.imoveis.find(
      imovel => imovel._id.toString() === imovelId || imovel.id === imovelId
    );
    
    if (!imovelEncontrado) {
      return res.status(404).json({ msg: 'Imóvel não encontrado nesta rua' });
    }
    
    // Criar novo atendimento
    const novoAtendimento = new Atendimento({
      imovelId,
      ruaId,
      territorioId,
      data,
      resultado,
      observacoes: observacoes || '',
      responsavel: responsavel || 'Sistema'
    });
    
    const atendimento = await novoAtendimento.save();
    
    res.json(atendimento);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    PUT api/atendimentos/:id
// @desc    Atualizar um atendimento
// @acesso  Público (posteriormente privado)
router.put('/:id', async (req, res) => {
  try {
    const { 
      data, 
      resultado, 
      observacoes,
      responsavel 
    } = req.body;
    
    // Verificar se o atendimento existe
    let atendimento = await Atendimento.findById(req.params.id);
    
    if (!atendimento) {
      return res.status(404).json({ msg: 'Atendimento não encontrado' });
    }
    
    // Preparar campos para atualização
    const camposAtualizacao = {};
    if (data) camposAtualizacao.data = data;
    if (resultado) camposAtualizacao.resultado = resultado;
    if (observacoes !== undefined) camposAtualizacao.observacoes = observacoes;
    if (responsavel) camposAtualizacao.responsavel = responsavel;
    camposAtualizacao.updatedAt = Date.now();
    
    // Atualizar atendimento
    atendimento = await Atendimento.findByIdAndUpdate(
      req.params.id,
      { $set: camposAtualizacao },
      { new: true }
    );
    
    res.json(atendimento);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Atendimento não encontrado' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    DELETE api/atendimentos/:id
// @desc    Remover um atendimento
// @acesso  Público (posteriormente privado)
router.delete('/:id', async (req, res) => {
  try {
    // Verificar se o atendimento existe
    const atendimento = await Atendimento.findById(req.params.id);
    
    if (!atendimento) {
      return res.status(404).json({ msg: 'Atendimento não encontrado' });
    }
    
    // Remover atendimento
    await atendimento.remove();
    
    res.json({ msg: 'Atendimento removido' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Atendimento não encontrado' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    POST api/atendimentos/batch
// @desc    Registrar múltiplos atendimentos em lote
// @acesso  Público (posteriormente privado)
router.post('/batch', async (req, res) => {
  try {
    const { atendimentos, territorioId } = req.body;
    
    if (!atendimentos || !Array.isArray(atendimentos) || atendimentos.length === 0) {
      return res.status(400).json({ msg: 'Nenhum atendimento fornecido' });
    }
    
    // Verificar se o território existe
    const territorio = await Territorio.findById(territorioId);
    if (!territorio) {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    // Array para armazenar atendimentos validados
    const atendimentosValidados = [];
    const erros = [];
    
    // Validar cada atendimento
    for (let i = 0; i < atendimentos.length; i++) {
      const atendimento = atendimentos[i];
      
      // Verificar campos obrigatórios
      if (!atendimento.imovelId || !atendimento.ruaId || !atendimento.resultado) {
        erros.push({
          index: i,
          erro: 'Campos obrigatórios faltando',
          atendimento
        });
        continue;
      }
      
      // Verificar se a rua pertence ao território
      const ruaEncontrada = territorio.ruas.id(atendimento.ruaId);
      if (!ruaEncontrada) {
        erros.push({
          index: i,
          erro: 'Rua não encontrada neste território',
          atendimento
        });
        continue;
      }
      
      // Verificar se o imóvel existe na rua
      const imovelEncontrado = ruaEncontrada.imoveis.find(
        imovel => imovel._id.toString() === atendimento.imovelId || imovel.id === atendimento.imovelId
      );
      
      if (!imovelEncontrado) {
        erros.push({
          index: i,
          erro: 'Imóvel não encontrado nesta rua',
          atendimento
        });
        continue;
      }
      
      // Adicionar aos atendimentos validados
      atendimentosValidados.push({
        imovelId: atendimento.imovelId,
        ruaId: atendimento.ruaId,
        territorioId,
        data: atendimento.data || new Date(),
        resultado: atendimento.resultado,
        observacoes: atendimento.observacoes || '',
        responsavel: atendimento.responsavel || 'Sistema'
      });
    }
    
    // Se não há atendimentos válidos
    if (atendimentosValidados.length === 0) {
      return res.status(400).json({
        msg: 'Nenhum atendimento válido encontrado',
        erros
      });
    }
    
    // Inserir atendimentos validados
    const result = await Atendimento.insertMany(atendimentosValidados);
    
    res.json({
      success: true,
      inseridos: result.length,
      total: atendimentos.length,
      erros: erros.length > 0 ? erros : undefined
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;