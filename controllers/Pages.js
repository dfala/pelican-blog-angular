var Routes   = module.exports = {},
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Routes.index = function (req, res) {
  if (!req.user) return res.render('index', {user: req.user || null, lists: []});

  List.find({owner: req.user._id})
  .populate('posts')
  .exec(function(error, result) {
    var data = {
      user: req.user || null,
      lists: result || []
    };
    res.render('index', data);
  });

}
