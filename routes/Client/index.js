var user = require('./user.js'),
    question = require('./question.js');

module.exports = function (app) {
    user(app);
    question(app);
};