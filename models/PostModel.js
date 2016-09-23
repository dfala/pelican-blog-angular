var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title         : { type: String, required: true },
  link          : { type: String, required: false },
  text          : { type: String, required: false },
  owner         : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPrivate     : { type: Boolean, default: false },
  created_date  : { type: Date, default: Date.now },
  parentList    : { type: mongoose.Schema.Types.ObjectId, ref: 'List' }
});

// ADDING SEARCH WEIGHTS
PostSchema.index(
  { title: "text", link: "text", text: "text" },
  { weights:
    { title: 5, link: 2, text: 1 }
  }
);

module.exports = mongoose.model('Post', PostSchema);
