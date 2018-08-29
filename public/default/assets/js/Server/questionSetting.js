$(document).ready(function () {
    $("#left_btnQuestion").on("click", function (e) {
        location.href = "/admin/questionList";
    });

    $("#left_btnCategory").on("click", function (e) {
        location.href = "/admin/categoryList";
    });

    $(".admin-nav .menu-top #header_btnQuestion").addClass("active");
});