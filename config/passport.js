// config/passport.js

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    Keys             = require('./keys.js'),
    ImageController  = require('../controllers/ImageController');

// load up the user model
var User       = require('../models/UserModel'),
    Training   = require('../models/TrainingModel');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use('homeLogin', new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : Keys.facebookAuth.clientID,
        clientSecret    : Keys.facebookAuth.clientSecret,
        callbackURL     : Keys.facebookAuth.callbackURL,
        profileFields   : ['email', 'displayName', 'name', 'picture']
    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
      performAuth(token, refreshToken, profile, done);
    }));

    passport.use('extensionLogin', new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : Keys.facebookAuth.clientID,
        clientSecret    : Keys.facebookAuth.clientSecret,
        callbackURL     : Keys.facebookAuth.extensionCallbackUrl,
        profileFields   : ['email', 'displayName', 'name', 'picture']
    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
      performAuth(token, refreshToken, profile, done);
    }));

    passport.use('appLogin', new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : Keys.facebookAuth.clientID,
        clientSecret    : Keys.facebookAuth.clientSecret,
        callbackURL     : Keys.facebookAuth.appCallbackUrl,
        profileFields   : ['email', 'displayName', 'name', 'picture']
    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
      performAuth(token, refreshToken, profile, done);
    }));

};

function performAuth (token, refreshToken, profile, done) {
  // asynchronous
  process.nextTick(function() {

      // find the user in the database based on their facebook id
      User.findOne({ 'facebookId' : profile.id }, function(err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err) return done(err);

          // if the user is found, then log them in
          if (user) {
              return done(null, user); // user found, return that user
          } else {
              // if there is no user found with that facebook id, create them
              var newUser            = new User();
              // console.log(profile);

              // set all of the facebook information in our user model
              newUser.facebookId    = profile.id; // set the users facebook id
              newUser.facebookToken = token; // we will save the token that facebook provides to the user
              newUser.displayName   = profile.displayName; // look at the passport user profile to see how names are returned
              newUser.givenName     = profile.name && profile.name.givenName || profile.displayName;
              newUser.email         = profile.emails && profile.emails[0] && profile.emails[0].value || null;

              // save our user to the database
              newUser.save(function(err, user) {
                  if (err) throw err;

                  ImageController.downloadImage(profile.photos && profile.photos[0].value, user._id, 'jpg');
                  new Promise(function (resolve, reject) {
                    var newTraining = new Training({ userId: user._id});
                    newTraining.save(function (err, result) {
                      if (err) return reject(err);
                      return resolve(result);
                    })
                  })
                  .then(function () {
                    // if successful at creating user, return the new user
                    return done(null, newUser);
                  })
              });
          }

      });
  });
};
