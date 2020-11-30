const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

const app = express();

// Passport Config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect('mongodb://localhost/my_virtual_store', {useNewUrlParser: true});

// Express session
app.use(session({
    secret: 'g67a adgg89g',
    resave: false,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());


//routes
app.use('/api/store', require('./routes/store'));
app.use('/api/users', require('./routes/users'));

module.exports = app;
