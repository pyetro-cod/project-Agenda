const Login = require('../models/loginModel');

exports.index = (req,res) =>{
    res.render('login');
}; 

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      // Salva a sessão e redireciona para a rota da página de login
      return req.session.save(() => {
        return res.redirect('/login/index'); // <-- Use o caminho da sua rota de login
      });
    }

    // Se chegou aqui, deu certo! 
    req.flash('success', 'Seu usuário foi criado com sucesso.');
    return req.session.save(() => {
      return res.redirect('/login/index');
    });

  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};