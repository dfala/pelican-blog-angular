var Exports       = module.exports = {},
    List          = require('../models/ListModel'),
    Post          = require('../models/PostModel'),
    Postmetric    = require('../models/PostMetricModel');

Exports.trackConsume = function (req, res) {
  if (!req.body || req.body.isPrivate)
    return res.json({data: 'There is no post or is private. Vanity was not saved.'});

  Postmetric.findOne({'post': req.params.postId}, function (err, result) {
    if (err) return res.status(500).send(err);

    if (!result) {
      var newPostMetric = new Postmetric();
      newPostMetric.post = req.params.postId;
      newPostMetric.parentList = req.body.parentList;
      
      if (req.user && req.user._id) newPostMetric.ownerClick = 1;
      else newPostMetric.guestClick = 1;

      newPostMetric.owner = req.body.owner._id || req.body.owner;

      newPostMetric.save(function (err, result) {
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
