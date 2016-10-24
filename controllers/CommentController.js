var Exports           = module.exports = {},
    User              = require('../models/UserModel'),
    Post              = require('../models/PostModel'),
    Comment           = require('../models/CommentModel'),
    NotificationCtrl  = require('./NotificationController');

Exports.create = function (req, res) {
  if (!req.user || !req.user._id) return res.status(401).send('Please login.');
  var newComment = new Comment(req.body);

  newComment.save()
  .then(function (comment) {
    NotificationCtrl.create({
      user: req.body.postOwner,
      created_by: req.user._id,
      message: req.user.displayName + ' left a comment on your post.',
      action: '/user/' + req.body.postOwner + '?post=' + req.body.post,
      type: 'comment'
    }, req.user._id);

    res.json(comment);
  })
  .catch(function(err) {
    res.status(500).send(err);
  })
};

Exports.get = function (req, res) {
  Comment.find({ 'post': req.params.postId })
  .sort('created_date')
  .populate({ path: 'creator', select: 'displayName _id image' })
  .exec(function (err, result) {
    if (err) return res.status(400).json(err);
    return res.json(result);
  })
};
