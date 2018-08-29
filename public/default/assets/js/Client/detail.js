$(document).ready(function () {
    hljs.initHighlightingOnLoad();

    getContent();
});

function getContent() {
    var filter = {
        id: $("#id").val()
    };
    selfAjax("post", "/question", filter, function (data) {
        if (data) {
            var option = {
                highlight: function (code) {
                    return hljs.highlightAuto(code).value;
                },
                renderer: new marked.Renderer(),
                pedantic: false,
                gfm: true,
                tables: true,
                breaks: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false
            };
            $(".content .detail .title").text(data.title);
            $(".content .detail .author").html(marked(data.author, option));
            $(".content .detail .question-content").html(marked(data.content, option));
        }
    });
};