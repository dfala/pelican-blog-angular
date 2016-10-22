var Exports     = module.exports = {},
    User        = require('../models/UserModel'),
    Post        = require('../models/PostModel'),
    Comment     = require('../models/CommentModel');

Exports.create = function (req, res) {
  if (!req.user._id) return res.status(401).send('Please login.');
  var newComment = new Comment(req.body);
  newComment.user = req.user._id;

  newComment.save()
  .then(function (comment) {
    res.json(comment);
  })
  .catch(function(err) {
    res.status(500).send(err);
  })
};
