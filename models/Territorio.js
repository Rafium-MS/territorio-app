// models/Territorio.js
const mongoose = require('mongoose');

const ImovelSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['residencial', 'comercial', 'predio', 'vila'],
    required: true
  },
  observacoes: String
});

const RuaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  imoveis: [ImovelSchema]
});

const TerritorioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  descricao: String,
  ruas: [RuaSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Territorio', TerritorioSchema);