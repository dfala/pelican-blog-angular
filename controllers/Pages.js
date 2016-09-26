var Routes   = module.exports = {},
    UserCtrl = require('./UserController'),
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Routes.index = function (req, res) {
  if (req.user && req.user._id) return res.redirect('/user/' + req.user._id);
  return res.redirect('/home');
};

Routes.home = function (req, res) {
  List.find({owner: req.user && req.user._id || null})
  .then(function(lists) {
    Post.find({isPrivate: false})
    .sort('-created_date')
    .limit(20)
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

Routes.discover = function (req, res) {
  if (!req.user || !req.user._id) return res.redirect('/home');

  List.find({isPrivate: false})
  .limit(20)
  .exec(function (err, lists) {
    Post.find({isPrivate: false})
    .sort('-created_date')
    .limit(20)
    .populate({ path: 'owner', select: 'displayName _id lists image' })
    .populate({ path: 'parentList', select: 'title _id' })
    .exec(function (err, posts) {
      res.render('discover', {
        user: req.user || null,
        owner: null,
        ownerLists: null,
        lists: lists || [],
        posts: posts || []
      })
    })
  });
};

Routes.bookmark = function (req, res) {
  if (!req.user || !req.user._id)
    return res.render('extension', {
      user  : null,
      lists : null
    });

  List.find({owner: req.user._id})
  .populate({path: 'posts', options: { sort: { 'created_date': -1 } }})
  .exec(function(error, result) {
    if (error) return res.status(400).json(err);

    var passedUser = {
      _id: req.user._id,
    };

    res.render('extension', {
      user  : passedUser || null,
      lists : result || []
    });
  })
};

Routes.listView = function (req, res) {
  var userId = req.params.userId,
      listId = req.params.listId,
      userIsListOwner = false;

  if (req.user && req.user._id && (req.params.userId == req.user._id)) userIsListOwner = true;

  // TODO LIST PROMISE IS NO LONGER NECESSARY -- REMOVE
  var listsPromise = new Promise(function (resolve, reject) {
    List.find({_id: listId})
    .populate({path: 'posts', options: { sort: { 'created_date': -1 } }})
    .exec(function(error, result) {
      if (error) return reject(err);
      if (result.isPrivate && userIsListOwner) res.redirect('/user/' + userId);

      if (!userIsListOwner) {
        result = result.filter(function (list) {
          if (list.isPrivate || (!list.posts || list.posts.length < 1)) return false;
          return true;
        })
      };

      return resolve(result);
    })
  });

  // GET USER INFORMATION FOR MENU
  var userInfoPromise = UserCtrl.getUserInfo(req);
  var ownerInfoPromise = new Promise(function (resolve, reject) {
    if (userIsListOwner) return resolve(null);
    UserCtrl.getOwnerInfo(req, userId, false)
    .then(function (result) {
      return resolve(result);
    })
    .catch(function (err) {
      return reject(err);
    })
  })


  Promise.all([listsPromise, userInfoPromise, ownerInfoPromise])
  .then(function (results) {
    res.render('user', {
      user: req.user || null,
      lists: results[1] && results[1].lists || null,
      list: results[0],
      owner: results[2] && results[2].user || null,
      ownerLists: results[2] && results[2].lists || null
    });
  })
  .catch(function (err) {
    console.log(err);
    return res.redirect('/home');
  })
};
