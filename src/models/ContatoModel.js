const mongoose = require('mongoose');
const validator = require('validator'); // CORREÇÃO 1: Importação que faltava

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now }, // Dica: mudei de String para Date para funcionar melhor com o mongoose
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}

Contato.prototype.register = async function () {
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function () {
  this.cleanUp();

  // Validação do E-mail usando o pacote validator
  if (this.body.email && !validator.isEmail(this.body.email)) {
    this.errors.push('E-mail inválido');
  }

  // Validação de campo obrigatório
  if (!this.body.nome) {
    this.errors.push('Nome é um campo Obrigatório');
  }

  // Validação para garantir que pelo menos um meio de contato foi enviado
  if (!this.body.email && !this.body.telefone) {
    this.errors.push('Pelo menos um contato precisa ser enviado: E-mail ou telefone.');
  }

  // CORREÇÃO 2: Removida a validação de "this.body.senha.length", pois contatos não usam senha!
}

Contato.prototype.cleanUp = function() {
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  };
}

module.exports = Contato;