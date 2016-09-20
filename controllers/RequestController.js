var Exports  = module.exports = {},
    request  = require('request');

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
