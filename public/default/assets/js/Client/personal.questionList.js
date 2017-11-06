$(document).ready(function () {
    search();

    $(".content .ul-content").on("click", "li #btnEdit", function (e) {
        var obj = $(e.target).parents("li").data("obj"),
            id = obj._id;
        location.replace("/ask/" + id);
    });
});

function getStatus(isChecked) {
    switch (isChecked) {
        case 1:
            return "<span class='status'>已通过</span>"
            break;
        case 9:
            return "<span class='status'>已拒绝</span>"
            break;
        default:
            return "<span class='status'>未处理</span>"
            break;
    }
};

var $selectBody = $('.content .ul-content');

function search(p) {
    var filter = {},
        pStr = p ? "p=" + p : "";
    $selectBody.empty();
    selfAjax("post", "/ask/personal?" + pStr, filter, function (data) {
        $selectBody.empty();
        var d = $(document.createDocumentFragment());
        if (data && data.questions.length > 0) {
            data.questions.forEach(function (trainOrder) {
                var $tr = $('<li><div class="title-section clearfix"><div class="title">' + getStatus(trainOrder.isChecked) + '<a href="/question/' + trainOrder._id + '">' + trainOrder.title + '</a></div><div><span id="btnEdit">修改</span></div></div></li>');
                $tr.data("obj", trainOrder);
                d.append($tr);
            });
            $selectBody.append(d);
        }

        $("#mainModal #total").val(data.total);
        $("#mainModal #page").val(data.page);
        setPaging("#mainModal", data);
    });
};