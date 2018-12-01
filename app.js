var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

// instanciando o passport
var passport = require('passport');

// instanciando banco
require('./api/models/db');
// Recebendo as informações do passport
require('./api/config/passport');
var app = express();


//////////////////// Upload /////////////////////////////////////
var upload = require('./routes/upload');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/files/', upload);
var mongoose = require('mongoose');
var path = require('path');

/////////////////// upload ///////////////////////////////////////

// Trazendo as rotas
var routesApi = require('./api/routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


// Iniciando o passport depois de usar a rota de middleware
app.use(passport.initialize());

// Usando as rotas da API
app.use('/api', routesApi);

// Erro 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// Erro de não Autorizado
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

////////////////////////////// Conectando no Mongo
mongoose.set('debug', true);

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Conectado no Mongo");
});
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/videogrammdb2', { useMongoClient: true });


module.exports = app;
