var Export   = module.exports = {},
    Training = require('../models/TrainingModel');

Export.newUserOnBoardCompleted = function (req, res) {
  Training.findOne({userId: req.user._id}, function (err, training) {
    if (err) return res.status(500).send(err);

    training.newUser = true;
    training.save(function (err, result) {
      if (err) return res.status(500).send(err);
      return res.json(result);
    })
  })
};
