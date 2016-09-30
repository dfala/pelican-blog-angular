var Pages    = require('./Pages.js'),
    UserCtrl = require('./UserController'),
    keys     = require('../config/keys');

module.exports = function (app, passport) {
  app.get('/', Pages.index);
  app.get('/home', Pages.home);
  app.get('/discover', Pages.discover);
  app.get('/discovers', Pages.discover);
  app.get('/user/:userId?', UserCtrl.userView);
  app.get('/list/:listId/:userId', Pages.listView);
  app.get('/bookmark', Pages.bookmark);

  // AUTH --> home
  app.get('/auth/facebook', passport.authenticate('homeLogin', { scope : 'email' }));

  app.get('/auth/facebook/callback', passport.authenticate('homeLogin', {
      successRedirect : '/user/',
      failureRedirect : '/failed'
    })
  );

  // AUTH --> bookmark
  app.get('/auth/alternate-facebook', passport.authenticate('extensionLogin', { scope : 'email' }));

  app.get('/auth/alternate-facebook/bookmark', passport.authenticate('extensionLogin', {
      successRedirect : '/bookmark',
      failureRedirect : '/failed'
    })
  );

  // LOG OUT
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // 404 NOT FOUND
  app.use(function(req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      return res.render('404', { url: req.url });
    }

    // respond with json
    if (req.accepts('json')) {
      return res.send({ error: 'Not found' });
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
};
