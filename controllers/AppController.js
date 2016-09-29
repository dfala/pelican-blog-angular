var Exports  = module.exports = {},
    request  = require('request'),
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Exports.getPosts = function (req, res) {
  Post.find({isPrivate: false})
  .sort('-created_date')
  .limit(20)
  .populate({ path: 'owner', select: 'displayName _id lists image' })
  .exec(function (err, result) {
    if (err) return res.status(400).json(err);
    return res.json(result);
  })
};
