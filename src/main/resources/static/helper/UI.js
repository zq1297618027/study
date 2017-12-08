var colorList;
var count;


function timer(intDiff, url) {
    var time = window.setInterval(function () {
        var second = 0; //默认值		
        if (intDiff > 0) {
            second = Math.floor(intDiff);
        }
        else if (intDiff <= 0) { 
            if (url != "") {
                location.href = url;
            } else {
                location.href = '../Index.aspx';
            }
        }
        $('#second_show').html(second + '秒');
        intDiff--;
    }, 1000);

    return time;
}

function Format(val) {
    if (val == null || typeof (val) == "undefined" || (val + "") == "null") {
        return "";
    } else {
        return val + "";
    }
} 

function returnMain() {
    location.href = '../Index.aspx';
}

function checkColor(color) {
    if (color != "default") {  
        $(".flowList.for-cur,.flowListBox .for-cur em").css({ "background-color": color });
        $(".flowListBox .for-cur strong,.successs h3").css({ "color": color });
    } else {
        $this = $('.flowList:not(.for-cur)');
        $this.css({ "background-color": "#ccc" });
        $this.children("em").css({ "background-color": "#ccc" });
        $this.children("strong").css({ "color": "#ccc" });
    }
}
//页面跳转行为
function methodBtn(index, method, end, url) {  
    url = Format(url);
    if (url.indexOf("Register.aspx") > -1) {
        if (Format($("#iptMsg").val()) != "" && method == "forward" && index == "third") {
            return false;
        }
    }
    $("#" + index + "div").siblings("div").addClass("hide");
    $("#" + index + "div").removeClass("hide");
    if (method == "back") {
        var afterDiv = findAfter(index);  
        $(".for" + afterDiv).removeClass("for-cur");
        checkColor("default");
        $("#oneBack").prop("disabled", "disabled");
    } else if (method == "forward") { 
        if (index != "first") {
            $(".goBack").removeAttr("disabled");
        } 
        $(".goForward").prop("disabled", "disabled");
        $(".for" + index).addClass("for-cur");
        checkColor(colorList);
        bthControl("#" + index + "div")
        if (index == "third") {
            //保存更新密码
            //UpdatePasswd();

        } else if (index == "sec") {
            //验证
            if (isTrue) {
                //alert(1);
            }

        } 
    }
    if (end == true) {
        timer(5, url);
    }
}

function bthControl(index) {
    index = Format(index);
    if (index == "") {
        $("#oneforward").removeAttr("disabled");
    } else {
        $(".goBack").removeAttr("disabled");
        $(".goForward").removeAttr("disabled");
    }
}

function findAfter(index) {
    if (index == "first") {
        return "sec";
    } else if (index == "sec") {
        return "third";
    } else if (index == "third") {
        return "four";
    } else if (index == "four") {
        return "fifth";
    } else if (index == "fifth") {
        return "sixth";
    } else if (index == "sixth") {
        return "seventh";
    }
}
