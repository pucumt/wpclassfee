$(document).ready(function () {
    search();
});

var $selectBody = $('.content .ul-content');

function search(p) {
    var filter = {},
        pStr = p ? "p=" + p : "";
    $selectBody.empty();
    selfAjax("post", "/ask/search?" + pStr, filter, function (data) {
        $selectBody.empty();
        var d = $(document.createDocumentFragment());
        if (data && data.questions.length > 0) {
            data.questions.forEach(function (trainOrder) {
                var $tr = $('<li><div class="title-section clearfix"><div class="title"><a href="/question/' + trainOrder._id + '">' + trainOrder.title + '</a></div></div></li>');
                d.append($tr);
            });
            $selectBody.append(d);
        }
    });
};