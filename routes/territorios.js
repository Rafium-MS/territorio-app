// routes/territorios.js
const express = require('express');
const router = express.Router();
const Territorio = require('../models/Territorio');

// @rota    GET api/territorios
// @desc    Obter todos os territórios
// @acesso  Público
router.get('/', async (req, res) => {
  try {
    const territorios = await Territorio.find().sort({ nome: 1 });
    res.json(territorios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/territorios/:id
// @desc    Obter território por ID
// @acesso  Público
router.get('/:id', async (req, res) => {
  try {
    const territorio = await Territorio.findById(req.params.id);
    
    if (!territorio) {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    res.json(territorio);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    POST api/territorios
// @desc    Criar um território
// @acesso  Público (posteriormente privado com autenticação)
router.post('/', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    
    // Criar novo território
    const novoTerritorio = new Territorio({
      nome,
      descricao,
      ruas: []
    });
    
    const territorio = await novoTerritorio.save();
    res.json(territorio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    PUT api/territorios/:id
// @desc    Atualizar um território
// @acesso  Público (posteriormente privado com autenticação)
router.put('/:id', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    
    // Construir objeto de atualização
    const territorioFields = {};
    if (nome) territorioFields.nome = nome;
    if (descricao) territorioFields.descricao = descricao;
    territorioFields.updatedAt = Date.now();
    
    let territorio = await Territorio.findById(req.params.id);
    
    if (!territorio) {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    territorio = await Territorio.findByIdAndUpdate(
      req.params.id,
      { $set: territorioFields },
      { new: true }
    );
    
    res.json(territorio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    DELETE api/territorios/:id
// @desc    Deletar um território
// @acesso  Público (posteriormente privado com autenticação)
router.delete('/:id', async (req, res) => {
  try {
    const territorio = await Territorio.findById(req.params.id);
    
    if (!territorio) {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    await territorio.remove();
    res.json({ msg: 'Território removido' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    res.status(500).send('Erro no servidor');
  }
});

// @rota    POST api/territorios/:id/ruas
// @desc    Adicionar uma rua a um território
// @acesso  Público (posteriormente privado com autenticação)
router.post('/:id/ruas', async (req, res) => {
  try {
    const { nome } = req.body;
    
    const territorio = await Territorio.findById(req.params.id);
    
    if (!territorio) {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    // Adicionar nova rua
    territorio.ruas.unshift({ nome, imoveis: [] });
    territorio.updatedAt = Date.now();
    
    await territorio.save();
    res.json(territorio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    POST api/territorios/:id/ruas/:ruaId/imoveis
// @desc    Adicionar um imóvel a uma rua
// @acesso  Público (posteriormente privado com autenticação)
router.post('/:id/ruas/:ruaId/imoveis', async (req, res) => {
  try {
    const { numero, tipo, observacoes } = req.body;
    
    const territorio = await Territorio.findById(req.params.id);
    
    if (!territorio) {
      return res.status(404).json({ msg: 'Território não encontrado' });
    }
    
    // Encontrar a rua
    const rua = territorio.ruas.id(req.params.ruaId);
    
    if (!rua) {
      return res.status(404).json({ msg: 'Rua não encontrada' });
    }
    
    // Adicionar novo imóvel
    rua.imoveis.unshift({ numero, tipo, observacoes });
    territorio.updatedAt = Date.now();
    
    await territorio.save();
    res.json(territorio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;