var model = require("../../model.js"),
    pageSize = model.db.config.pageSize,
    auth = require("./auth.js"),
    Question = model.question;

module.exports = function (app) {
    app.get('/admin/questionList', auth.checkLogin)
    app.get('/admin/questionList', auth.checkSecure([100]));
    app.get('/admin/questionList', function (req, res) {
        res.render('Server/questionList.html', {
            user: req.session.admin,
            websiteTitle: model.db.config.websiteTitle
        });
    });

}