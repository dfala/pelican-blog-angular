var List = require('./ListController'),
    Post = require('./PostController');

module.exports = function (app) {
  app.post('/api/list', List.create);
  app.post('/api/post', Post.create);
};
