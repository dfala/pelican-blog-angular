var exports = module.exports = {};
    Keys    = require('../config/keys.js').amazon,
    User    = require('../models/UserModel'),
    AWS     = require('aws-sdk'),
    request = require('request').defaults({ encoding: null });

// AMAZON CONFIG
AWS.config.update({
  accessKeyId: Keys.amazonAccess,
  secretAccessKey: Keys.amazonSecret,
  region: Keys.amazonRegion
});

var s3 = new AWS.S3();

exports.downloadImage = function (uri, userId, extension) {
  request.get(uri, function (error, response, body) {
    if (error) return console.log(error);

    var params = {
        Bucket: Keys.amazonBucket
      , Key: userId + '.' + extension
      , Body: new Buffer(body)
      , ContentType: 'image/' + extension
      , ACL: 'public-read'
    };

    s3.upload(params, function (err, img) {
      if (err) return console.error("S3 UPLOAD ERROR", err);
      User.update({_id: userId}, {
        image: img.Location
      }, function (err) {
        if (err) console.log(err);
      })
    });

  });
};

exports.downloadMetaImage = function (uri, extension) {
  return new Promise(function (resolve, reject) {
    request.get(uri, function (error, response, body) {
      if (error) return console.log(error);

      var params = {
          Bucket: Keys.amazonBucket
        , Key: uri + '.' + extension
        , Body: new Buffer(body)
        , ContentType: 'image/' + extension
        , ACL: 'public-read'
      };

      s3.upload(params, function (err, img) {
        if (err) return console.error("S3 UPLOAD ERROR", err);
        return resolve(img.Location);
      });
    });
  });
};
