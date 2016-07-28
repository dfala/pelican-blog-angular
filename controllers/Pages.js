var Routes   = module.exports = {},
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Routes.index = function (req, res) {
  // res.render('index', {user: req.user || null, lists: []});

  Post.find({})
  .populate({ path: 'owner', select: 'displayName _id lists' })
  .exec(function (err, result) {
    res.render('index', {
      user: req.user || null,
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
    var data = {
      user: req.user || null,
      lists: result || []
    };
    res.render('user', data);
  });
}
