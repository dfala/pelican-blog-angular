var Exports       = module.exports = {},
    User          = require('../models/UserModel'),
    Notification  = require('../models/NotificationModel');

Exports.create = function (data, userId) {
  var promise = new Promise(function (resolve, reject) {
    if (data.user === userId) return resolve('No notification needed.');
    var newNotification = new Notification(data);

    newNotification.save(function (err, result) {
      if (err) return reject(err);
      return resolve(result);
    });
  });

  return promise;
};

Exports.get = function (req, res) {
  if (!req.user._id) return res.status(401).send('User is not logged in.');

  Notification.find({ 'user': req.user._id, 'dismissed': false })
  .sort('created_date')
  .populate({ path: 'created_by', select: 'displayName _id image' })
  .exec(function (err, result) {
    if (err) return res.status(400).json(err);
    return res.json(result);
  })
};

Exports.dismissNotification = function (req, res) {
  Notification.findOne({ "_id": req.params.notificationId}, function (err, notification) {
    if (err) return res.status(404).send('Notification not found');
    notification.dismissed = true;
    notification.save(function (err, result) {
      if (err) return res.status(500).send(err);
      return res.json(result);
    })
  })
};
