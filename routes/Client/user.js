var model = require("../../model.js"),
    pageSize = model.db.config.pageSize,
    crypto = require('crypto'),
    auth = require("./auth.js"),
    request = require('request'),
    User = model.ws_user;

module.exports = function (app) {
    app.get('/login', function (req, res) {
        res.render('Client/login.html', {
            websiteTitle: model.db.config.websiteTitle,
            pageTitle: model.db.config.websiteTitle,
            pageKey: "南通信息学培训, 南通C++培训, 南通软件开发，南通公众号开发，南通小程序开发",
            pageDescription: "江苏省南通市本地的信息学C++竞赛培训, 同时可软件开发，公众号开发、小程序开发",
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

    app.post('/app/login', function (req, res) {
        // 微信登录，先取得微信openId, sessionKey, unionId
        // 如果user不存在就创建user
        var code = req.body.code;
        request.get({
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxa155aceaa74876cb&secret=10266a3d9426016582b3ba34d937acc1&js_code=' + code + '&grant_type=authorization_code',
            },
            function (error, response, body) {
                if (response.statusCode == 200) {
                    // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                    //console.log(JSON.parse(body));
                    var data = JSON.parse(body);
                    var access_token = data.access_token;
                    var openid = data.openid;
                    User.getFilter({
                            password: openid
                        })
                        .then(function (user) {
                            if (!user) {
                                // 用户不存在则创建新用户
                                User.create({
                                        password: openid,
                                        name: ''
                                    })
                                    .then(function (user) {
                                        res.jsonp({
                                            id: user._id,
                                            sucess: true
                                        });
                                    });
                            } else {
                                res.jsonp({
                                    id: user._id,
                                    sucess: true
                                });
                            }
                        });
                } else {
                    console.log(response.statusCode);
                    res.jsonp({
                        error: true
                    });
                }
            }
        );
    });

    app.get('/personal', auth.checkLogin)
    app.get('/personal', function (req, res) {
        res.render('Client/personal.questionList.html', {
            user: req.session.user,
            websiteTitle: model.db.config.websiteTitle
        });
    });
}