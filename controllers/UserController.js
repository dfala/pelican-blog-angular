var Export   = module.exports = {},
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel'),
    Training = require('../models/TrainingModel');

Export.userView = function (req, res) {
  // VALIDATION
  var userId = req.params.userId;
  if (!userId && req.user && req.user._id) return res.redirect('/user/' + req.user._id);
  if (!userId) return res.redirect('/');

  var userIsListOwner = false;
  if (req.user && req.user._id && (req.params.userId == req.user._id))
    userIsListOwner = true;


  // GET TRAINING INFORMATION
  var TrainingStatusPromise = new Promise(function (resolve, reject) {
    if (userIsListOwner && new Date(req.user.created_date) < (new Date().getTime() + (24 * 60 * 60 * 1000))) {
      Training.findOne({ userId: req.user._id }, function (err, result) {
        if (err) return reject(err);
        return resolve(result);
      })
    } else {
      return resolve(null);
    }
  })

  // GET OWNER INFORMATION
  var ownerInfoPromise = Export.getOwnerInfo(req, userId, userIsListOwner);

  // GET USER INFORMATION
  var userInfoPromise = Export.getUserInfo(req);

  // RESPOND TO CLIENT
  Promise.all([ownerInfoPromise, userInfoPromise, TrainingStatusPromise])
  .then(function (values) {
    res.render('user', {
      user        : req.user || null,
      lists       : values[1] && values[1].lists || [],
      owner       : values[0] && values[0].user  || null,
      ownerLists  : values[0] && values[0].lists || [],
      training    : values[2] || null
    });
  })
  .catch(function (err) {
    if (err) console.log(err);
    return res.redirect('/home');
  });
};

Export.getUserInfo = function (req) {
  return new Promise(function (resolve, reject) {
    if (!req.user || !req.user._id) return resolve();

    List.find({owner: req.user._id})
    .sort('isPrivate')
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

    List.find({owner: userId, isPrivate: false})
    .populate({path: 'posts', options: { sort: { 'created_date': -1 } }})
    .exec(function(error, result) {
      User.findById(userId, function (err, user) {
        if (err) return reject(err);

        resolve({
          lists: result,
          user: user
        })
      })
    })
  });
}
