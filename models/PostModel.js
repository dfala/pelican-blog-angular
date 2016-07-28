var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title         : { type: String, required: true },
  link          : { type: String, required: false },
  text          : { type: String, required: false },
  owner         : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_date  : { type: Date, default: Date.now },
  parentList    : { type: mongoose.Schema.Types.ObjectId, ref: 'List' }
});

module.exports = mongoose.model('Post', PostSchema);
