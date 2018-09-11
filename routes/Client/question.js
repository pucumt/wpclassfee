var model = require("../../model.js"),
    pageSize = model.db.config.clientSize,
    auth = require("./auth.js"),
    marked = require("marked"),
    Question = model.question,
    Category = model.category,
    CategoryArticle = model.categoryArticle,
    Comment = model.comment;

module.exports = function (app) {
    app.get('/category/:catId', function (req, res) {
        Category.getFilter({
                _id: req.params.catId
            })
            .then(function (category) {
                if (category.isArticle) {
                    CategoryArticle.getFilter({
                            categoryId: req.params.catId
                        })
                        .then(function (article) {
                            content = marked(article.content);
                            res.render('Client/catDetail.html', {
                                user: req.session.user,
                                websiteTitle: model.db.config.websiteTitle,
                                catId: req.params.catId,
                                content: content
                            });
                        });
                } else {
                    var filter = {
                        isChecked: 1
                    };
                    if (req.body.q && req.body.q.trim()) {
                        filter.title = {
                            $like: `%${req.body.q.trim()}%`
                        };
                    }
                    if (req.params.catId) {
                        filter.categoryId = req.params.catId;
                    }
                    Question.getFiltersWithPageClient(1, filter)
                        .then(function (result) {
                            result.rows.forEach(q => {
                                q.author = marked(q.author);
                                q.content = marked(q.content);
                            });
                            res.render('Client/index.html', {
                                user: req.session.user,
                                websiteTitle: model.db.config.websiteTitle,
                                search: req.query.q,
                                catId: req.params.catId,
                                questions: result.rows
                            });
                        })
                        .catch(err => {

                        });
                }
            });
    });

    app.get('/', function (req, res) {
        var filter = {
            isChecked: 1
        };
        if (req.body.q && req.body.q.trim()) {
            filter.title = {
                $like: `%${req.body.q.trim()}%`
            };
        }
        if (req.body.catId) {
            filter.categoryId = req.body.catId;
        }
        Question.getFiltersWithPageClient(1, filter)
            .then(function (result) {
                result.rows.forEach(q => {
                    q.author = marked(q.author);
                    q.content = marked(q.content);
                });

                res.render('Client/index.html', {
                    user: req.session.user,
                    websiteTitle: model.db.config.websiteTitle,
                    search: req.query.q,
                    questions: result.rows
                });
            })
            .catch(err => {

            });
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
        if (req.body.catId) {
            filter.categoryId = req.body.catId;
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

    app.post('/ask/category/searchall', function (req, res) {
        var filter = {};

        Category.getFilters(filter)
            .then(function (results) {
                res.jsonp(results);
            })
            .catch(err => {

            });
    });

    app.get('/question/:id', function (req, res) {
        Question.getFilter({
                _id: req.params.id,
                isChecked: 1
            })
            .then(function (question) {
                question.author = marked(question.author);
                question.content = marked(question.content);
                res.render('Client/detail.html', {
                    user: req.session.user,
                    websiteTitle: model.db.config.websiteTitle,
                    id: req.params.id,
                    data: question
                });
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

    app.post('/category/detail', function (req, res) {
        CategoryArticle.getFilter({
                categoryId: req.body.catId
            })
            .then(function (article) {
                res.jsonp(article);
            });
    });
}