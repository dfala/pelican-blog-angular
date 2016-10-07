var Routes   = module.exports = {},
    UserCtrl = require('./UserController'),
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Routes.index = function (req, res) {
  if (req.user && req.user._id) return res.redirect('/user/' + req.user._id);
  return res.render('index'); //res.redirect('/home');
};

Routes.home = function (req, res) {
  // TODO: Consider deprecating this route
  return res.render('index');
};

Routes.discover = function (req, res) {
  if (!req.user || !req.user._id) return res.redirect('/home');

  var userInfoPromise = UserCtrl.getUserInfo(req);
  var feedPromise = new Promise(function (resolve, reject) {
    Post.find({isPrivate: false})
    .sort('-created_date')
    .limit(40)
    .populate({ path: 'owner', select: 'displayName _id lists image' })
    .populate({ path: 'parentList', select: 'title _id' })
    .exec(function (err, posts) {
      if (err) return reject(err);
      return resolve(posts);
    })
  })

  Promise.all([userInfoPromise, feedPromise])
  .then(function (results) {
    res.render('discover', {
      user:       req.user || null,
      owner:      null,
      ownerLists: null,
      lists:      results[0].lists  || [],
      posts:      results[1] || []
    })
  })
  .catch(function (err) {
    console.log('Error loading discover feed: ', err);
    res.redirect('/user/' + req.user._id);
  })

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
    if (error) {
      console.log(error)
      return res.redirect('/home');
    }

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
      if (err) console.log(err);
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
      ownerLists: results[2] && results[2].lists || null,
      training: null
    });
  })
  .catch(function (err) {
    if (err) console.log(err);
    return res.redirect('/home');
  })
};
