var model = require("../../model.js"),
    pageSize = model.db.config.pageSize,
    auth = require("./auth.js"),
    Question = model.question;

module.exports = function (app) {
    app.get('/ask', auth.checkLogin)
    app.get('/ask', function (req, res) {
        res.render('Client/ask.html', {
            user: req.session.user,
            websiteTitle: model.db.config.websiteTitle
        });
    });

    app.post('/ask', auth.checkLogin)
    app.post('/ask', function (req, res) {
        Question.create({
                title: req.body.name,
                content: req.body.content,
                answer: "",
                createdBy: req.session.user._id,
                createdName: req.session.user.name
            })
            .then(q => {
                res.redirect("/");
            });
    });
}