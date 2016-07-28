var List = require('./ListController');

module.exports = function (app) {
  app.post('/api/list', List.create);
};
