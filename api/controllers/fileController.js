var fileModel = require('../models/file.js');
var counterModel = require('../models/counter.js');

var multer = require('multer');
// Armazenamento no multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/');
    },
    filename: function (req, file, cb) {
      console.log(file);
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

// Inserção no storage do multer
var upload = multer({ storage: storage }).single('file');


module.exports = {

    // POST dos arquivos no mongo
    uploadFile: (res, req) => {
        upload( res, req, function(err) {
            console.log("req.file: ",req.file);
            if(err){
              res.json({error_code:1, err_desc:err});
              return;
            }
            res.json({error_code:0,err_desc:null, sucess: "ok"});
            // Variável que vai incrementar a quantidade de arquivos no banco
            var nextSeq = counterModel.increment('fileSeq', function (err, nextFileSeq) {
              if (err) {
                console.error('Erro de contador ' + err);
                return;
              }
              return res.json(nextFileSeq.fileSeq);
            });
        });


    },

};
