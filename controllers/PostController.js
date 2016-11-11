var Exports           = module.exports = {},
    List              = require('../models/ListModel'),
    Post              = require('../models/PostModel'),
    ListCtrl          = require('./ListController'),
    RequestCtrl       = require('./RequestController'),
    Postmetric        = require('../models/PostMetricModel'),
    NotificationCtrl  = require('./NotificationController');

Exports.create = function (req, res) {
  var newPost = new Post(req.body);
  newPost.owner = req.user._id;

  newPost.save()
  .then(function(post) {
    List.findByIdAndUpdate(
      req.body.parentList,
      {$push: {"posts": post._id}},
      {safe: true, upsert: true},
      function(err, model) {
        if (err) console.log(err);
      }
    );

    try {
      RequestCtrl.getImage(post.link)
      .then(function (imgUrl) {
        post.img = imgUrl;
        post.save(function (err, result) {
          res.json(post);
        });
      })
      .catch(function (err) {
        console.log('Error retrieving image: ', err);
        res.json(post);
      })
    } catch (e) {
      console.log('Error getting image: ', e);
      res.json(post);
    }
  })
  .catch(function (err) {
    res.status(500).send(err);
  });
};

Exports.update = function (req, res) {
  Post.findByIdAndUpdate(
    req.params.postId,
    {$set: req.body},
    function (err, result) {
      if (err) return res.status(500).send(err);
      return res.json(req.body);
    }
  );
};

Exports.like = function (req, res) {
  if (!req.user || !req.user._id) return res.status(401).send('Please log in.');

  Post.findById(req.params.postId)
  .then(function (post) {
    if (!post) return res.status(404).send('Post not found.');
    if (post && !post.likes) post.likes = [];

    var userIndex = post.likes.indexOf(req.user._id);
    if (userIndex < 0) post.likes.push(req.user._id);
    else post.likes.splice(userIndex, 1);

    post.save(function (err, result) {
      if (err) return res.status(500).send(err);

      // CREATE NOTIFICATION
      NotificationCtrl.create({
        user: post.owner,
        created_by: req.user._id,
        message: req.user.displayName + ' liked your post',
        action: '/user/' + post.owner + '?post=' + post._id,
        type: 'like'
      }, req.user._id)
      .catch(function (err) {
        console.error(err);
      });

      return res.json({
        isLiked: result.likes.indexOf(req.user._id) < 0 ? false : true,
        likes: result.likes
      });
    })
  })
  .catch(function (err) {
    return res.status(500).send(err);
  })
};

Exports.delete = function (req, res) {
  var p1 = new Promise(function (resolve, reject) {
    Post.findById(req.params.postId)
    .remove(function (err, result) {
      if (err) return reject(err);
      return resolve(result);
    })
  });

  var p2 = new Promise(function (resolve, reject) {
    List.update(
      { _id:req.params.listId },
      { $pull: { posts: req.params.postId } },
      { safe: true },
      function (err, result) {
        if (err) return reject(err);
        return resolve(result);
      }
    );
  });

  var p3 = new Promise(function (resolve, reject) {
    Postmetric.find({ post: req.params.postId })
    .remove(function (err, result) {
      if (err) return reject(err);
      return resolve(result);
    });
  })

  Promise.all([p1, p2, p3])
  .then(function (values) {
    res.json({postStatus: 'deleted'})
  })
  .catch(function (err) {
    res.status(500).json(err);
  });
};
