var mongoose = require('mongoose'),
    shortid  = require('shortid');

var ListSchema = new mongoose.Schema({
  _id           : { type: String, 'default': shortid.generate },
  title         : { type: String, required: true },
  owner         : { type: String, ref: 'User' },
  isPrivate     : { type: Boolean, default: false },
  created_date  : { type: Date, default: Date.now },
  posts         : [{ type: String, ref: 'Post' }]
});

ListSchema.index(
  { title: "text" },
  { weights: { title: 5 } }
);
module.exports = mongoose.model('List', ListSchema);
