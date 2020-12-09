//Variables:
const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes');
const app = express();
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});
let error_msg = "";
let no_errors = true;
const email_pattern = /.*[a-z]+@.*[a-z].*[a-z]+..*[a-z].*[a-z].*/i;
const name_pattern = /.*[a-z].*[a-z].*/i;
const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i;

//Spotify Client Variables:
let client_id = '8957a412905c4361bfeae278e8bd261c';
let client_secret = '94f5eaa8eee74fba876f7ed029b988a4';
let redirect_uri = 'localhost:8888/callback';

//Setting up views:
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '/public')));

//Setting up Spotify API:
var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());
app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});
app.get('/callback', function(req, res) {

    // you r application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});
app.get('/refresh_token', function(req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

//Validating Info:
const validate = (password, username, email) => {
    error_msg = "";
    no_errors = true;

    if (!password_pattern.test(password.value)) {
        error_msg = "Password must be at least 8 characters and include one capitalized letter, one digit, and one special character !@#$%^&*()[]{};:<>,./?.<br/>";
        no_errors = false;
        // password_error.innerHTML = error_msg;
    }

    if (!name_pattern.test(username.value)) {
        error_msg = "First name needs to be a minimum of two letters.<br />";
        no_errors = false;
        // username_error.innerHTML = error_msg;
    }

    if (!email_pattern.test(email.value)) {
        error_msg = "Email must have at least one character, followed by an '@', then at least two characters, followed by a dot, and then at least two more characters.<br/>";
        no_errors = false;
        // email_error.innerHTML = error_msg;
    }
}

//Routing:
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/register', routes.register);
app.post('/submitted', urlencodedParser, (req, res) => {
    let personUsername = req.body.username;
    let personPassword = req.body.password;
    let personEmail = req.body.email;
    // validate(personPassword, personUsername, personEmail);
    if (personUsername === "" || personPassword === "" || personEmail === "") {
        console.log("You are missing some information. Please fill out all of the data correctly to continue");
        res.redirect('/register');
    } else {
        User: user = new User(personEmail, personUsername, personPassword);
        console.log(user);
        res.redirect('/submitted');
        user.update_bio("This is my bio");
        console.log(user.bio);
    }
})
app.get('/profile', routes.profile)
console.log('Listening on 3000');
app.listen(3000);

//Classes:
class User {
    bio;
    is_creator;
    constructor(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
    };
    update_bio = (text) => {
        this.bio = text;
    }
    add_creator = (boolean) => {
        this.is_creator = boolean;
    }
};

class Post {
    constructor(username, playlist, text) {
        this.username = username;
        this.playlist = playlist;
        this.text = text;
    }
}
