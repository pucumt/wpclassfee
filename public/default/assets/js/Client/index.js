$(document).ready(function () {
    search();
});

var $selectBody = $('.content .ul-content');

function search(p) {
    var filter = {
            q: $("#txtSearch").val()
        },
        pStr = p ? "p=" + p : "";
    $selectBody.empty();
    selfAjax("post", "/ask/search?" + pStr, filter, function (data) {
        $selectBody.empty();
        var d = $(document.createDocumentFragment());
        if (data && data.questions.length > 0) {
            data.questions.forEach(function (trainOrder) {
                d.append(rendDetail(trainOrder));
            });
            $selectBody.append(d);
        }
    });
};

function rendDetail(trainOrder) {
    var $li = $('<li></li>'),
        $title = $('<div class="title-section clearfix"><div class="title"><a href="/question/' + trainOrder._id + '">' + trainOrder.title + '</a></div></div>'),
        $content = $('<div class="content-section clearfix"><div class="content">' + marked(trainOrder.content) + '</div></div>');

    $li.append($title);
    $li.append($content);

    return $li;
}