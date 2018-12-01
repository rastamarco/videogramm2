var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      // Mostra mensagem no console de usuário não encontrado
      if (!user) {
        return done(null, false, {
          message: 'Usuário não encontrado'
        });
      }
      // Mostra mensagem no console se o password tiver errado
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Senha Incorreta'
        });
      }
      // Se email e password estão corretos, cadastra
      return done(null, user);
    });
  }
));