exports.index = (req, res) => {
    res.render('index', {
        title: 'Welcome'
    });
};

exports.checkAuth = (req, res, next) => {
    if(req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

exports.login = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

exports.postLogin = (req, res) => {
    if(req.body.username === 'test' && req.body.password === 'test') {
        req.session.user = {
            isAuthenticated: true,
            username: req.body.username
        }
        res.send(`${req.body.username} is logged in`);
        res.redirect('/profile');
    } else {res.redirect('/login')};
};


exports.register = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};
exports.profile = (req, res)=> {
    res.render('profile', {
        title: 'Profile'
    });
    //res.send('logged in');
    console.log(`profile page of ${req.session.user.username}`)
};