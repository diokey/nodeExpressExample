var express = require('express');

var app = express();

app.set('view engine','ejs');

app.get('/',function(req, res) {
    res.render('index',{
        isAuthenticated : false,
        user : null
    });
});

app.get('/login',function(res,res) {
    res.render('login');
});

var port = process.env.PORT || 1337;

app.listen(port, function () {
    console.log('Started node server at http://127.0.0.1:'+port); 
});
