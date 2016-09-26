var Exports  = module.exports = {},
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel'),
    ListCtrl = require('./ListController');

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
    res.json(post);
  })
  .catch(function (err) {
    red.status(500).send(err);
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

  Promise.all([p1, p2])
  .then(function (values) {
    res.json({postStatus: 'deleted'})
  })
  .catch(function (err) {
    res.status(500).json(err);
  });
};
