var Exports  = module.exports = {},
    request  = require('request'),
    cheerio  = require('cheerio'),
    ImgCtrl  = require('./ImageController'),
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel'),
    Post     = require('../models/PostModel');

Exports.getHeader = function (req, res) {
  var uri = req.body.uri;

  request(uri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      try {
        var tempArr = body.match(/<title[^>]*>([^<]+)<\/title>/);
        if (tempArr) {
          var title = body.match(/<title[^>]*>([^<]+)<\/title>/)[1];
        } else {
          var title = "";
        }
        console.log(title);
      } catch (e) {
        console.log(e);
        var title = "";
      }

      res.json(title);
    } else {
      res.status(response && response.statusCode || 404).send("Not found");
    }
  })
};

function validateUrl (link) {
  if (link.indexOf('http') < 0) link = 'http://' + link;
  var re = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
  var isUrl = link.match(re);
  if (!isUrl) throw 'Not a valid URL';
  return link;
}

Exports.getImage = function (uri) {
  return new Promise(function (resolve, reject) {
    if (!uri) return resolve('');

    request(uri, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
        var facebookImage = $('meta[property="og:image"]').attr('content');

        // IF NOT FACEBOOK TRY TWITTER
        if (!facebookImage) {
          var facebookImage = $('meta[property="twitter:image"]').attr('content');
        }

        // IF NO FACEBOOK OR TWITTER IMAGE, SORRY!
        if (!facebookImage) return resolve('');

        var fileUrl = facebookImage.split("?")[0];
        var extension = fileUrl.substr(fileUrl.lastIndexOf('.')+1);

        // TESTING FOR VALID URL
        try {
          facebookImage = validateUrl(facebookImage);
        } catch (err) {
          return reject(err);
        }


        // UPLOAD IMAGE TO AMAZON
        ImgCtrl.downloadMetaImage(facebookImage, extension)
        .then(function (img) {
          return resolve(img);
        })
        .catch(function (err) {
          return reject(err);
        })

      } else {
        return reject(error);
      }
    })
  });
};

Exports.getImageTemp = function (req, res) {
  Post.find({})
  .then(function (posts) {
    posts.forEach(function (post) {
      if (!post) return;
      // res.status(404).send('No post found.');
      if (!post.link) return;
      // res.send('No post link');
      if (post.img) return;
      // res.send('Already has image');

      var uri = post.link;

      request(uri, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          $ = cheerio.load(body);
          var facebookImage = $('meta[property="og:image"]').attr('content');
          if (!facebookImage) return;
          // res.send('No facebook image');

          var fileUrl = facebookImage.split("?")[0];
          var extension = fileUrl.substr(fileUrl.lastIndexOf('.')+1);

          ImgCtrl.downloadMetaImage(facebookImage, extension)
          .then(function (img) {
            post.img = img;
            post.save(function (err, result) {
              if (err) return res.status(400).send(err);
              return;
              // res.json(result);
            })
          })
          .catch(function (err) {
            return;
            // res.status(400).send(err);
          })

        } else {
          return;
          // res.status(400).send(err);
        }
      })

    })
  })
  .catch(function (err) {
    return;
    // res.status(500).send(err);
  })
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
