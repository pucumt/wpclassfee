$(document).ready(function () {
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
});