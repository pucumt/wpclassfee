const db = require('../../db'),
    config = require('../../settings');

const Question = db.defineModel('questions', {
    title: db.STRING(50),
    author: db.STRING(1000), //作者信息
    description: {
        type: db.STRING(100),
        defaultValue: ""
    }, // 描述信息，用于seo
    content: db.TEXT,
    categoryId: db.STRING(50), // 文章所属类别
    isChecked: { // only isChecked==1 will show in index, 0 is default 9 is refused
        type: db.INTEGER,
        defaultValue: 0
    }
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
            ['createdDate', 'DESC'],
            ['_id']
        ]
    });
};

Question.getFiltersWithPage = function (page, filter) {
    filter.isDeleted = false;
    return Question.findAndCountAll({
        'where': filter,
        order: [
            ['createdDate', 'DESC'],
            ['_id']
        ],
        offset: config.pageSize * (page - 1),
        limit: config.pageSize
    });
};

Question.getFiltersWithPageClient = function (page, filter) {
    filter.isDeleted = false;
    return Question.findAndCountAll({
        'where': filter,
        order: [
            ['createdDate', 'DESC'],
            ['_id']
        ],
        offset: config.clientSize * (page - 1),
        limit: config.clientSize
    });
};