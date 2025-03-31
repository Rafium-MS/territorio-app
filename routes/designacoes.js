// routes/designacoes.js
const express = require('express');
const router = express.Router();
const Designacao = require('../models/Designacao');
const Territorio = require('../models/Territorio');
const SaidaCampo = require('../models/SaidaCampo');
const { protect, authorize } = require('../middleware/auth');

// @rota    GET api/designacoes
// @desc    Obter todas as designações
// @acesso  Público (posteriormente privado)
router.get('/', async (req, res) => {
  try {
    // Obter parâmetros de filtragem
    const { status, saidaCampoId, responsavel } = req.query;
    
    // Construir o filtro
    const filtro = {};
    if (status && status !== 'todos') filtro.status = status;
    if (saidaCampoId) filtro.saidaCampoId = saidaCampoId;
    if (responsavel) filtro.responsavel = { $regex: responsavel, $options: 'i' };
    
    // Buscar as designações com população dos relacionamentos
    const designacoes = await Designacao.find(filtro)
      .populate('territorioId', 'nome descricao')
      .populate('saidaCampoId', 'nome diaSemana horario')
      .sort({ dataDesignacao: -1 });
    
    res.json(designacoes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/designacoes/ativas
// @desc    Obter designações ativas
// @acesso  Público (posteriormente privado)
router.get('/ativas', async (req, res) => {
  try {
    const designacoes = await Designacao.find({ status: 'ativo' })
      .populate('territorioId', 'nome descricao')
      .populate('saidaCampoId', 'nome diaSemana horario')
      .sort({ dataDesignacao: -1 });
    
    res.json(designacoes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/designacoes/territorio/:territorioId
// @desc    Verificar se um território tem designação ativa
// @acesso  Público (posteriormente privado)
router.get('/territorio/:territorioId', async (req, res) => {
  try {
    const designacao = await Designacao.findOne({
      territorioId: req.params.territorioId,
      status: 'ativo'
    })
      .populate('territorioId', 'nome descricao')
      .populate('saidaCampoId', 'nome diaSemana horario');
    
    if (!designacao) {
      return res.status(404).json({ msg: 'Território não possui designação ativa' });
    }
    
    res.json(designacao);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/designacoes/hoje
// @desc    Obter a designação do dia atual
// @acesso  Público (posteriormente privado)
router.get('/hoje', async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Buscar designação ativa para a data atual
    const designacao = await Designacao.findOne({
      status: 'ativo',
      dataDesignacao: { $lte: hoje },
      dataDevolucao: { $gte: hoje }
    })
      .populate('territorioId', 'nome descricao ruas')
      .populate('saidaCampoId', 'nome diaSemana horario');
    
    if (!designacao) {
      return res.status(404).json({ msg: 'Não há territórios designados para hoje' });
    }
    
    res.json(designacao);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/designacoes/proximas
// @desc    Obter as próximas designações
// @acesso  Público (posteriormente privado)
router.get('/proximas', async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Buscar as próximas designações (com data de designação futura)
    const designacoes = await Designacao.find({
      status: 'ativo',
      dataDesignacao: { $gt: hoje }
    })
      .populate('territorioId', 'nome descricao')
      .populate('saidaCampoId', 'nome diaSemana horario')
      .sort({ dataDesignacao: 1 })
      .limit(5);
    
    res.json(designacoes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/designacoes/:id
// @desc    Obter designação por ID
// @acesso  Público (posteriormente privado)
router.get('/:id', async (req, res) => {
  try {
    const designacao = await Designacao.findById(req.params.id)
      .populate('territorioId', 'nome descricao')
      .populate('saidaCampoId', 'nome diaSemana horario');
    
    if (!designacao) {
      return res.status(404).json({ msg: 'Designação não encontrada' });
    }
    
    res.json(designacao);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Designação não encontrada' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    POST api/designacoes
// @desc    Criar uma nova designação
// @acesso  Público (posteriormente privado)
router.post('/', async (req, res) => {
  try {
    const {
      territorioId,
      saidaCampoId,
      responsavel,
      dataDesignacao,
      dataDevolucao,
      observacoes
    } = req.body;
    
    // Verificar se os IDs existem
    const territorio = await Territorio.findById(territorioId);
    if (!territorio) {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    const saidaCampo = await SaidaCampo.findById(saidaCampoId);
    if (!saidaCampo) {
      return res.status(404).json({ msg: 'Saída de campo não encontrada' });
    }
    
    // Verificar se o território já possui designação ativa
    const designacaoExistente = await Designacao.findOne({
      territorioId,
      status: 'ativo'
    });
    
    if (designacaoExistente) {
      return res.status(400).json({ msg: 'Este território já possui uma designação ativa' });
    }
    
    // Criar nova designação
    const novaDesignacao = new Designacao({
      territorioId,
      saidaCampoId,
      responsavel,
      dataDesignacao,
      dataDevolucao,
      observacoes,
      status: 'ativo'
    });
    
    const designacao = await novaDesignacao.save();
    
    // Retornar a designação com os objetos relacionados
    const designacaoPopulada = await Designacao.findById(designacao._id)
      .populate('territorioId', 'nome descricao')
      .populate('saidaCampoId', 'nome diaSemana horario');
    
    res.json(designacaoPopulada);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    PUT api/designacoes/:id
// @desc    Atualizar uma designação
// @acesso  Público (posteriormente privado)
router.put('/:id', async (req, res) => {
  try {
    const {
      responsavel,
      dataDesignacao,
      dataDevolucao,
      status,
      resultado,
      dataConclusao,
      observacoes
    } = req.body;
    
    // Construir objeto de atualização
    const camposAtualizacao = {};
    if (responsavel) camposAtualizacao.responsavel = responsavel;
    if (dataDesignacao) camposAtualizacao.dataDesignacao = dataDesignacao;
    if (dataDevolucao) camposAtualizacao.dataDevolucao = dataDevolucao;
    if (status) camposAtualizacao.status = status;
    if (resultado) camposAtualizacao.resultado = resultado;
    if (dataConclusao) camposAtualizacao.dataConclusao = dataConclusao;
    if (observacoes !== undefined) camposAtualizacao.observacoes = observacoes;
    camposAtualizacao.updatedAt = Date.now();
    
    // Verificar se a designação existe
    let designacao = await Designacao.findById(req.params.id);
    
    if (!designacao) {
      return res.status(404).json({ msg: 'Designação não encontrada' });
    }
    
    // Atualizar designação
    designacao = await Designacao.findByIdAndUpdate(
      req.params.id,
      { $set: camposAtualizacao },
      { new: true }
    )
      .populate('territorioId', 'nome descricao')
      .populate('saidaCampoId', 'nome diaSemana horario');
    
    res.json(designacao);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Designação não encontrada' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    PUT api/designacoes/:id/concluir
// @desc    Concluir uma designação
// @acesso  Público (posteriormente privado)
router.put('/:id/concluir', async (req, res) => {
  try {
    const { dataConclusao, resultado, observacoesConclusao } = req.body;
    
    // Verificar se a designação existe
    let designacao = await Designacao.findById(req.params.id);
    
    if (!designacao) {
      return res.status(404).json({ msg: 'Designação não encontrada' });
    }
    
    // Verificar se já está concluída
    if (designacao.status === 'concluido') {
      return res.status(400).json({ msg: 'Esta designação já está concluída' });
    }
    
    // Atualizar designação
    designacao = await Designacao.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: 'concluido',
          dataConclusao: dataConclusao || Date.now(),
          resultado: resultado || '',
          observacoesConclusao: observacoesConclusao || '',
          updatedAt: Date.now()
        }
      },
      { new: true }
    )
      .populate('territorioId', 'nome descricao')
      .populate('saidaCampoId', 'nome diaSemana horario');
    
    res.json(designacao);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Designação não encontrada' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    DELETE api/designacoes/:id
// @desc    Deletar uma designação
// @acesso  Privado (admin)
router.delete('/:id', async (req, res) => {
  try {
    const designacao = await Designacao.findById(req.params.id);
    
    if (!designacao) {
      return res.status(404).json({ msg: 'Designação não encontrada' });
    }
    
    await designacao.remove();
    
    res.json({ msg: 'Designação removida' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Designação não encontrada' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/designacoes/estatisticas
// @desc    Obter estatísticas de designações
// @acesso  Público (posteriormente privado)
router.get('/estatisticas/dashboard', async (req, res) => {
  try {
    // Total de designações ativas
    const totalAtivas = await Designacao.countDocuments({ status: 'ativo' });
    
    // Total de designações concluídas
    const totalConcluidas = await Designacao.countDocuments({ status: 'concluido' });
    
    // Designações por saída de campo
    const designacoesPorSaida = await Designacao.aggregate([
      { $match: { status: 'ativo' } },
      { $group: { _id: '$saidaCampoId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Preencher nomes das saídas
    for (const item of designacoesPorSaida) {
      const saida = await SaidaCampo.findById(item._id);
      if (saida) {
        item.nomeSaida = saida.nome;
      }
    }
    
    // Estatísticas de resultados para designações concluídas
    const estatisticasResultados = await Designacao.aggregate([
      { $match: { status: 'concluido' } },
      { $group: { _id: '$resultado', count: { $sum: 1 } } }
    ]);
    
    // Enviar estatísticas
    res.json({
      totalAtivas,
      totalConcluidas,
      designacoesPorSaida,
      estatisticasResultados
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;