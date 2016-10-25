var Exports  = module.exports = {},
    request  = require('request'),
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Exports.getHeader = function (req, res) {
  var uri = req.body.uri;

  request(uri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var title = body.match(/<title[^>]*>([^<]+)<\/title>/)[1];
      res.json(title);
    } else {
      res.status(400).send('Not found');
    }
  })
};

Exports.getImage = function (req, res) {

};

Exports.globalSearch = function (req, res) {
  var query = decodeURIComponent(req.params.query);
  query = query.replace('.com', '');

  var userPromise = new Promise(function (resolve, reject) {
    User.find({ $text: { $search: query }}, 'displayName email image',
        function (err, users) {

      if (err) return reject(err);
      return resolve(users);
    });
  });

  var listPromise = new Promise(function (resolve, reject) {
    List.find({ $text: { $search: query }, 'isPrivate': false }, 'title owner',
        function (err, lists) {

      if (err) return reject(err);
      return resolve(lists);
    });
  });

  var postPromise = new Promise(function (resolve, reject) {
    Post.find({ $text: { $search: query }, 'isPrivate': false }, 'title link text owner',
        function (err, posts) {

      if (err) return reject(err);
      return resolve(posts);
    });
  });

  Promise.all([userPromise, listPromise, postPromise])
  .then(function (values) {
    return res.json({
      users: values[0],
      posts: values[2],
      lists: values[1]
    });
  })
  .catch(function (err) {
    return res.status(500).json(err);
  })
};
