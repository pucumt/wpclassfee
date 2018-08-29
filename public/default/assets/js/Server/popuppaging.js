var setPaging = function (formStr, data, callBack) {
    $(formStr + " #total").val(data.total);
    $(formStr + " #page").val(data.page);
    var total = data.total,
        curPage = data.page;
    var totalPage = Math.ceil(total / 14);
    $(formStr + " .paging .total").text(total.toString());
    $(formStr + " .paging .page").text(curPage.toString() + "/" + totalPage.toString());

    if (data.isFirstPage) {
        $(formStr + " .paging .prepage").hide();
        // $(formStr + " .paging .firstpage").hide();
    } else {
        $(formStr + " .paging .prepage").show();
        // $(formStr + " .paging .firstpage").show();
    }
    if (data.isLastPage) {
        $(formStr + " .paging .nextpage").hide();
        // $(formStr + " .paging .endpage").hide();
    } else {
        $(formStr + " .paging .nextpage").show();
        // $(formStr + " .paging .endpage").show();
    }

    $(formStr + " .paging .prepage").off("click").on("click", function (e) {
        var page = parseInt($(formStr + " .paging #page").val()) - 1;
        callBack(page);
    });

    $(formStr + " .paging .nextpage").off("click").on("click", function (e) {
        var page = parseInt($(formStr + " .paging #page").val()) + 1;
        callBack(page);
    });

    $(formStr + " .paging #btnGo").off("click").on("click", function (e) {
        var page = parseInt($(formStr + " .paging #topage").val());
        if (page > totalPage) {
            page = totalPage;
            $(formStr + " .paging #topage").val(page);
        }
        callBack(page);
    });
};