var Pages = require('./Pages.js');

module.exports = function (app) {
  app.get('/', Pages.index);
};
