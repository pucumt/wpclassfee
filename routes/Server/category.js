var model = require("../../model.js"),
    pageSize = model.db.config.pageSize,
    auth = require("./auth.js"),
    CategoryArticle = model.categoryArticle,
    Category = model.category;

module.exports = function (app) {
    app.get('/admin/categoryList', auth.checkLogin)
    app.get('/admin/categoryList', auth.checkSecure([100]));
    app.get('/admin/categoryList', function (req, res) {
        res.render('Server/categoryList.html', {
            user: req.session.admin,
            websiteTitle: model.db.config.websiteTitle
        });
    });

    app.post('/admin/category/search', auth.checkLogin);
    app.post('/admin/category/search', auth.checkSecure([100]));
    app.post('/admin/category/search', function (req, res) {
        //判断是否是第一页，并把请求的页数转换成 number 类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //查询并返回第 page 页的 20 篇文章
        var filter = {};
        if (req.body.name && req.body.name.trim()) {
            filter.name = {
                $like: `%${req.body.name.trim()}%`
            };
        }
        Category.getFiltersWithPage(page, filter)
            .then(function (result) {
                res.jsonp({
                    categories: result.rows,
                    total: result.count,
                    page: page,
                    isFirstPage: (page - 1) == 0,
                    isLastPage: ((page - 1) * pageSize + result.rows.length) == result.count
                });
            }).catch(err => {

            });
    });

    app.post('/admin/category/searchZero', auth.checkLogin);
    app.post('/admin/category/searchZero', auth.checkSecure([100]));
    app.post('/admin/category/searchZero', function (req, res) {
        var filter = {
            isArticle: false
        };

        Category.getFilters(filter)
            .then(function (results) {
                res.jsonp(results);
            })
            .catch(err => {

            });
    });

    app.post('/admin/category/add', auth.checkLogin);
    app.post('/admin/category/add', auth.checkSecure([100]));
    app.post('/admin/category/add', function (req, res) {
        Category.create({
                name: req.body.name,
                sequence: req.body.sequence,
                isArticle: req.body.isArticle,
                createdBy: req.session.admin._id
            })
            .then(function (result) {
                res.jsonp(result);
            });
    });

    app.post('/admin/category/edit', auth.checkLogin);
    app.post('/admin/category/edit', auth.checkSecure([100]));
    app.post('/admin/category/edit', function (req, res) {
        Category.update({
                name: req.body.name,
                sequence: req.body.sequence,
                isArticle: req.body.isArticle,
                updatedDate: new Date(),
                deletedBy: req.session.admin._id
            }, {
                where: {
                    _id: req.body.id
                }
            })
            .then(function (book) {
                res.jsonp(book);
            });
    });

    app.post('/admin/category/delete', auth.checkLogin);
    app.post('/admin/category/delete', auth.checkSecure([100]));
    app.post('/admin/category/delete', function (req, res) {
        Category.update({
                isDeleted: true,
                deletedBy: req.session.admin._id,
                deletedDate: new Date()
            }, {
                where: {
                    _id: req.body.id
                }
            })
            .then(function (result) {
                res.jsonp({
                    sucess: true
                });
            });
    });

    // app.get('/admin/category/:id', auth.checkLogin)
    // app.get('/admin/category/:id', auth.checkSecure([100]));
    // app.get('/admin/category/:id', function (req, res) {
    //     res.render('Server/detail.html', {
    //         user: req.session.user,
    //         websiteTitle: model.db.config.websiteTitle,
    //         id: req.params.id
    //     });
    // });

    app.post('/admin/category/getById', auth.checkLogin);
    app.post('/admin/category/getById', auth.checkSecure([100]));
    app.post('/admin/category/getById', function (req, res) {
        Category.getFilter({
                _id: req.body.id
            })
            .then(function (category) {
                res.jsonp(category);
            });
    });

    app.get('/admin/article/:catId', auth.checkLogin)
    app.get('/admin/article/:catId', auth.checkSecure([100]))
    app.get('/admin/article/:catId', function (req, res) {
        res.render('Server/articleEdit.html', {
            user: req.session.admin,
            websiteTitle: model.db.config.websiteTitle,
            catId: req.params.catId
        });
    });

    // 保存
    app.post('/admin/article', auth.checkLogin)
    app.post('/admin/article', auth.checkSecure([100]))
    app.post('/admin/article', function (req, res) {
        CategoryArticle.getFilter({
                categoryId: req.body.catId
            })
            .then(article => {
                if (article) {
                    //edit
                    article.content = req.body.content;
                    article.deletedBy = req.session.admin._id;
                    article.updatedDate = new Date();
                    return article.save();
                } else {
                    return CategoryArticle.create({
                        content: req.body.content,
                        categoryId: req.body.catId,
                        createdBy: req.session.admin._id
                    });
                }
            })
            .then(o => {
                res.jsonp({
                    sucess: true
                });
            });
    });

    app.post('/admin/article/getById', auth.checkLogin);
    app.post('/admin/article/getById', auth.checkSecure([100]));
    app.post('/admin/article/getById', function (req, res) {
        CategoryArticle.getFilter({
                categoryId: req.body.catId
            })
            .then(function (article) {
                res.jsonp(article);
            });
    });
}