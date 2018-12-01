var express = require('express');
var router = express.Router();
var fileModel = require('../api/models/file.js');
var counterModel = require('../api/models/counter.js');

var cors = require('cors');
var whitelist = ['http://localhost:4200'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true
};

// Configurações do multer para upar os arquivos na pasta uploads( localmente )
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

// Variável para upar os arquivos no multer
var upload = multer({ storage: storage }).single('file');

// Insere o headers * nas permissões do cors mais a variável options
router.options('*', cors(corsOptions));


router.get('/', cors(corsOptions), function (req, res) {
  // Obtem os arquivos upados noavamente depois de deletar um
  fileModel.find({ deleted: { $ne:1 } }).sort({ fileSeq : -1 }).skip(0).limit(0).exec(function (err, files) {
      if (err) {
          return res.status(500).json({
              message: 'Error',
              error: err
          });
      }
      return res.json(files);
  });
});

// GET arquivo
// router.get('/video/:originalname', cors(corsOptions), function (req, res) {
router.get('/:fileSeq', cors(corsOptions), function (req, res) {
  var fileSeq = req.params.fileSeq;

  fileModel.findOne({ fileSeq:fileSeq  }).exec(function (err, file) {
      if (err) {
          return res.status(500).json({
              message: 'Error ',
              error: err
          });
      }
      return res.json(file);
  });
});
/* 
var gfs;
gfs.files.findOne({ originalname: req.params.originalname }, (err, file) => {
    // Verifica se possui um arquivo pelo tamanho
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Verifica se é um vídeo
    if (file.mimetype === 'video/mp4') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.originalname);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an video'
      });
    }
  });
});
*/



// POST upload arquivo 
router.post('/upload', cors(corsOptions), function(req, res) {

  // Salva o arquivo no ./uploads/
  upload(req, res, function(err){

    // Cria um arquivo "modelo"
    var file = new fileModel(req.file);
    if(err){
         res.json({error_code:1,err_desc:err});
         return;
    }

    // Obtem a sequencia de arquivos para incrementar no contador
    var nextFileSeq = counterModel.increment('fileSeq', function (err, result) {
      if (err) {
        console.error('Erro de contador: ' + err);
        return;
      }

      // Insere no banco o numero referente ao contador
      file.fileSeq = result.next;
      file.originalFileSeq = result.next;

      // Salva o arquivo no banco
      file.save(function (err, file) {
        if (err) {
          return res.status(500).json({
            message: 'Error ',
            error: err
          });
        }
        return res.status(201).json({ error_code:0, err_desc:null, file:file });
      });

    });

  });

});

// DELETE arquivo pelo indice no contador
router.delete('/:fileSeq', cors(corsOptions), function(req, res) {
  var fileSeq = req.params.fileSeq;
  fileModel.findOne( { fileSeq:fileSeq }, function (err, file) {
      if (err) {
          return res.status(500).json({
              message: 'Error',
              error: err
          });
      }
      if (!file) {
          return res.status(404).json({
              message: 'Nã há arquivo'
          });
      }

      file.deleted = 1;
      file.save(function (err, file) {
          if (err) {
              return res.status(500).json({
                  message: 'Error',
                  error: err
              });
          }

          return res.json(file);
      });

  });

});

module.exports = router;
