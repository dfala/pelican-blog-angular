var mongoose = require('mongoose'),
    shortid  = require('shortid');

var PostSchema = new mongoose.Schema({
  _id           : { type: String, 'default': shortid.generate },
  title         : { type: String, required: true },
  link          : { type: String, required: false },
  text          : { type: String, required: false },
  img           : { type: String, required: false},
  owner         : { type: String, ref: 'User' },
  isPrivate     : { type: Boolean, default: false },
  created_date  : { type: Date, default: Date.now },
  parentList    : { type: String, ref: 'List' },
  likes         : [{ type: String, ref: 'User' }]
});

// ADDING SEARCH WEIGHTS
PostSchema.index(
  { title: "text", link: "text", text: "text" },
  { weights:
    { title: 5, link: 2, text: 1 }
  }
);

module.exports = mongoose.model('Post', PostSchema);
