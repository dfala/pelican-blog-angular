var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  facebookId: String,
  facebookToken: String,
  name: String,
  email: String,
  created_date: { type: Date, default: Date.now },
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
});

module.exports = mongoose.model('User', UserSchema);
