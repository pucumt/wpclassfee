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

    app.post('/admin/question/search', auth.checkLogin);
    app.post('/admin/question/search', auth.checkSecure([100]));
    app.post('/admin/question/search', function (req, res) {
        //判断是否是第一页，并把请求的页数转换成 number 类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //查询并返回第 page 页的 20 篇文章
        var filter = {};
        if (req.body.name && req.body.name.trim()) {
            filter.name = {
                $like: `%${req.body.name.trim()}%`
            };
        }

        if (req.body.isChecked) {
            filter.isChecked = req.body.isChecked;
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

    app.post('/admin/question/pass', auth.checkLogin);
    app.post('/admin/question/pass', auth.checkSecure([100]));
    app.post('/admin/question/pass', function (req, res) {
        Question.update({
                isChecked: 1,
                checkedBy: req.session.admin._id
            }, {
                where: {
                    _id: req.body.id
                }
            })
            .then(function (result) {
                res.jsonp({
                    sucess: true
                });
            }).catch(function () {
                res.jsonp({
                    error: "更改失败"
                });
            });
    });

    app.post('/admin/question/refuse', auth.checkLogin);
    app.post('/admin/question/refuse', auth.checkSecure([100]));
    app.post('/admin/question/refuse', function (req, res) {
        Question.update({
                isChecked: 0,
                checkedBy: req.session.admin._id
            }, {
                where: {
                    _id: req.body.id
                }
            })
            .then(function (result) {
                res.jsonp({
                    sucess: true
                });
            }).catch(function () {
                res.jsonp({
                    error: "更改失败"
                });
            });
    });

    app.get('/admin/question/:id', auth.checkLogin)
    app.get('/admin/question/:id', auth.checkSecure([100]));
    app.get('/admin/question/:id', function (req, res) {
        res.render('Server/detail.html', {
            user: req.session.admin,
            websiteTitle: model.db.config.websiteTitle,
            id: req.params.id
        });
    });

    app.post('/admin/question/getById', auth.checkLogin)
    app.post('/admin/question/getById', auth.checkSecure([100]));
    app.post('/admin/question/getById', function (req, res) {
        Question.getFilter({
                _id: req.body.id
            })
            .then(function (question) {
                res.jsonp(question);
            });
    });

    app.post('/admin/question', auth.checkLogin);
    app.post('/admin/question', auth.checkSecure([100]));
    app.post('/admin/question', function (req, res) {
        Question.getFilter({
                _id: req.body.id
            })
            .then(function (question) {
                res.jsonp(question);
            });
    });

    app.get('/admin/ask', auth.checkLogin)
    app.get('/admin/ask', auth.checkSecure([100]))
    app.get('/admin/ask', function (req, res) {
        res.render('Server/questionEdit.html', {
            user: req.session.admin,
            websiteTitle: model.db.config.websiteTitle
        });
    });

    app.get('/admin/ask/:id', auth.checkLogin)
    app.get('/admin/ask/:id', auth.checkSecure([100]))
    app.get('/admin/ask/:id', function (req, res) {
        res.render('Server/questionEdit.html', {
            user: req.session.admin,
            websiteTitle: model.db.config.websiteTitle,
            id: req.params.id
        });
    });

    // 保存
    app.post('/admin/ask', auth.checkLogin)
    app.post('/admin/ask', auth.checkSecure([100]))
    app.post('/admin/ask', function (req, res) {
        if (req.body.id) {
            // edit
            Question.update({
                    title: req.body.name,
                    author: req.body.author,
                    content: req.body.content,
                    categoryId: req.body.categoryId,
                    updatedDate: new Date(),
                    deletedBy: req.session.admin._id
                }, {
                    where: {
                        _id: req.body.id
                    }
                })
                .then(q => {
                    res.jsonp({
                        sucess: true
                    });
                });
        } else {
            // create
            Question.create({
                    title: req.body.name,
                    author: req.body.author,
                    content: req.body.content,
                    categoryId: req.body.categoryId,
                    createdBy: req.session.admin._id,
                    createdName: req.session.admin.name
                })
                .then(q => {
                    res.jsonp({
                        sucess: true
                    });
                });
        }
    });
}