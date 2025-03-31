// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rotas
exports.protect = async (req, res, next) => {
  let token;

  // Verificar se há um token no header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Obter token do header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Ou obter do cookie, se implementado
    token = req.cookies.token;
  }

  // Verificar se o token existe
  if (!token) {
    return res.status(401).json({ msg: 'Sem token, autorização negada' });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adicionar usuário à requisição
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
};

// Conceder acesso a funções específicas
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Usuário não autenticado' });
    }
    
    if (!roles.includes(req.user.cargo)) {
      return res.status(403).json({
        msg: `Usuário com cargo ${req.user.cargo} não tem permissão para acessar esta rota`
      });
    }
    
    next();
  };
};