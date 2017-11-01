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

    app.post('/ask/search', function (req, res) {
        //判断是否是第一页，并把请求的页数转换成 number 类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //查询并返回第 page 页的 20 篇文章
        var filter = {
            isChecked: 1
        };
        if (req.body.name && req.body.name.trim()) {
            filter.name = {
                $like: `%${req.body.name.trim()}%`
            };
        }

        Question.getFiltersWithPage(page, filter)
            .then(function (result) {
                res.jsonp({
                    questions: result.rows,
                    total: result.count,
                    page: page,
                    isFirstPage: (page - 1) == 0,
                    isLastPage: ((page - 1) * pageSize + result.rows.length) == result.count
                });
            }).catch(err => {

            });
    });
}