const db = require('../../db'),
    config = require('../../settings');

const Comment = db.defineModel('comments', {
    qid: db.STRING(32), // 问题id
    content: db.STRING(1000)
});
module.exports = Comment;

//读取用户信息
Comment.getFilter = function (filter) {
    filter.isDeleted = false;
    return Comment.findOne({
        'where': filter
    });
};

Comment.getFilters = function (filter) {
    filter.isDeleted = false;
    return Comment.findAll({
        'where': filter,
        order: [
            ['createdDate'],
            ['_id']
        ]
    });
};

Comment.getFiltersWithPage = function (page, filter) {
    filter.isDeleted = false;
    return Comment.findAndCountAll({
        'where': filter,
        order: [
            ['createdDate'],
            ['_id']
        ],
        offset: config.pageSize * (page - 1),
        limit: config.pageSize
    });
};