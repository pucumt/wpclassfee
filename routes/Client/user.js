var model = require("../../model.js"),
    pageSize = model.db.config.pageSize,
    User = model.ws_user;

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('Client/index.html', {
            websiteTitle: model.db.config.websiteTitle
        });
    });
}