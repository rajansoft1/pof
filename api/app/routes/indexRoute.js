module.exports = function (app) {
    var user = require('../controllers/userCtrl');

    app.get('/*', function (req, res, next) {
        res.header('X-XSS-Protection', 0);
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    });

    app.get('/user', user.get);
    app.post('/user/register', user.register);


};