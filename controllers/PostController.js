var Exports  = module.exports = {},
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

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
        console.log(err);
      }
    );
    res.json(post);
  })
  .catch(function (err) {
    req.status(500).send(err);
  });
};

Exports.update = function (req, res) {
  Post.findByIdAndUpdate(
    req.params.postId,
    {$set: req.body},
    function (err, result) {
      if (err) return res.status(500).send(err);
      return res.json(req.body)
    }
  );
};
