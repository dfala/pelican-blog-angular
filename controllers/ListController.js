var Exports  = module.exports = {},
    List     = require('../models/ListModel');

Exports.create = function (req, res) {
  var newList = new List(req.body);
  newList.owner = req.user._id;

  newList.save(function (err, result) {
    if (err) return res.status(500).send(err);
    return res.json(result);
  })
}
