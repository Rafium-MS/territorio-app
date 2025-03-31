// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, forneça um email válido'
    ]
  },
  senha: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  cargo: {
    type: String,
    default: 'usuario',
    enum: ['usuario', 'admin']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Criptografar senha usando bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Verificar se a senha corresponde à senha criptografada
UserSchema.methods.matchPassword = async function(senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

// Gerar token JWT
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, cargo: this.cargo },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = mongoose.model('User', UserSchema);