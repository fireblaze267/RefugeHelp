var express= require('express');
var bodyParser= require('body-parser');
var load= require('express-load');
var session = require('express-session');

module.exports = function(){
    var app= express();
    app.use('/public',express.static('public'));
    app.set('view engine', 'ejs');
    app.use(session({
        secret: 'rh',
        resave: true,
        saveUninitialized: true
    }));
    app.use(bodyParser.urlencoded({extended:true}));
    load('routes').then('infra').into(app);
    return app;
}