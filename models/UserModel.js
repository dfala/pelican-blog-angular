var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  facebookId: String,
  facebookToken: String,
  givenName: String,
  displayName: String,
  email: String,
  created_date: { type: Date, default: Date.now },
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
  image: String
});


UserSchema.index({ displayName: "text", email: "text"});
module.exports = mongoose.model('User', UserSchema);
