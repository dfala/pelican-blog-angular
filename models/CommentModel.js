var mongoose = require('mongoose'),
    shortid  = require('shortid');

var CommentSchema = new mongoose.Schema({
  _id           : { type: String, 'default': shortid.generate },
  creator       : { type: String, ref: 'User' },
  postOwner     : { type: String, ref: 'User' },
  post          : { type: String, ref: 'Post' },
  message       : { type: String, required: false },
  created_date  : { type: Date, default: Date.now },
  edited        : { type: Boolean, default: false }
});

module.exports = mongoose.model('Comment', CommentSchema);
