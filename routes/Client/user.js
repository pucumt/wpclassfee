var model = require("../../model.js"),
    pageSize = model.db.config.pageSize,
    crypto = require('crypto'),
    auth = require("./auth.js"),
    User = model.ws_user;

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('Client/index.html', {
            user: req.session.user,
            websiteTitle: model.db.config.websiteTitle,
            search: req.query.q
        });
    });

    app.get('/login', function (req, res) {
        res.render('Client/login.html', {
            websiteTitle: model.db.config.websiteTitle
        });
    });

    app.get('/logout', function (req, res) {
        req.session.user = null;
        res.redirect('/');
    });

    app.post('/login', function (req, res) {
        //登录注册放在一起
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        User.getFilter({
                name: req.body.name
            })
            .then(function (user) {
                if (!user) {
                    return res.redirect('/login?err=1'); //用户不存在则跳转到登录页
                }
                //检查密码是否一致
                if (user.password != password) {
                    return res.redirect('/login?err=2'); //密码错误则跳转到登录页
                }
                //用户名密码都匹配后，将用户信息存入 session
                req.session.user = user;
                res.redirect('/'); //登陆成功后跳转到主页
            });
    });

    app.get('/personal', auth.checkLogin)
    app.get('/personal', function (req, res) {
        res.render('Client/personal.questionList.html', {
            user: req.session.user,
            websiteTitle: model.db.config.websiteTitle
        });
    });
}