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
    http        = require('http'),
    EmailCtrl   = require('./controllers/EmailController');

if (keys.env !== "DEVELOPMENT") {
  var https       = require('https'),
      fs          = require('fs'),
      privateKey  = fs.readFileSync('./config/server.enc.key', 'utf8'),
      certificate = fs.readFileSync('./config/server.crt', 'utf8'),
      ca          = fs.readFileSync('./config/bundle.crt', 'utf8'),
      credentials = {key: privateKey, cert: certificate, ca: ca, passphrase: require('./config/keys.js').certKey};
};

process.env.NODE_ENV = require('./config/keys.js').env;

// App definition
var app = express();
app.set('view engine', 'ejs');

require('./config/passport')(passport);

// Middleware
app.use(session({
    secret: keys.sessionSecret,
    resave: true,
    saveUninitialized: true,
    maxAge : 3600000 * 24 * 365
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, 'app')));
app.use(favicon(path.join(__dirname,'app','css','favicon.ico')));


require('./controllers/API.js')(app);
require('./controllers/Routes.js')(app, passport);

// Connections
if (keys.env === 'DEVELOPMENT') { var portNum = 3000; } else { var portNum = 80; }

var mongooseUri = keys.db;
mongoose.connect(mongooseUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Mongoose uri:', mongooseUri);
  EmailCtrl.createNotificationEmail();
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

  var http = require('http');
  http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(80);

  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, function () {
    console.log('HTTPS server listening on port: 443 in ' + keys.env + ' mode.');
  });

}
