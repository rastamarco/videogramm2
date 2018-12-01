var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/videogrammdb2';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

// Mensagens de Conexão 
mongoose.connection.on('connected', function() {
  console.log('Mongoose Conectado na URL ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Erro de Conexão ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Disconectado do Mongo');
});

// Parou ou Finalizou o servidor
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Desconectado por:  ' + msg);
    callback();
  });
};
// Restart
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// Encerrou aplicação
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});

// Se encerrou a aplicação no Heroku
process.on('SIGTERM', function() {
  gracefulShutdown('encerrou Heroku', function() {
    process.exit(0);
  });
});

// Traz o users.js
require('./users');