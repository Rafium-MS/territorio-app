// models/Atendimento.js
const mongoose = require('mongoose');

const AtendimentoSchema = new mongoose.Schema({
  imovelId: {
    type: String,
    required: true
  },
  ruaId: {
    type: String,
    required: true
  },
  territorioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Territorio',
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  resultado: {
    type: String,
    enum: ['positivo', 'ausente', 'recusado', 'outro'],
    required: true
  },
  observacoes: String,
  responsavel: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Atendimento', AtendimentoSchema);