// =======================================
// IMPORTS
// =======================================
// NPM imports
const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session')
const flash = require('connect-flash')
// Config imports
try{var { connection, conn } = require('./public/js/server')}
catch (e) {
    console.log('Could not import server. This probably means you\'re not workin locally');
    console.log(e)
}

const {Book, Comment, User} = require('./public/js/model')

// =======================================
// DEVELOPPEMENT 
// =======================================
// app.use(morgan('tiny'))
const seed = require('./utils/seed')
// seed()
// =======================================
// Express Config
// =======================================
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
// Body parser config
app.use(express.urlencoded({extended: true}));
app.use(express.json())


// Express Session Config
app.use(expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

// You need to use connect-flash before passport
app.use(flash());


// =======================================
// Passport Config
// =======================================
app.use(passport.initialize());
app.use(passport.session()); // Alows persistant sessions
passport.serializeUser(User.serializeUser()); // What data should be stored in session 
passport.deserializeUser(User.deserializeUser()); // Get the user data from the stored session
passport.use(new LocalStrategy(User.authenticate())); // Use the local strategy



// =======================================
// Routes config
// =======================================
//Route Imports
const comicRoutes = require('./routes/comics')
const commentsRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index')
const authRoutes = require('./routes/auth')

// State Config (look it up)
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash('success')
    next();
})


// Use routes
app.use('/', indexRoutes)
app.use('/',authRoutes)
app.use("/comics",comicRoutes)
app.use('/comics/:id/comments',commentsRoutes)

app.listen(process.env.PORT || 3000, () => console.log('server is up'))