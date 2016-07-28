var mongoose = require('mongoose');

var ListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_date: { type: Date, default: Date.now },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

module.exports = mongoose.model('List', ListSchema);
