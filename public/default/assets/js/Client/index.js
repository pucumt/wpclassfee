$(document).ready(function () {
    //search(curPage);
    $(window).scroll(function () {
        // console.log($(document).scrollTop());
        // console.log($(document).height() - $(window).height());
        if (Math.round($(document).scrollTop()) >= $(document).height() - $(window).height()) {
            // alert("滚动条已经到达底部为" + $(document).scrollTop());
            curPage++;
            search(curPage);
        }
    });
});

var curPage = 1,
    $selectBody = $('.content .ul-content');

function search(p) {
    var filter = {
            q: $("#txtSearch").val(),
            catId: $("catId").val()
        },
        pStr = p ? "p=" + p : "";
    // $selectBody.empty();
    selfAjax("post", "/ask/search?" + pStr, filter, function (data) {
        // $selectBody.empty();
        var d = $(document.createDocumentFragment());
        if (data && data.questions.length > 0) {
            data.questions.forEach(function (trainOrder) {
                d.append(rendDetail(trainOrder));
            });
            $selectBody.append(d);
        }
        if (data.isLastPage) {
            $(window).off("scroll");
        }
    });
};

function rendDetail(trainOrder) {
    var $li = $('<li class="contentDetail"></li>'),
        $title = $('<div class="title-section clearfix"><div class="title"><a href="/question/' + trainOrder._id + '">' + trainOrder.title + '</a></div><div class="author">' + marked(trainOrder.author) + '</div></div>'),
        $content = $('<div class="content-section clearfix"><div class="markdown-body">' + marked(trainOrder.content) + '</div></div>');

    $li.append($title);
    $li.append($content);

    return $li;
}