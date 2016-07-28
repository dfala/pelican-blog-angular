var Exports  = module.exports = {},
    User     = require('../models/UserModel'),
    List     = require('../models/ListModel');

Exports.create = function (req, res) {
  var newList = new List(req.body);
  newList.owner = req.user._id;

  newList.save()
  .then(function (list) {
    User.findByIdAndUpdate(
      req.user._id,
      {$push: {"lists": list._id}},
      {safe: true, upsert: true},
      function(err, model) {
        console.log(err);
      }
    );

    res.json(list);
  })
  .catch(function(err) {
    res.status(500).send(err);
  })
}
