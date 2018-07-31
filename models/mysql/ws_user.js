const db = require('../../db'),
    config = require('../../settings');

const WS_user = db.defineModel('ws_users', {
    name: {
        type: db.STRING(20)
    },
    password: db.STRING(50) // when login with wechat, it will be the openId
});
module.exports = WS_user;

WS_user.getFilter = function (filter) {
    filter.isDeleted = false;
    return WS_user.findOne({
        'where': filter
    });
};

WS_user.getFilters = function (filter) {
    filter.isDeleted = false;
    return WS_user.findAll({
        'where': filter,
        order: [
            ['createdDate'],
            ['_id']
        ]
    });
};

WS_user.getFiltersWithPage = function (page, filter) {
    filter.isDeleted = false;
    return WS_user.findAndCountAll({
        'where': filter,
        order: [
            ['createdDate'],
            ['_id']
        ],
        offset: config.pageSize * (page - 1),
        limit: config.pageSize
    });
};