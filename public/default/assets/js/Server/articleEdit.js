$(document).ready(function () {
    $("#left_btnCategory").addClass("active");

    search();
});

function search() {
    selfAjax("post", "/admin/article/getById", {
        catId: $("#catId").val()
    }, function (data) {
        if (data) {
            $("#content").val(data.content);
        }
    });
};

$("#btnSave").on("click", function (e) {
    var postURI = "/admin/article",
        postObj = {
            content: $.trim($('#content').val()),
            catId: $("#catId").val(),
        };
    selfAjax("post", postURI, postObj, function (data) {
        if (data.error) {
            showAlert(data.error);
            return;
        }
        location.href = "/admin/categoryList";
    });
});