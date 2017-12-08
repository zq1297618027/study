//引用主页弹窗对象
var tip = parent.tip;
var alert = parent.alert;
var confirm = parent.confirm;
var notice = parent.notice;
var dialog = parent.dialog;
var ShowPage = parent.ShowPage;
var CloseDialog = parent.CloseDialog;
var MoreDialog = parent.MoreDialog;

//获取浏览器url参数
function request(paras) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}

/**
*修复IE6下PNG图片不能透明显示的问题
*<img src=".png" onload="fixPNG(this);" />
*/
function fixPNG(myImage) {
    var arVersion = navigator.appVersion.split("MSIE");
    var version = parseFloat(arVersion[1]);
    if ((version >= 5.5) && (version < 7) && (document.body.filters)) {
        var imgID = (myImage.id) ? "id='" + myImage.id + "' " : "";
        var imgClass = (myImage.className) ? "class='" + myImage.className + "' " : "";
        var imgTitle = (myImage.title) ? "title='" + myImage.title + "' " : "title='" + myImage.alt + "' ";
        var imgStyle = "display:inline-block;" + myImage.style.cssText;
        var strNewHTML = "<span " + imgID + imgClass + imgTitle

	   + " style=\"" + "width:" + myImage.width

	   + "px; height:" + myImage.height

	   + "px;" + imgStyle + ";"

	   + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"

	   + "(src=\'" + myImage.src + "\', sizingMethod='scale');\"></span>";
        myImage.outerHTML = strNewHTML;
    }
}


function decodeHtml(str) {
    var title = "<span>" + str + "</span>";
    var tag = $(title);
    tag = tag.children();
    if (tag.html() == null) {
        return str;
    }
    else {
        while (tag.children().html() != null) {
            tag = tag.children();
        }
    }
    return tag.html();
}

/**   
* 对Date的扩展，将 Date 转化为指定格式的String   
* 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符   
* 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
* eg:   
* (new Date()).dateFormat("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
* (new Date()).dateFormat("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04   
* (new Date()).dateFormat("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04   
* (new Date()).dateFormat("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04   
* (new Date()).dateFormat("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18   
*/
Date.prototype.dateFormat = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份     
        "d+": this.getDate(), //日     
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时     
        "H+": this.getHours(), //小时     
        "m+": this.getMinutes(), //分     
        "s+": this.getSeconds(), //秒     
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度     
        "S": this.getMilliseconds() //毫秒     
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
*获取IE版本
*/
var GetIEVer = function () {
    var sIEVer = GREI.IEVer;
    if (sIEVer != null && sIEVer != "" && sIEVer != "undefined") {
        return sIEVer;
    }
    else {
        var ua = navigator.userAgent;
        if (ua.indexOf("IE 10") > 0 || ua.indexOf("MSIE 10") > 0) return 10;
        if (ua.indexOf("IE 9") > 0 || ua.indexOf("MSIE 9.0") > 0) return 9;
        if (ua.indexOf("IE 8") > 0 || ua.indexOf("MSIE 8.0") > 0) return 8;
        if (ua.indexOf("IE 7") > 0 || ua.indexOf("MSIE 7.0") > 0) return 7;
        if (ua.indexOf("IE 6") > 0 || ua.indexOf("MSIE 6.0") > 0) return 6;
        return 0;
    }
}

/**
*获取指定名称的cookie的值
*/
var getCookieByName = function (objName) {
    var arrStr = document.cookie.split(";");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) {
            return unescape(temp[1]);
        }
    }
    return null;
}

$(function () {
    //将checkbox替换成想到的样式，Range：范围，CheckedClass，选中的样式，UnCheckedClass，没选中的样式
    (function ($) {
        $.fn.ChangeCheckbox = function (opions) {
            var defaluts = { Range: "body", CheckedClass: "checked", UnCheckedClass: "unchecked" };
            var Opions = $.extend(defaluts, opions);
            $(this).each(function () {
                $(Opions.Range + " input[type='checkbox']").each(function () {
                    var state = $(this).attr("checked") ? Opions.CheckedClass : Opions.UnCheckedClass;
                    var check = $("<span class=" + state + " name=" + $(this).attr("id") + "></span>").click(function () {
                        if ($(this).hasClass(Opions.CheckedClass)) {
                            $(this).attr("class", Opions.UnCheckedClass)
                            $(this).prev().attr("checked", false)
                        }
                        else {
                            $(this).attr("class", Opions.CheckedClass)
                            $(this).prev().attr("checked", true)
                        }
                    });
                    $(this).hide();
                    $(this).after(check);
                    var thisid = $(this).attr("id");
                    /*$("label[for=" + thisid + "]").click(function () {
                        var isC = $("#" + thisid).is(":checked");
                        var Cs = isC ? Opions.UnCheckedClass : Opions.CheckedClass;
                        $("span[name=" + thisid + "]").attr("class", Cs);
                        $("#" + thisid).attr("checked", !isC);
                    });
                    $("label[for=" + thisid + "]").css({ cursor: "pointer" });----有问题----*/
                })
            })
        }
    })(jQuery)
})

$(function () {
    //radio替换成想到的样式，Range：范围，CheckedClass，选中的样式，UnCheckedClass，没选中的样式
    (function ($) {
        $.fn.ChangeRadio = function (opions) {
            var defaluts = { Range: "body", CheckedClass: "Rchecked", UnCheckedClass: "Runchecked" };
            var Opions = $.extend(defaluts, opions);
            $(this).each(function () {
                $(Opions.Range + " input[type='radio']").each(function () {
                    var state = $(this).attr("checked") ? Opions.CheckedClass : Opions.UnCheckedClass;
                    var check = $("<span class=" + state + "  name=" + $(this).attr("name") + " id=R_" + $(this).attr("id") + "></span>").click(function () {
                        if ($(this).hasClass(Opions.CheckedClass)) {
                            return;
                            $(this).attr("class", Opions.UnCheckedClass)
                            $(this).prev().attr("checked", false)
                        }
                        else {
                            $(this).attr("class", Opions.CheckedClass)
                            $(this).prev().attr("checked", true)
                            var cID = $(this).attr("id");
                            $("#" + cID.replace("R_", "")).trigger("click");
                            $(Opions.Range + " input[type='radio'][name=" + $(this).attr("name") + "]").each(function () {
                                if ($(this).attr("id") != cID.replace("R_", "")) {
                                    $(this).next().attr("class", Opions.UnCheckedClass)
                                }
                            })
                        }
                    });
                    $(this).hide();
                    $(this).after(check);
                    var thisid = $(this).attr("id");
                    /*$("label[for=" + thisid + "]").click(function () {
                        $("#R_" + thisid).trigger("click");
                        $("#" + thisid).trigger("click");
                    });
                    $("label[for=" + thisid + "]").css({ cursor: "pointer" });----有问题----*/
                })
            })
        }
    })(jQuery)
})


/*金钱格式化
num钱的额度
unit 保留多少位小数  默认保留两位
*/
function formatCurrency(num, unit) {
    if (unit == null) { unit = 2; }
    if (isNaN(parseFloat(num))) { return ""; }
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * Math.pow(10, unit) + 0.50000000001);
    cents = num % Math.pow(10, unit);
    num = Math.floor(num / Math.pow(10, unit)).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}


        /*
*   字符格式化
*  var template1 = "我是{0}，今年{1}了";
*  var template2 = "我是{name}，今年{age}了";
*  var result1 = template1.format("loogn", 22);
*  var result2 = template1.format({ name: "loogn", age: 22 }); 
*/
        String.prototype.format = function (args) {
            if (arguments.length > 0) {
                var result = this;
                if (arguments.length == 1 && typeof (args) == "object") {
                    for (var key in args) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
                else {
                    for (var i = 0; i < arguments.length; i++) {
                        if (arguments[i] == undefined) {
                            return "";
                        }
                        else {
                            var reg = new RegExp("({[" + i + "]})", "g");
                            result = result.replace(reg, arguments[i]);
                        }
                    }
                }
                return result;
            }
            else {
                return this;
            }
        }

/*数格式化
num钱的额度
coef 数字转换系数
unit 保留多少位小数  默认保留两位
*/
function formatNumber(num, coef, unit) {
    if (unit == null) { unit = 2; }
    if (coef == null) { coef = 1; }
    if (isNaN(parseFloat(num))) { return ""; }
    return parseFloat(parseFloat(num) * parseFloat(coef)).toFixed(unit);
}

/*
* 解决IE10+版本服务器控件后台事件不支持_doPostBack方法【注页面formID为form1】
* .NET4.0漏洞，服务器打上微软“KB2836939”补丁即可.
//<![CDATA[
try {
var theForm = document.forms[0];
if (!theForm) {
theForm = document.forms["form1"];
}
function __doPostBack(eventTarget, eventArgument) {
if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
theForm.__EVENTTARGET.value = eventTarget;
theForm.__EVENTARGUMENT.value = eventArgument;
theForm.submit();
}
}
}
catch (e) { }
//]]>
*/

//对象与Json互转
jQuery.extend({
    toJSON: function (object) {
        var type = typeof object;
        if ('object' == type) {
            if (Array == object.constructor) type = 'array';
            else if (RegExp == object.constructor) type = 'regexp';
            else type = 'object'
        }
        switch (type) {
            case 'undefined':
            case 'unknown':
                return;
                break;
            case 'function':
            case 'boolean':
            case 'regexp':
                return object.toString();
                break;
            case 'number':
                return isFinite(object) ? object.toString() : 'null';
                break;
            case 'string':
                return '"' + object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function () {
                    var a = arguments[0];
                    return (a == '\n') ? '\\n' : (a == '\r') ? '\\r' : (a == '\t') ? '\\t' : ""
                }) + '"';
                break;
            case 'object':
                if (object === null) return 'null';
                var results = [];
                for (var property in object) {
                    var value = jQuery.toJSON(object[property]);
                    if (value !== undefined) results.push(jQuery.toJSON(property) + ':' + value)
                }
                return '{' + results.join(',') + '}';
                break;
            case 'array':
                var results = [];
                for (var i = 0; i < object.length; i++) {
                    var value = jQuery.toJSON(object[i]);
                    if (value !== undefined) results.push(value)
                }
                return '[' + results.join(',') + ']';
                break
        }
    }
});


