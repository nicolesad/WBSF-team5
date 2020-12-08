const express = require('express'),
    pug = require('pug'),
    bodyParser = require('body-parser'),
    path = require('path'),
    routes = require('./routes/routes'),
    app = express(),
    request = require('request'),
    cors = require('cors'),
    querystring = require('querystring'),
    cookieParser = require('cookie-parser'),
    urlencodedParser = bodyParser.urlencoded({extended:false}),
    expressSession = require('express-session');

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.use(expressSession({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', urlencodedParser, routes.postLogin);
app.get('/register', routes.register);
app.get('/profile', routes.checkAuth, routes.profile);
console.log('Listening on 8888');
app.listen(8888);




