$(document).ready(function () {
    getContent();
    getComments();

    $("#btnSubmit").click(function (e) {
        var content = $("#content").val();
        if (content.length < 5) {
            $(".comments .msg").text("请填写5字以上的评论");
            return;
        }

        $("#btnSubmit").attr("disabled", "disabled");
        var filter = {
            id: $("#id").val(),
            comment: content
        };
        selfAjax("post", "/comment/post", filter, function (data) {
            $("#btnSubmit").removeAttr("disabled");
            if (data.error) {
                showAlert(data.error);
                return;
            }
            getComments();
        });
    });
});

function getContent() {
    var filter = {
        id: $("#id").val()
    };
    selfAjax("post", "/question", filter, function (data) {
        if (data) {
            $(".content .detail .title").text(data.title);
            $(".content .detail .question").text(data.content);
        }
    });
};

var $selectBody = $('.content .list');

function getComments() {
    var filter = {
        id: $("#id").val()
    };
    $selectBody.empty();
    selfAjax("post", "/comment/get", filter, function (data) {
        var d = $(document.createDocumentFragment());
        if (data && data.comments.length > 0) {
            data.comments.forEach(function (comment) {
                var $tr = $('<li><div class="title clearfix"><div class="user pull-left">' + comment.createdName + '</div><div class="time pull-right">' + moment(comment.createdDate).format("YYYY-MM-DD HH:mm:ss") + '</div></div><div>' + comment.content + '</div></li>');
                d.append($tr);
            });
            $selectBody.append(d);
        }
    });
};