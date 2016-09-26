var Export   = module.exports = {},
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Export.userView = function (req, res) {
  // VALIDATION
  var userId = req.params.userId;
  if (!userId && req.user && req.user._id) return res.redirect('/user/' + req.user._id);
  if (!userId) return res.redirect('/');

  var userIsListOwner = false;
  if (req.user && req.user._id && (req.params.userId == req.user._id))
    userIsListOwner = true;

  // GET OWNER INFORMATION
  var ownerInfoPromise = Export.getOwnerInfo(req, userId, userIsListOwner);

  // GET USER INFORMATION
  var userInfoPromise = Export.getUserInfo(req);


  // RESPOND TO CLIENT
  Promise.all([ownerInfoPromise, userInfoPromise])
  .then(function (values) {
    res.render('user', {
      user        : req.user || null,
      lists       : values[1] && values[1].lists || [],
      owner       : values[0] && values[0].user  || null,
      ownerLists  : values[0] && values[0].lists || []
    });
  })
  .catch(function (err) {
    console.log(err);
    return res.redirect('/home');
  });
};

Export.getUserInfo = function (req) {
  return new Promise(function (resolve, reject) {
    if (!req.user || !req.user._id) return resolve();

    List.find({owner: req.user._id})
    .populate({path: 'posts', options: { sort: { 'created_date': -1 } }})
    .exec(function(error, result) {
      User.findById(req.user._id, function (err, user) {
        if (err) return reject(err);

        resolve({
          lists: result || [],
          user: user
        })
      })
    })
  });
};

Export.getOwnerInfo = function (req, userId, userIsListOwner) {
  return new Promise(function (resolve, reject) {
    if (userIsListOwner) return resolve();

    List.find({owner: userId})
    .populate({path: 'posts', options: { sort: { 'created_date': -1 } }})
    .exec(function(error, result) {
      User.findById(userId, function (err, user) {
        if (err) return reject(err);

        if (result && !userIsListOwner) {
          result = result.filter(function (list) {
            if (list.isPrivate || (!list.posts || list.posts.length < 1)) return false;
            return true;
          })
        };

        resolve({
          lists: result,
          user: user
        })
      })
    })
  });
}
