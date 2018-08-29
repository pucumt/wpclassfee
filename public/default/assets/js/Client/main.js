var hideConfirmForm;
window.showAlert = function (msg, title, callback) {
    $('#confirmModal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#confirmModal #confirmModalLabel').text(title || "提示");
    $('#confirmModal .modal-body').text(msg);

    $('#confirmModal .modal-footer .btn-default').text("确定");
    $('#confirmModal #btnConfirmSave').hide();

    hideConfirmForm = function () {
        callback && callback();
        $('#confirmModal').hide();
    };
};

window.showConfirm = function (msg, title, hidecallback) {
    $('#confirmModal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#confirmModal #confirmModalLabel').text(title || "确认");
    $('#confirmModal .modal-body').text(msg);

    $('#confirmModal .modal-footer .btn-default').text("取消");
    $('#confirmModal #btnConfirmSave').show();

    hideConfirmForm = function () {
        hidecallback && hidecallback();
        $('#confirmModal').hide();
    };
};

$(document).ready(function () {
    $("#btnAsk").click(function (e) {
        location.replace("/ask");
    });

    $("#btnSearch").click(function (e) {
        var q = $.trim($("#txtSearch").val());
        if (q.length > 2) {
            location.replace("/?q=" + q);
        } else {
            showAlert("搜索字数不能少于3个");
        }
    });

    loadCategory();

    $(".question.pull-right").on("click", "a", function (e) {
        location.href = "/category/" + $(e.currentTarget).attr("id");
    });
});

function loadCategory() {
    selfAjax("post", "/ask/category/searchall", null, function (data) {
        if (data && data.length > 0) {
            var d = $(document.createDocumentFragment());
            data.forEach(function (category) {
                d.append('<a href="#" id="{0}" style="margin-right:20px;">{1}</a>'.format(category._id, category.name));
            });
            $(".question.pull-right").append(d);
        }

        if ($("#catId").val()) {
            $(".question.pull-right #" + $("#catId").val()).addClass("active");
        }
    });
};

window.selfAjax = function (method, url, filter, callback) {
    loading();
    return $[method](
        url,
        filter
    ).then(function (data) {
        callback(data);
        hideLoading();
        return data;
    });
};

window.loading = function () {
    $("#loadingIndicator").modal({
        backdrop: 'static',
        keyboard: false
    });
};

window.hideLoading = function () {
    $("#loadingIndicator").modal('hide');
};

String.prototype.format = function () {
    var result = this;
    if (arguments.length == 0)
        return null;
    for (var i = 0; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i) + '\\}', 'gm');
        result = result.replace(re, arguments[i]);
    }
    return result;
};