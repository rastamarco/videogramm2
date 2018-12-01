var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);

  user.save(function(err) {
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });

};

module.exports.login = function(req, res) {


  passport.authenticate('local', function(err, user, info){
    var token;

    // Se o passport detectar um erro, manda essa msg de 404
    if (err) {
      res.status(404).json(err);
      return;
    }

    // Se há um usuário, gera um Token
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // Se não encontrou um usuário, manda erro de 401
      res.status(401).json(info);
    
    }
  })(req, res);

};