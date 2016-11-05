var List          = require('./ListController'),
    Post          = require('./PostController'),
    Vanity        = require('./MetricController'),
    App           = require('./AppController'),
    Request       = require('./RequestController'),
    Training      = require('./TrainingController'),
    Comment       = require('./CommentController'),
    Notification  = require('./NotificationController'),
    Emails        = require('./EmailController');

module.exports = function (app) {
  // LIST
  app.post('/api/list', List.create);
  app.put('/api/list/privacy/:listId', List.updatePrivacy);
  app.delete('/api/list/:listId', List.deleteList);
  app.put('/api/list/rename/:listId', List.renameList);

  // POST
  app.get('/api/posts', App.getPosts);
  app.get('/api/more-posts/:start', App.getMorePosts);
  app.get('/api/post/:postId', App.getPost);
  app.post('/api/post', Post.create);
  app.put('/api/post/:postId', Post.update);
  app.delete('/api/post/:listId/:postId', Post.delete);
  app.put('/api/like-post/:postId', Post.like);

  // VANITY
  app.put('/api/post-vanity/:postId', Vanity.trackConsume);

  // COMMENTS
  app.get('/api/comments/:postId', Comment.get);
  app.post('/api/comment', Comment.create);

  // NOTIFICATIONS
  app.get('/api/notifications', Notification.get);
  app.put('/api/dismiss-notification/:notificationId', Notification.dismissNotification);
  app.put('/api/notifications/viewed', Notification.viewedNotifications);

  // EMAILS
  // app.put('/api/emails/notifications', Emails.createNotificationEmail);

  // USERS
  app.get('/api/users', App.getUsers);
  app.get('/api/user-posts/:userId', App.getUserPosts);

  // OTHER
  app.post('/api/request/header', Request.getHeader);
  // app.post('/api/request/image', Request.getImageTemp);
  app.get('/api/global-search/:query', Request.globalSearch);
  app.put('/api/training/new-user-onboard', Training.newUserOnBoardCompleted);
};
