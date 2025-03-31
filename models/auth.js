// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @rota    POST api/auth/register
// @desc    Registrar usuário
// @acesso  Público
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;

    // Verificar se o usuário já existe
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    // Criar o usuário
    user = new User({
      nome,
      email,
      senha,
      cargo: cargo || 'usuario'
    });

    await user.save();

    // Gerar token
    const token = user.getSignedJwtToken();

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    POST api/auth/login
// @desc    Autenticar usuário e obter token
// @acesso  Público
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validar email e senha
    if (!email || !senha) {
      return res.status(400).json({ msg: 'Por favor, forneça email e senha' });
    }

    // Verificar se o usuário existe
    const user = await User.findOne({ email }).select('+senha');

    if (!user) {
      return res.status(401).json({ msg: 'Credenciais inválidas' });
    }

    // Verificar se a senha corresponde
    const isMatch = await user.matchPassword(senha);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = user.getSignedJwtToken();

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @rota    GET api/auth/me
// @desc    Obter usuário atual
// @acesso  Privado
router.get('/me', async (req, res) => {
  try {
    // Verificar token no header
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ msg: 'Sem token, autorização negada' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-senha');

    if (!user) {
      return res.status(401).json({ msg: 'Token inválido' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;