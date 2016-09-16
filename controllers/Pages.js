var Routes   = module.exports = {},
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Routes.index = function (req, res) {
  List.find({owner: req.user && req.user._id || null})
  .then(function(lists) {
    Post.find({isPrivate: false})
    .sort('-created_date')
    .populate({ path: 'owner', select: 'displayName _id lists image' })
    .exec(function (err, result) {
      res.render('index', {
        user: req.user || null,
        owner: null,
        lists: lists || [],
        posts: result || []
      })
    })
  })

};

Routes.userView = function (req, res) {
  var userId = req.params.userId;
  if (!userId && req.user && req.user._id) return res.redirect('/user/' + req.user._id);
  if (!userId) return res.redirect('/');

  var userIsListOwner = false;
  if (req.user && req.user._id && (req.params.userId == req.user._id))
    userIsListOwner = true;

  List.find({owner: userId})
  .populate({path: 'posts', options: { sort: { 'created_date': -1 } }})
  .exec(function(error, result) {
    User.findById(userId, function (err, user) {
      if (err) return res.status(400).json(err);

      if (!userIsListOwner) {
        result = result.filter(function (list) {
          if (list.isPrivate || (!list.posts || list.posts.length < 1)) return false;
          return true;
        })
      };

      res.render('user', {
        user: req.user || null,
        userId: userId,
        lists: result || [],
        owner: user
      });
    })
  })
}
