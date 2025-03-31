// models/SaidaCampo.js
const mongoose = require('mongoose');

const SaidaCampoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  diaSemana: {
    type: String,
    required: true
  },
  horario: {
    type: String,
    required: true
  },
  dirigente: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SaidaCampo', SaidaCampoSchema);