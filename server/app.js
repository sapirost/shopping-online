const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Connect to MongoDB
mongoose.connect('mongodb://localhost/my_virtual_store', { useNewUrlParser: true });

// Create the Express application
const app = express();

app.use(cors());

app.use(cors({origin: [/localhost/i]}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

// Express session
app.use(session({
    secret: 'g67a adgg89g',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Passport Config
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, _res, next) => {
//     console.log('session: ', req.session);
//     console.log('user: ', req.user);
//     next();
// })

//routes
app.use('/api/store', require('./routes/store'));
app.use('/api/users', require('./routes/users'));

module.exports = app;
