var mongoose = require('mongoose'),
    shortid  = require('shortid');

var PostvanitySchema = new mongoose.Schema({
  _id           : { type: String, 'default': shortid.generate },
  ownerClick    : { type: Number, default: 0 },
  guestClick    : { type: Number, default: 0 },
  created_date  : { type: Date, default: Date.now },
  last_udpated  : { type: Date, default: Date.now },
  postId        : { type: String, ref: 'Post' },
  owner         : { type: String, ref: 'User' }
});

module.exports = mongoose.model('Postvanity', PostvanitySchema);
