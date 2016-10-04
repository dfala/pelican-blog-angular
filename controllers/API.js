var List     = require('./ListController'),
    Post     = require('./PostController'),
    App      = require('./AppController'),
    Request  = require('./RequestController'),
    Training = require('./TrainingController');

module.exports = function (app) {
  //LIST
  app.post('/api/list', List.create);
  app.put('/api/list/privacy/:listId', List.updatePrivacy);
  app.delete('/api/list/:listId', List.deleteList);
  app.put('/api/list/rename/:listId', List.renameList);

  //POST
  app.get('/api/posts', App.getPosts);
  app.get('/api/post/:postId', App.get);
  app.post('/api/post', Post.create);
  app.put('/api/post/:postId', Post.update);
  app.delete('/api/post/:listId/:postId', Post.delete);

  // OTHER
  app.post('/api/site-header', Request.getHeader);
  app.get('/api/global-search/:query', Request.globalSearch);
  app.put('/api/training/new-user-onboard', Training.newUserOnBoardCompleted);
};
