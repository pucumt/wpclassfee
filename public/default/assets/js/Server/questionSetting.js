$(document).ready(function () {
    $("#left_btnQuestion").on("click", function (e) {
        location.href = "/admin/questionList";
    });

    $(".admin-nav .menu-top #header_btnQuestion").addClass("active");
});