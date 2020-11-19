const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes');

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '/public')));

const urlencodedParser = bodyParser.urlencoded({
    extended: true
});

app.get('/', routes.index);
app.get('/login', routes.login)
app.get('/register', routes.register)


app.listen(3000);


