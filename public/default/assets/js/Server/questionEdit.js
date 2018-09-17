$(document).ready(function () {
    $("#left_btnQuestion").addClass("active");

    searchCategory();
});

function search() {
    selfAjax("post", "/admin/question/getById", {
        id: $("#id").val()
    }, function (data) {
        if (data) {
            $("#name").val(data.title);
            $("#description").val(data.description);
            $("#author").val(data.author);
            $("#category").val(data.categoryId);
            $("#content").val(data.content);
        }
    });
};

function searchCategory() {
    selfAjax("post", "/admin/category/searchZero", null, function (data) {
        if (data && data.length > 0) {
            var d = $(document.createDocumentFragment());
            data.forEach(function (category) {
                d.append('<option value={0}>{1}</option>'.format(category._id, category.name));
            });
            $("#category").append(d);
        }
        if ($("#id").val()) {
            search();
        }
    });
};

$("#btnSave").on("click", function (e) {
    var postURI = "/admin/ask",
        postObj = {
            name: $.trim($('#name').val()),
            description: $.trim($('#description').val()),
            author: $.trim($('#author').val()),
            content: $.trim($('#content').val()),
            categoryId: $("#category").val(),
            id: $('#id').val()
        };
    selfAjax("post", postURI, postObj, function (data) {
        if (data.error) {
            showAlert(data.error);
            return;
        }
        location.href = "/admin/questionList";
    });
});