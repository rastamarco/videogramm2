var express = require('express');
var router = express.Router();
var fileController = require('../controllers/fileController');

var cors = require('cors');

var whitelist = ['http://localhost:4200'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Não Permitido pelo CORS'))
    }
  },
  credentials: true
};

// Inclui o cors depois da inclusão das rotas
router.options('*', cors(corsOptions));

// POST upload arquivo
router.post('/upload', cors(corsOptions), fileController.uploadFile);

module.exports = router;
