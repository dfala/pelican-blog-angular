var Exports       = module.exports = {},
    List          = require('../models/ListModel'),
    Post          = require('../models/PostModel'),
    Postvanity    = require('../models/PostVanityModel');

Exports.trackConsume = function (req, res) {
  Postvanity.findOne({'postId': req.params.postId}, function (err, result) {
    if (err) return res.status(500).send(err);

    if (!result) {
      var newPostVanity = new Postvanity();
      newPostVanity.postId = req.params.postId;
      if (req.user && req.user._id) newPostVanity.ownerClick = 1;
      else newPostVanity.guestClick = 1;

      newPostVanity.owner = req.body.owner._id || req.body.owner;

      newPostVanity.save(function (err, result) {
        if (err) return res.status(500).json(err);
        return res.json(result);
      })
    } else {
      if ((req.user && req.user._id) && (req.user._id === result.owner)) result.ownerClick++;
      else result.guestClick++;
      result.save(function (err, saved) {
        if (err) return res.status(500).send(err);
        return res.json(saved);
      })
    }
  });
};
