const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes');
const app = express();
const request = require('request');
const cors = require('cors');
let querystring = require('querystring');
const cookieParser = require('cookie-parser');
const spotify_routes = require("./routes/spotify_routes");
const passport = require("express");
let session = require("express-session");
let client_id = '8957a412905c4361bfeae278e8bd261c';
let client_secret = '94f5eaa8eee74fba876f7ed029b988a4';
let redirect_uri = 'localhost:8888/callback';

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '/public')));
//
// app.use(express.static(__dirname + '/public'))
//     .use(cors())
//     .use(cookieParser());

app.get('/login', spotify_routes.login);
app.get('/callback', spotify_routes.callback);
app.get('/refresh_token', spotify_routes.refresh_token);

// app.get('/', routes.index);
// app.get('/login', routes.login);
app.get('/register', routes.register);
console.log('Listening on 8888');
app.listen(8888);


// app.listen(3000);


