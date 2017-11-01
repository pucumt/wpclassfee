module.exports = {
    checkLogin: function (req, res, next) {
        //if (!req.session.admin || req.session.admin.name != "11") {
        if (!req.session.user) {
            if (req.method == "GET") {
                res.redirect('/login');
                return;
            } else {
                res.jsonp({
                    error: "not login"
                });
                return;
            }
        }
        next();
    }
};