// models/Designacao.js
const mongoose = require('mongoose');

const DesignacaoSchema = new mongoose.Schema({
  territorioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Territorio',
    required: true
  },
  saidaCampoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SaidaCampo',
    required: true
  },
  responsavel: {
    type: String,
    required: true
  },
  dataDesignacao: {
    type: Date,
    required: true
  },
  dataDevolucao: {
    type: Date,
    required: true
  },
  dataConclusao: Date,
  status: {
    type: String,
    enum: ['ativo', 'concluido'],
    default: 'ativo'
  },
  resultado: {
    type: String,
    enum: ['completo', 'parcial', 'problemas', ''],
    default: ''
  },
  observacoes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Designacao', DesignacaoSchema);