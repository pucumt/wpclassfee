$(document).ready(function () {
    $('.login form').formValidation({
        // List of fields and their validation rules
        fields: {
            name: {
                trigger: "blur change",
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    }
                }
            },
            password: {
                trigger: "blur change",
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    }
                }
            }
        }
    });

    if (location.search.startsWith("?err")) {
        $(".login .warning").text("用户名或密码不正确！");
    }
});