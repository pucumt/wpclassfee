const db = require('../../db'),
    config = require('../../settings');

const Question = db.defineModel('questions', {
    title: db.STRING(50),
    content: db.STRING(1000),
    answer: db.STRING(1000)
});
module.exports = Question;

//读取用户信息
Question.getFilter = function (filter) {
    filter.isDeleted = false;
    return Question.findOne({
        'where': filter
    });
};

Question.getFilters = function (filter) {
    filter.isDeleted = false;
    return Question.findAll({
        'where': filter,
        order: [
            ['createdDate'],
            ['_id']
        ]
    });
};

Question.getFiltersWithPage = function (page, filter) {
    filter.isDeleted = false;
    return Question.findAndCountAll({
        'where': filter,
        order: [
            ['createdDate'],
            ['_id']
        ],
        offset: config.pageSize * (page - 1),
        limit: config.pageSize
    });
};