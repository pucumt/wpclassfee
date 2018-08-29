const db = require('../../db'),
    config = require('../../settings');

const CategoryArticle = db.defineModel('categoryArticles', {
    categoryId: db.STRING(50), // 文章所属类别
    content: db.TEXT,
    isChecked: { // only isChecked==1 will show in index
        type: db.INTEGER,
        defaultValue: 0
    }
});
module.exports = CategoryArticle;

//读取用户信息
CategoryArticle.getFilter = function (filter) {
    filter.isDeleted = false;
    return CategoryArticle.findOne({
        'where': filter
    });
};

CategoryArticle.getFilters = function (filter) {
    filter.isDeleted = false;
    return CategoryArticle.findAll({
        'where': filter,
        order: [
            ['createdDate', 'DESC'],
            ['_id']
        ]
    });
};

CategoryArticle.getFiltersWithPage = function (page, filter) {
    filter.isDeleted = false;
    return CategoryArticle.findAndCountAll({
        'where': filter,
        order: [
            ['createdDate', 'DESC'],
            ['_id']
        ],
        offset: config.pageSize * (page - 1),
        limit: config.pageSize
    });
};

CategoryArticle.getFiltersWithPageClient = function (page, filter) {
    filter.isDeleted = false;
    return CategoryArticle.findAndCountAll({
        'where': filter,
        order: [
            ['createdDate', 'DESC'],
            ['_id']
        ],
        offset: config.clientSize * (page - 1),
        limit: config.clientSize
    });
};