var Exports  = module.exports = {},
    List     = require('../models/ListModel');

Exports.create = function (req, res) {
  console.log('BODY', req.body);
  var newList = new List(req.body);

  newList.save(function (err, result) {
    if (err) return res.status(500).send(err);
    return res.json(result);
  })
}
