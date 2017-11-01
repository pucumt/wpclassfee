$(document).ready(function () {
    $("#left_btnQuestion").addClass("active");
    searchOrder();
});

var $selectBody = $('.content table tbody');

function searchOrder(p) {
    var filter = {
            name: $("#InfoSearch #name").val(),
            isChecked: $("#InfoSearch #isChecked").val()
        },
        pStr = p ? "p=" + p : "";
    $selectBody.empty();
    selfAjax("post", "/admin/question/search?" + pStr, filter, function (data) {
        $selectBody.empty();
        if (data && data.questions.length > 0) {
            var getButtons = function (isChecked) {
                var buttons = "";
                switch (isChecked) {
                    case 0:
                        buttons = '<a class="btn btn-default btnPass">通过</a><a class="btn btn-default btnRefuse">拒绝</a>';
                        break;
                    case 1:
                        buttons = '<a class="btn btn-default btnRefuse">拒绝</a>';
                        break;
                    default:
                        buttons = '<a class="btn btn-default btnPass">通过</a>';
                        break;
                }
                return buttons;
            };
            var d = $(document.createDocumentFragment());
            data.questions.forEach(function (trainOrder) {
                var $tr = $('<tr id=' + trainOrder._id + '><td>' + trainOrder.createdName + '</td><td class="train" id="' + trainOrder._id +
                    '">' + trainOrder.title + '</td><td>' + moment(trainOrder.updatedDate).format("YYYY-MM-DD HH:mm") + '</td><td><div class="btn-group">' + getButtons(trainOrder.isChecked) + '</div></td></tr>');
                $tr.find(".btn-group").data("obj", trainOrder);
                d.append($tr);
            });
            $selectBody.append(d);
        }
        $("#selectModal #total").val(data.total);
        $("#selectModal #page").val(data.page);
        setPaging("#selectModal", data);
    });
};

$("#InfoSearch #btnSearch").on("click", function (e) {
    searchOrder();
});

$("#selectModal .paging .prepage").on("click", function (e) {
    var page = parseInt($("#selectModal #page").val()) - 1;
    searchOrder(page);
});

$("#selectModal .paging .nextpage").on("click", function (e) {
    var page = parseInt($("#selectModal #page").val()) + 1;
    searchOrder(page);
});

$("#gridBody").on("click", "td .btnPass", function (e) {
    var obj = e.currentTarget;
    var entity = $(obj).parent().data("obj");
    showConfirm("确定要通过" + entity.title + "吗？");

    $("#btnConfirmSave").off("click").on("click", function (e) {
        selfAjax("post", "/admin/question/pass", {
            id: entity._id
        }, function (data) {
            $('#confirmModal').modal('hide');
            if (data.sucess) {
                var page = parseInt($("#selectModal #page").val());
                searchOrder(page);
            }
        });
    });
});


$("#gridBody").on("click", "td .btnRefuse", function (e) {
    var obj = e.currentTarget;
    var entity = $(obj).parent().data("obj");
    showConfirm("确定要拒绝" + entity.title + "吗？");

    $("#btnConfirmSave").off("click").on("click", function (e) {
        selfAjax("post", "/admin/question/refuse", {
            id: entity._id
        }, function (data) {
            $('#confirmModal').modal('hide');
            if (data.sucess) {
                var page = parseInt($("#selectModal #page").val());
                searchOrder(page);
            }
        });
    });
});