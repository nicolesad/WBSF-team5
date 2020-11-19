exports.index = (req, res) => {
    res.render('index', {
        title: 'Welcome'
    });
};
exports.login = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};
exports.register = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};