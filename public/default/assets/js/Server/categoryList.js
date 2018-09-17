$(document).ready(function () {
    $("#left_btnCategory").addClass("active");

    searchOrder();
});

var $selectBody = $('.content table tbody');

function searchOrder(p) {
    var filter = {
            name: $("#InfoSearch #name").val()
        },
        pStr = p ? "p=" + p : "";
    $selectBody.empty();
    selfAjax("post", "/admin/category/search?" + pStr, filter, function (data) {
        $selectBody.empty();
        if (data && data.categories.length > 0) {
            var getButtons = function (isArticle) {
                var buttons = '<a class="btn btn-default btnEdit">编辑</a><a class="btn btn-default btnDelete">删除</a>';
                if (isArticle == 1) {
                    buttons += '<a class="btn btn-default btnArticle">文章</a>';
                }
                return buttons;
            };
            var d = $(document.createDocumentFragment());
            data.categories.forEach(function (trainOrder) {
                var $tr = $('<tr id=' + trainOrder._id + '><td>' + trainOrder.name + '</td><td class="train">' + trainOrder.sequence +
                    '</td><td class="train">' + (trainOrder.isArticle ? "菜单" : "分类") + '</td><td>' + moment(trainOrder.updatedDate).format("YYYY-MM-DD HH:mm") +
                    '</td><td><div class="btn-group">' + getButtons(trainOrder.isArticle) + '</div></td></tr>');
                $tr.find(".btn-group").data("obj", trainOrder);
                d.append($tr);
            });
            $selectBody.append(d);
        }
        setPaging("#selectModal", data, searchOrder);
    });
};

$("#InfoSearch #btnSearch").on("click", function (e) {
    searchOrder();
});

$("#btnAdd").on("click", function (e) {
    $('#myModal #id').val("");
    $('#myModal #myModalLabel').text("新增分类");
    $('#myModal #name').val("");
    $('#myModal #description').val("");
    $('#myModal #sequence').val(0);
    $('#myModal #isArticle').val(0);
    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    });
});

$("#myModal #btnSave").on("click", function (e) {
    var postURI = "/admin/category/add",
        postObj = {
            name: $.trim($('#myModal #name').val()),
            description: $.trim($('#myModal #description').val()),
            sequence: $.trim($('#myModal #sequence').val()),
            isArticle: $('#myModal #isArticle').val()
        };
    if ($('#myModal #id').val() != "") {
        postURI = "/admin/category/edit";
        postObj.id = $('#id').val();
    }
    selfAjax("post", postURI, postObj, function (data) {
        if (data.error) {
            showAlert(data.error);
            return;
        }
        var page = parseInt($("#mainModal #page").val());
        searchOrder(page);
        $('#myModal').modal('hide');
    });
});

$("#gridBody").on("click", "td .btnEdit", function (e) {
    var obj = e.currentTarget;
    var entity = $(obj).parent().data("obj");
    $('#myModal #myModalLabel').text("修改分类");
    $('#myModal #name').val(entity.name);
    $('#myModal #description').val(entity.description);
    $('#myModal #isArticle').val(entity.isArticle ? "1" : "0");
    $('#myModal #sequence').val(entity.sequence);
    $('#myModal #id').val(entity._id);
    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    });
});

$("#gridBody").on("click", "td .btnDelete", function (e) {
    showConfirm("确定要删除吗？");
    var obj = e.currentTarget;
    var entity = $(obj).parent().data("obj");
    $("#btnConfirmSave").off("click").on("click", function (e) {
        selfAjax("post", "/admin/category/delete", {
            id: entity._id
        }, function (data) {
            if (data.error) {
                showAlert(data.error);
                return;
            }
            var page = parseInt($("#mainModal #page").val());
            searchOrder(page);
            $('#confirmModal').modal('hide');
        });
    });
});

$("#gridBody").on("click", "td .btnArticle", function (e) {
    var obj = e.currentTarget;
    var entity = $(obj).parent().data("obj");
    location.href = "/admin/article/" + entity._id;
});