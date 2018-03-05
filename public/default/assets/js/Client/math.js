$(document).ready(function () {
    var wrongList, a, b, o, r, right = 0,
        wrong = 0,
        total = 10,
        inputResult = "";

    function generate() {
        o = Math.round(Math.random());
        a = Math.round(Math.random() * 9);
        b = (o == 0 ? Math.round(Math.random() * 9) : Math.round(Math.random() * a));
        r = (o == 0 ? a + b : a - b);
        var result = a + (o == 0 ? "+" : "-") + b;
        $(".math .mbody").text(result);
        return result;
    };

    $(".next").on("click", function (e) {
        if ($.trim($(".math .mresult").text()) == "") {
            return;
        }

        inputResult = "";
        if (r == $(".math .mresult").text()) {
            right++;
        } else {
            wrong++;
        }
        $(".result .score .right").text(right);
        $(".result .score .wrong").text(wrong);
        total--;
        $(".result .number span").text(total);
        $(".math .mresult").text("");
        if (total == 0) {
            setTimeout(function () {
                window.alert("你已全部完成了");
            }, 0);
            return;
        }

        generate();
    });

    generate();

    $(".numTable").on("click", ".row .col-4", function (e) {
        var input = $(e.target).text();
        switch (input) {
            case "X":
                $(".math .mresult").text("");
                inputResult = "";
                break;
            case "&sdot;":
                return;
            default:
                if (inputResult && inputResult.length > 1) {
                    return;
                }
                // if (inputResult == null) {
                inputResult += input;
                $(".math .mresult").text(inputResult);
                // }
                return;
        }
    });
});