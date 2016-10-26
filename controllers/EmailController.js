var Exports             = module.exports = {},
    postmark            = require("postmark"),
    CronJob 		        = require('cron').CronJob,
    keys                = require('../config/keys'),
    client              = new postmark.Client(keys.emailKey),
    emailNotification   = require('../emails/notificationEmail.js'),
    Post                = require('../models/PostModel'),
    User                = require('../models/UserModel'),
    Notification        = require('../models/NotificationModel');

Exports.send = function (email, recipientEmail, subject) {
  client.sendEmail({
      "From": "admin@thepelicanblog.com",
      "To": recipientEmail,
      "Subject": subject,
      "TextBody": "Please enable html to see your email.",
      "HtmlBody": email
  }, function (err, result) {
    console.log(arguments);
  })
};

Exports.createNotificationEmail = function () {
  console.log('Email notifications cron job is on.');

  var cron = new CronJob('00 00 07 * * *', function() {
    new Promise(function (resolve, reject) {
      // LET'S FIND THE DISCOVERY SINCE
      // THEY ARE THE SAME FOR ALL USERS
      Post.find({isPrivate: false})
      .sort('-created_date')
      .limit(5)
      .populate({ path: 'owner', select: 'image' })
      .exec(function (err, posts) {
        if (err) return reject(err);
        return resolve(posts);
      })
    })
    .then(function (discover) {
      // ONLY SEND ONE EMAIL PER USER
      User.find({})
      .then(function (users) {
        users.forEach(function (user) {
          // GET THE NOTIFICATIONS FOR THAT USER
          Notification.find({ 'user': user._id, 'emailSent': false, 'dismissed': false })
          .sort('-created_date')
          .populate({ path: 'created_by', select: 'image' })
          .exec(function (err, notifications) {
            if (err) return console.error(err);
            if (!notifications || !notifications.length) return;
            if (!user.email) return;

            // CREATE AND SEND FROM TEMPLATE
            var email = emailNotification.template(notifications, discover);

            Exports.send(email, user.email, 'You got updates | The Pelican Blog');

            // UPDATE NOTIFICATION EMAIL STATUS
            notifications.forEach(function (n) {
              n.emailSent = true;
              n.save();
            })
          })
        })
      })
    })
  }, null, true, 'America/Denver')
};
