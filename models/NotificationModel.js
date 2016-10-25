var mongoose = require('mongoose'),
    shortid  = require('shortid');

var NotificationSchema = new mongoose.Schema({
  _id           : { type: String, 'default': shortid.generate },
  type          : { type: String, required: false },
  user          : { type: String, ref: 'User' },
  created_by    : { type: String, ref: 'User' },
  message       : { type: String, required: true },
  action        : { type: String, required: false },
  created_date  : { type: Date, default: Date.now },
  viewed        : { type: Boolean, default: false },
  dismissed     : { type: Boolean, default: false },
  emailSent     : { type: Boolean, default: false }
});

// TYPES:
// ['comment', 'like']

module.exports = mongoose.model('Notification', NotificationSchema);
