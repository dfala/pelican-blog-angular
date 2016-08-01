var exports = module.exports = {};
    Keys    = require('../config/keys.js'),
    User    = require('../models/UserModel'),
    fs      = require('fs'),
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
      console.log(img.Location)
      if (err) return console.error(err);
      User.update({_id: userId}, {
        image: img.Location
      }, function (err) {
        console.log(arguments);
      })
    });

  });
};
