var Pages    = require('./Pages.js'),
    UserCtrl = require('./UserController'),
    keys     = require('../config/keys');

module.exports = function (app, passport) {
  app.get('/', Pages.index);
  app.get('/home', Pages.home);
  app.get('/discover', Pages.discover);
  app.get('/user/:userId?', UserCtrl.userView);
  app.get('/list/:listId/:userId', Pages.listView);
  app.get('/bookmark', Pages.bookmark);

  // AUTH
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect : '/user/',
      failureRedirect : '/failed'
    })
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
};
