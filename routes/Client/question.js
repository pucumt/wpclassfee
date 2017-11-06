var model = require("../../model.js"),
    pageSize = model.db.config.clientSize,
    auth = require("./auth.js"),
    Question = model.question,
    Comment = model.comment;

module.exports = function (app) {
    app.get('/ask', auth.checkLogin)
    app.get('/ask', function (req, res) {
        res.render('Client/ask.html', {
            user: req.session.user,
            websiteTitle: model.db.config.websiteTitle
        });
    });
    app.get('/ask/:id', auth.checkLogin)
    app.get('/ask/:id', function (req, res) {
        Question.getFilter({
                _id: req.params.id
            })
            .then(question => {
                res.render('Client/ask.html', {
                    user: req.session.user,
                    websiteTitle: model.db.config.websiteTitle,
                    id: req.params.id,
                    question: question
                });
            });
    });

    app.post('/ask', auth.checkLogin)
    app.post('/ask', function (req, res) {
        if (req.body.id) {
            // edit
            Question.update({
                    content: req.body.content
                }, {
                    where: {
                        _id: req.body.id
                    }
                })
                .then(q => {
                    res.redirect("/personal");
                });
        } else {
            // create
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
        }
    });

    app.post('/ask/search', function (req, res) {
        //判断是否是第一页，并把请求的页数转换成 number 类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //查询并返回第 page 页的 20 篇文章
        var filter = {
            isChecked: 1
        };
        if (req.body.q && req.body.q.trim()) {
            filter.title = {
                $like: `%${req.body.q.trim()}%`
            };
        }

        Question.getFiltersWithPageClient(page, filter)
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

    app.post('/ask/personal', function (req, res) {
        //判断是否是第一页，并把请求的页数转换成 number 类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //查询并返回第 page 页的 20 篇文章
        var filter = {
            createdBy: req.session.user._id
        };

        Question.getFiltersWithPageClient(page, filter)
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

    app.get('/question/:id', function (req, res) {
        res.render('Client/detail.html', {
            user: req.session.user,
            websiteTitle: model.db.config.websiteTitle,
            id: req.params.id
        });
    });

    app.post('/question', function (req, res) {
        Question.getFilter({
                _id: req.body.id,
                isChecked: 1
            })
            .then(function (question) {
                res.jsonp(question);
            });
    });

    app.post('/comment/get', function (req, res) {
        Comment.getFilters({
                qid: req.body.id
            })
            .then(function (comments) {
                res.jsonp({
                    comments: comments
                });
            });
    });

    app.post('/comment/post', function (req, res) {
        Comment.create({
                qid: req.body.id,
                content: req.body.comment,
                createdBy: req.session.user._id,
                createdName: req.session.user.name
            })
            .then(function (comment) {
                res.jsonp(comment);
            });
    });
}