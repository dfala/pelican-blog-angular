// config/passport.js

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    Keys             = require('./keys.js');

// load up the user model
var User       = require('../models/UserModel');

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

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : Keys.facebookAuth.clientID,
        clientSecret    : Keys.facebookAuth.clientSecret,
        callbackURL     : Keys.facebookAuth.callbackURL,
        profileFields   : ['email', 'picture']
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

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

                    // set all of the facebook information in our user model
                    newUser.facebookId    = profile.id; // set the users facebook id
                    newUser.facebookToken = token; // we will save the token that facebook provides to the user
                    newUser.name          = profile.displayName; // look at the passport user profile to see how names are returned
                    newUser.email         = profile.emails && profile.emails[0] && profile.emails[0].value || null;

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err) throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

};
