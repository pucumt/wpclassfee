var login = require('./login.js'),
    logout = require('./logout.js'),

    user = require('./user.js'),
    question = require('./question.js');

module.exports = function (app) {
    login(app);
    logout(app);

    //basic
    user(app);

    question(app);
};