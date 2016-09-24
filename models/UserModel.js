var mongoose = require('mongoose'),
    shortid  = require('shortid');

var UserSchema = new mongoose.Schema({
  _id           : { type: String, 'default': shortid.generate },
  facebookId    : String,
  facebookToken : String,
  givenName     : String,
  displayName   : String,
  email         : String,
  created_date  : { type: Date, default: Date.now },
  lists         : [{ type: String, ref: 'List' }],
  image         : String
});


UserSchema.index({ displayName: "text", email: "text"});
module.exports = mongoose.model('User', UserSchema);
