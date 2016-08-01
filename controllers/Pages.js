var Routes   = module.exports = {},
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Routes.index = function (req, res) {
  Post.find({})
  .populate({ path: 'owner', select: 'displayName _id lists image' })
  .exec(function (err, result) {
    res.render('index', {
      user: req.user || null,
      owner: null,
      lists: [],
      posts: result || []
    })
  })
};

Routes.userView = function (req, res) {
  var userId = req.params.userId;
  if (!userId && req.user && req.user._id) return res.redirect('/user/' + req.user._id);
  if (!userId) return res.redirect('/');

  List.find({owner: userId})
  .populate('posts')
  .exec(function(error, result) {
    User.findById(userId, function (err, user) {
      if (err) return res.status(400).json(err);
      res.render('user', {
        user: req.user || null,
        userId: userId,
        lists: result || [],
        owner: user
      });
    })
  })
}
