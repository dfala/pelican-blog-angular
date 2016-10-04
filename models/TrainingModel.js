var mongoose = require('mongoose'),
    shortid  = require('shortid');

var TrainingSchema = new mongoose.Schema({
  _id         : { type: String, default: shortid.generate },
  userId      : { type: String, ref: 'User' },
  newUser     : { type: Boolean, default: false },
  bookmark    : { type: Boolean, default: false }
});

module.exports = mongoose.model('Training', TrainingSchema);
