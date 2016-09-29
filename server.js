var express     = require('express'),
    favicon     = require('serve-favicon'),
    bodyParser  = require('body-parser'),
    cors        = require('cors'),
    mongoose    = require('mongoose'),
    session     = require('express-session'),
    passport    = require('passport'),
    CronJob     = require('cron').CronJob,
    ejs         = require('ejs'),
    path        = require('path'),
    keys        = require('./config/keys.js').connections,
    http        = require('http');

if (keys.env !== "DEVELOPMENT") {
  var https       = require('https'),
      fs          = require('fs'),
      privateKey  = fs.readFileSync('./config/server.enc.key', 'utf8'),
      certificate = fs.readFileSync('./config/server.crt', 'utf8'),
      credentials = {key: privateKey, cert: certificate, passphrase: require('./config/keys.js').certKey};
};

// App definition
var app = express();
app.set('view engine', 'ejs');

require('./config/passport')(passport);

// Middleware
app.use(session({
    secret: 'super mega secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, 'app')));
app.use(favicon(path.join(__dirname,'app','css','favicon.ico')));


require('./controllers/Routes.js')(app, passport);
require('./controllers/API.js')(app);

// Connections
if (keys.env === 'DEVELOPMENT') { var portNum = 3000; } else { var portNum = 80; }

var mongooseUri = keys.db;
mongoose.connect(mongooseUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Mongoose uri:', mongooseUri);
});


// var server = app.listen(portNum, function () {
//     console.log('Server listening on port: ' + portNum, 'in ' + keys.env + ' mode.');
// });





if (keys.env === 'DEVELOPMENT') {

  var httpServer = http.createServer(app);
  httpServer.listen(portNum, function () {
    console.log('HTTP server listening on port: ' + portNum, 'in ' + keys.env + ' mode.');
  });

} else {

  var httpServer = express.createServer();
  httpServer.get('*', function (req, res) {
      res.redirect('https://thepelicanblog.com' + req.url)
  })
  httpServer.listen(8080);
  
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, function () {
    console.log('HTTPS server listening on port: 443 in ' + keys.env + ' mode.');
  });

}
