var express     = require('express'),
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
    socketio    = require('socket.io');

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


require('./controllers/Routes.js')(app, passport);
require('./controllers/API.js')(app);

// Connections
if (keys.env == 'DEVELOPMENT') { var portNum = 3000; } else { var portNum = 80; }

var mongooseUri = keys.db;
mongoose.connect(mongooseUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Mongoose uri:', mongooseUri);
});


var server = app.listen(portNum, function () {
    console.log('Server listening on port: ' + portNum, 'in ' + keys.env + ' mode.');
});

// SOCKET IO
var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('updated post', function(message) {
    console.log('message: ' + message);
  });
});
