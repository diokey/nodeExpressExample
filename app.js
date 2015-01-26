var express = require('express');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(expressSession({
    secret : process.env.SESSION || 'secret',
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

function verifyCredentials (username, password, done) {
    //i'm just hard coding authentification. 
//In a real world scenario, you would talk to a db

    if ( username === password ) {
        done(null, {id : username, name : username });
    }else {
        done(null,null);
    }
}

//passportlocal
passport.use(new passportLocal.Strategy(verifyCredentials));

//passporthttp
passport.use(new passportHttp.BasicStrategy(verifyCredentials));
    
passport.serializeUser( function(user, done){
    done(null, user.id);
});

passport.deserializeUser( function(id, done) {
    done(null, {id : id, name : id});
});

function ensureAutenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send(403);
    }
}

app.get('/',function(req, res) {
    res.render('index',{
        isAuthenticated : req.isAuthenticated(),
        user : req.user
    });
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate('local') , function(req, res){
    res.redirect('/');
});

app.get('/logout',function (req, res) {
   req.logout(); 

   res.redirect('/');
});

//every request in api, authenticates with basic strategy
app.use('/api',
        passport.authenticate('basic',{session : false}));

app.get('/api/data', ensureAutenticated, function(req, res) {
   res.json([
    {value : 'foo'},
    {value : 'bar'},
    {value : 'olivier'},
    {value : 'diokey'}
   ]);
});

var port = process.env.PORT || 1337;

app.listen(port, function () {
    console.log('Started node server at http://127.0.0.1:'+port); 
});
