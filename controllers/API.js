var List = require('./ListController'),
    Post = require('./PostController');

module.exports = function (app) {
  app.post('/api/list', List.create);
  app.put('/api/list/privacy/:listId', List.updatePrivacy);
  app.post('/api/post', Post.create);
  app.put('/api/post/:postId', Post.update);
};
