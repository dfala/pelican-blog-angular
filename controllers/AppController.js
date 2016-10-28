var Exports  = module.exports = {},
    request  = require('request'),
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Exports.getPosts = function (req, res) {
  Post.find({isPrivate: false})
  .sort('-created_date')
  .limit(20)
  .populate({ path: 'owner', select: 'displayName _id image' })
  .populate({ path: 'parentList', select: 'title _id' })
  .exec(function (err, result) {
    if (err) return res.status(400).json(err);
    return res.json(result);
  })
};

Exports.getMorePosts = function (req, res) {
  Post.find({isPrivate: false})
  .sort('-created_date')
  .skip(parseInt(req.params.start))
  .limit(20)
  .populate({ path: 'owner', select: 'displayName _id image' })
  .populate({ path: 'parentList', select: 'title _id' })
  .exec(function (err, result) {
    if (err) return res.status(400).json(err);
    return res.json(result);
  })
};

Exports.getPost = function (req, res) {
  Post.findById(req.params.postId)
  .populate({ path: 'owner', select: 'displayName _id image' })
  .populate({ path: 'parentList', select: 'title _id' })
  .exec(function (err, post) {
    if (err) return res.status(500).send(err);
    return res.json(post);
  })
};

Exports.getUsers = function (req, res) {
  User.find({}, 'displayName email image lists', function (err, users) {
    if (err) return res.status(500).send(err);
    return res.json(users)
  });
};

Exports.getUserPosts = function (req, res) {
  Post.find({ 'isPrivate': false, 'owner': req.params.userId })
  .sort('-created_date')
  .populate({ path: 'owner', select: 'displayName _id image' })
  .populate({ path: 'parentList', select: 'title _id' })
  .exec(function (err, result) {
    if (err) return res.status(400).json(err);
    return res.json(result);
  })
};
