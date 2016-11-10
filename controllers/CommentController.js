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
    // CREATE POST OWNER NOTIFICATION
    NotificationCtrl.create({
      user: req.body.postOwner,
      created_by: req.user._id,
      message: req.user.displayName + ' left a comment on your post',
      action: '/user/' + req.body.postOwner + '?post=' + req.body.post,
      type: 'comment'
    }, req.user._id)
    .catch(function (err) {
      console.error(err);
    });

    // CREATE PREVIOUS COMMENTERS NOTIFICATION(S)
    Comment.find({post: req.body.post}, function (err, comments) {
      if (err) return console.log('Error finding post for comment notification.');
      var notifiedUsers = [];

      comments.forEach(function (comment) {
        // YOU ARE THE POST OWNER
        if (comment.creator == req.body.creator) return;
        // DON'T NOTIFY IF LAST PREVIOUS COMMENTER WAS THE POST OWNER (DUPLICATE NOTIFICATION)
        if (comment.creator == req.body.postOwner) return;
        // YOU ALREADY GOT NOTIFIED ABOUT THIS?
        if (notifiedUsers.indexOf(comment.creator) > -1) return;
        notifiedUsers.push(comment.creator);

        NotificationCtrl.create({
          user: comment.creator,
          created_by: req.body.creator,
          message: req.user.displayName + ' replied to your comment',
          action: '/user/' + req.body.postOwner + '?post=' + req.body.post,
          type: 'comment'
        }, req.user._id)
        .catch(function (err) {
          console.error(err);
        });

      })
    })

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
