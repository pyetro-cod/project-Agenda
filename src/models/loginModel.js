const mongoose = require('mongoose');
const validator = require('validator');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  senha: { type: String, required: true }, // Mantendo 'senha' como no Schema
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return;

    try {
      this.user = await LoginModel.create(this.body);
    } catch (e) {
      console.log(e);
    }
  }

  valida() {
    this.cleanUp();

    // Validação do E-mail
    if (!validator.isEmail(this.body.email)) {
      this.errors.push('E-mail inválido');
    }

    // CORREÇÃO AQUI: Usando 'senha' e verificando '.length'
    if (this.body.senha.length < 3 || this.body.senha.length >= 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    // CORREÇÃO AQUI: O objeto deve refletir o que o Schema espera e o que o HTML envia
    this.body = {
      email: this.body.email,
      senha: this.body.senha // Mudado de password para senha
    };
  }
}

module.exports = Login;