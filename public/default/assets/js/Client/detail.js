$(document).ready(function () {
    getContent();
});

function getContent() {
    var filter = {
        id: $("#id").val()
    };
    selfAjax("post", "/question", filter, function (data) {
        if (data) {
            $(".content .detail .title").text(data.title);
            $(".content .detail .question").html(marked(data.content));
        }
    });
};