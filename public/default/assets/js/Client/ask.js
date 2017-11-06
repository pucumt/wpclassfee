$(document).ready(function () {
    if ($("#id").val()) {
        $("#name").attr("disabled", "disabled");
    }

    $('.content.ask form').formValidation({
        // List of fields and their validation rules
        fields: {
            name: {
                trigger: "blur change",
                validators: {
                    notEmpty: {
                        message: '问题标题不能为空'
                    }
                }
            }
        }
    });

    $("#btnSubmit").click(function (e) {
        var validator = $('.content.ask form').data('formValidation').validate();
        if (validator.isValid()) {
            $("#btnSubmit").attr("disabled", "disabled");
            var filter = {
                id: $("#id").val(),
                name: $("#name").val(),
                content: $("#content").val()
            };
            selfAjax("post", "/ask", filter, function (data) {
                $("#btnSubmit").removeAttr("disabled");
                if (data.error) {
                    showAlert(data.error);
                    return;
                }
                location.replace("/");
            });
        }
    });
});