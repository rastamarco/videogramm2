var mongoose = require('mongoose');

var Schema   = mongoose.Schema;
var fileSchema = new Schema({
	fileSeq: Number,
	fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number,
	deleted: {
		type: Number,
		default: 0
	},
  originalFileSeq: Number
});
// Criando o Schema file no banco
module.exports = mongoose.model('file', fileSchema);
