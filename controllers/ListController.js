var Exports  = module.exports = {},
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Exports.create = function (req, res) {
  var newList = new List(req.body);
  newList.owner = req.user._id;

  newList.save()
  .then(function (list) {
    User.findByIdAndUpdate(
      req.user._id,
      {$push: {"lists": list._id}},
      {safe: true, upsert: true},
      function(err, model) {
        console.log(err);
      }
    );

    res.json(list);
  })
  .catch(function(err) {
    res.status(500).send(err);
  })
};

Exports.updatePrivacy = function (req, res) {
  var p1 = new Promise(function (resolve, reject) {
    List.findById(req.params.listId, function (err, list) {
      if (err) return reject(err);
      list.isPrivate = req.body.newStatus;
      list.save(function (err, result) {
        if (err) return reject(err);
        resolve(result);
      })
    })
  });

  var p2 = new Promise(function (resolve, reject) {
    Post.find({parentList: req.params.listId}, function (err, posts) {
      if (err) return reject(err);
      var promises = posts.map(function (post) {
        post.isPrivate = req.body.newStatus;
        return post.save();
      })

      Promise.all(promises)
      .then(function() {
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });

    });
  });

  Promise.all([p1, p2])
  .then(function (values) {
    res.json({isNowPrivate: req.body.newStatus})
  })
  .catch(function (err) {
    res.status(500).json(err);
  })
};
