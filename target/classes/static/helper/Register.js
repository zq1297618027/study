
/* 个人用户注册辅助 */

var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/; //匹配邮箱地址
var phoneReg = /^1[0-9]{10}$/; //匹配手机号码
var emptyReg = /n[s| ]*r/;
//var passwordReg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)(?![0-9A-Z\W_]+$)(?![0-9a-z\W_]+$)(?![a-zA-Z\W_]+$)[a-zA-Z0-9\W_]{6,}$/;
var passwordReg = /^(\w){6,20}$/;  //只能输入6-20个字母、数字、下划线
var nichengReg = /^[a-zA-Z][a-zA-Z0-9_]{3,17}$/; //别名验证
var times = 59; //短信验证码获取时间

function GetCode(obj) {
    var sCzmc = "用户注册验证码";
    if (document.URL.indexOf("ZC.aspx") > -1) {
        sCzmc = "用户注册";
    }
    else if (document.URL.indexOf("ZHMM.aspx") > -1) {
        sCzmc = "找回密码";
    }
    else if (document.URL.indexOf("Index.aspx") > -1) {
        sCzmc = "用户登录";
    }

    $(obj).removeAttr("onclick");
    var phone, code, bDone = true;

    if (sCzmc != "用户登录") {
        phone = $.trim($("#txtPhone").val()), code = $.trim($("#txtVFCCode").val());
    }
    else {
        phone = $.trim($("#dx_phone").val());
    }

    if (phone == "") {
        if (sCzmc != "用户登录") {
            $("#txtPhone").next(".jud-ico").show().addClass("jud-wrong").parent().next(".tip-txt").html("").hide().next(".redCol").show().html("手机号码不能为空");
        } else {
            $("#dx_errortip").css("display", "block").children("span.error").html("手机号码不能为空");
        }
        bDone = false;
    }
    else if (!phoneReg.test(phone)) {
        if (sCzmc != "用户登录") {
            $("#txtPhone").next(".jud-ico").show().addClass("jud-wrong").parent().next(".tip-txt").html("").hide().next(".redCol").show().html("手机号码格式不正确");
        } else {
            $("#dx_errortip").css("display", "block").children("span.error").html("手机号码格式不正确");
        }
        bDone = false;
    } 
    //else if (type == 2) { //找回密码是需要验证手机号是否已存在
    //    if (IsOnlyPhone(phone)) { $("#txtPhone").next(".jud-ico").show().addClass("jud-wrong").parent().next(".tip-txt").hide().next(".redCol").show().html("手机号码未注册过"); }
    //    bDone = false;
    //}
   
    //if (!$("#liPhoneVFCCode").is(":hidden")) {
    //    if (code == "") {
    //        $("#liPhoneVFCCode").closest("li").find(".redCol").show().html("验证码不能为空");
    //        ("#imgPhoneCode").attr("src", "/Account/VerificationCode?d=" + Math.random());
    //        bDone = false;
    //    }
    //    else if (code.length != 6) { $("#liPhoneVFCCode").parent().nextAll(".redCol").show().html("验证码格式不正确"); bDone = false; }
    //}

    if (bDone) {
        var sUrl =GREI.ApplicationPath + "SuiteUI/RemoteHandle/SignonHandler.ashx?action=Phoneyzm&T=" + Math.random();

        var sth = $("#iptSth").val();
        var xt = new Xxtea(sth);
        phone = xt.xxtea_encrypt(phone);

        $.ajax({
            url: sUrl,
            type: "Post",
            data: { phone: phone, czmc: sCzmc, jgmc: "***不动产登记中心" },
            async: false,
            dataType: "text",
            success: function (res) {
                if (res != "") {
                    var resObj = eval("(" + res + ")"); //转换为json对象
                    
                    if (resObj.success == "成功") {
                        times = 119;
                        $(".get-yzm").hide();
                        $(".rget-yzm").html("重新获取(" + times.toString() + ")").show();
                        setTimeout("settimes('"+sCzmc+"')", 1000);
                    }
                    else {
                        $("#imgCode").click();
                        $("#txtVFCCode").parent().parent().nextAll(".redCol").show().html(resObj.msg);
                    }

                    $("#liPhoneVFCCode").val("");
                    $(obj).attr("onclick", "GetCode(this)");
                }
            },
            error: function (response) { }
        })
    }
    else {
        $(obj).attr("onclick", "GetCode(this)");
    }
}

/* 设置短信验证码重新获取 */
function settimes(sCzmc) {
    times--;
    if (times > 0) {
        var ahtml = "重新获取(" + times.toString() + ")";
        $(".rget-yzm").html(ahtml);
        setTimeout("settimes()", 1000);
    }
    else {
        $(".rget-yzm").hide();
        $(".rrget-yzm").show();
        if (sCzmc != "用户登录") {
            checkBtnGo();
        }
    }
}

/* 1.手机号校验（1） */
function checkBoxForPhone() {
    var phone = $("#txtPhone").val().trim(), VFCCode = $("#txtVFCCode").val().trim(), Pwd = $("#txtPwdT").val(), ConfirmPwd = $("#txtTPwd").val(), Agree = $("#txtAgree").parent().is(".cur");
    isTrue = true;
    
    //手机号码
    if (phone == "") { $("#txtPhone").next(".jud-ico").show().addClass("jud-wrong").parent().next(".tip-txt").html("").hide().next(".redCol").show().html("手机号码不能为空"); isTrue = false; }
    else if (!phoneReg.test(phone)) { $("#txtPhone").next(".jud-ico").show().addClass("jud-wrong").parent().next(".tip-txt").html("").hide().next(".redCol").show().html("手机号码格式不正确"); isTrue = false; }
    
    //手机验证码
    if (VFCCode == "") { $("#txtVFCCode").parent().nextAll(".redCol").show().html("手机验证码不能为空"); isTrue = false; }
    
    //密码
    var pwdc = checkPwd("txtPwdT");
    isTrue = pwdc ? isTrue : pwdc;
    
    //确认密码
    pwdc = checkPwdCon("txtTPwd");
    isTrue = pwdc ? isTrue : pwdc;
    
    return isTrue;
}

/* 2.手机号校验（2） */
function registerByPhone(btn) {
    if (checkBoxForPhone()) {
        var formUrl = $(btn).parents("form").attr("action");
        $.post(formUrl, {
            Phone: $("#txtPhone").val(),
            Code: $("#txtVFCCode").val(),
            Password: $("#txtPwdT").val(),
            ConfirmPassword: $("#txtTPwd").val()
        }, function (result) {
            var data = eval("(" + result + ")");
            if (data.IsSuccess) {
                window.location.href = data.ShowData;
            }
            else {
                if (data.Message == "验证码错误！") { $("#uVFCCodeMeg").show().html(data.Message); }
                else if (data.Message == "用户账号已存在！") { $("#txtPhone").next(".jud-ico").show().addClass("jud-wrong").parent().next(".tip-txt").html("").hide().next(".redCol").show().html("手机号码已存在，请更换"); }
                else { $("#txtPhone").next(".jud-ico").show().addClass("jud-wrong").parent().next(".tip-txt").html("").hide().next(".redCol").show().html(data.Message); }
                $("#imgPhoneCode").attr("src", "/Account/VerificationCode?d=" + Math.random());
                $("#liPhoneVFCCode").val("");
            }
        });
    }
}

/* 3.邮箱校验（1） */
function checkBoxForEmail() {
    var phone = $("#txtEmail").val().trim(), VFCCode = $("#txtEmailVFCCode").val().trim(), Pwd = $("#txtEmailPwd").val(), ConfirmPwd = $("#txtEmailConfirmPwd").val(), Agree = $("#txtEmailAgree").parent().is(".cur");
    isTrue = true;
    
    //邮箱
    if (phone == "") { $("#txtEmail").next(".jud-ico").addClass("jud-wrong").show().parent().next(".tip-txt").html("").hide().next(".redCol").show().html("邮箱不能为空"); isTrue = false; }
    else if (!emailReg.test(phone)) { $("#txtEmail").next(".jud-ico").addClass("jud-wrong").show().parent().next(".tip-txt").html("").hide().next(".redCol").show().html("邮箱格式不正确"); isTrue = false; }
    
    //验证码
    if (VFCCode == "") { $("#txtEmailVFCCode").parent().nextAll(".redCol").show().html("请输入验证码"); isTrue = false; }
    
    //密码
    var pwdc = checkPwd("txtEmailPwd");
    isTrue = pwdc ? isTrue : pwdc;
    
    //确认密码
    pwdc = checkPwdCon("txtEmailConfirmPwd");
    isTrue = pwdc ? isTrue : pwdc;
    
    return isTrue;
}

/* 4.邮箱校验（2） */
function registerByEmail(btn) {
    if (checkBoxForEmail()) {
        var formUrl = $(btn).parents("form").attr("action");
        $(btn).attr("disabled", "disabled").val("注册中,请稍等");
        $.post(formUrl, {
            Email: $("#txtEmail").val(),
            Code: $("#txtEmailVFCCode").val(),
            Password: $("#txtEmailPwd").val(),
            ConfirmPassword: $("#txtEmailConfirmPwd").val()
        }, function (result) {
            $(btn).removeAttr("disabled").val("立即注册");
            var data = eval("(" + result + ")");
            if (data.IsSuccess) {
                window.location.href = data.ShowData;
            }
            else {
                if (data.Message == "验证码错误！") { $("#uEmailVFCCodeMeg").html(data.Message); }
                else if (data.Message == "用户账号已存在！") { $("#txtEmail").next(".jud-ico").addClass("jud-wrong").show().parent().next(".tip-txt").html("").hide().next(".redCol").show().html("邮箱已存在，请更换！"); }
                else { $("#txtEmail").next(".jud-ico").addClass("jud-wrong").show().parent().next(".tip-txt").html("").hide().next(".redCol").show().html(data.Message); }
                $("#imgEmailCode").attr("src", "/Account/VerificationCode?d=" + Math.random());
                $("#txtEmailVFCCode").val("");
            }
        });
    }
}

/* 5.用户别名校验 */
function checkNC(nicheng) {
    var v = $.trim($("#" + nicheng).val());
    var pwd = $.trim($("#txtPwdT").val());
    if (v == "") { $("#" + nicheng).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("昵称不能为空"); return false; }
    else if (emptyReg.test(v)) { $("#" + nicheng).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("昵称不能含有空格"); return false; }
    //else if (v.length < 4 || v.length > 20) { $("#" + nicheng).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("昵称请保持4-20位"); return false; }
    //else if (!nichengReg.test(v)) { $("#" + nicheng).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("字母开头，允许4-18字节，允许字母数字下划线"); return false; }
    //else if (v == pwd) { $("#" + nicheng).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("字母开头，允许4-18字节，允许字母数字下划线"); return false; }
    else { $("#" + nicheng).next(".jud-ico").show().removeClass("jud-wrong").parent().next(".redCol").html("").hide(); return true; }
}

/* 6.用户姓名校验 */
function checkName(name) {
    var v = $.trim($("#" + name).val());
    var pwd = $.trim($("#txtPwdT").val());
    if (v == "") { $("#" + name).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("请填写真实姓名"); return false; }
    else if (emptyReg.test(v)) { $("#" + name).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("真实姓名不能含有空格"); return false; }
    else { $("#" + name).next(".jud-ico").show().removeClass("jud-wrong").parent().next(".redCol").html("").hide(); return true; }
}

/* 7.密码校验（1） */
function checkPwd(pwdName) {
    var passwordReg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)(?![0-9A-Z\W_]+$)(?![0-9a-z\W_]+$)(?![a-zA-Z\W_]+$)[a-zA-Z0-9\W_]{6,}$/;
    var v = $.trim($("#" + pwdName).val());
    var nc = $.trim($("#txtUser").val());
    if (v == "") { $("#" + pwdName).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("密码不能为空"); return false; }
    else if (emptyReg.test(v)) { $("#" + pwdName).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("密码不能含有空格"); return false; }
    else if (v.length < 6 || v.length > 20) { $("#" + pwdName).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("密码请保持6-20位"); return false; }
    else if (!passwordReg.test(v)) { $("#" + pwdName).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("密码必须包含大小写字母和数字"); return false; }
    else if (nc ==v) { $("#" + pwdName).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("昵称和密码不能相同"); return false; }
    else { $("#" + pwdName).next(".jud-ico").show().removeClass("jud-wrong").parent().next(".redCol").html("").hide(); return true; }
}

/* 8.密码校验（2） */
function checkPwdCon(pwdName) {
    var v = $.trim($("#" + pwdName).val()), pwd = $.trim($("#txtPwdT").val());
    if (v == "") { $("#" + pwdName).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("确认密码不能为空"); return false; }
    else if (v != pwd) { $("#" + pwdName).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("两次密码不一致"); return false; }
    else { $("#" + pwdName).next(".jud-ico").show().removeClass("jud-wrong").parent().next(".redCol").html("").hide(); return true; }
}

/* 9.邮箱校验 */
function checkEmail(email) {
    var v = $.trim($("#" + email).val());
    if (v == "") { $("#" + email).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("邮箱不能为空"); return false; }
    else if (emptyReg.test(v)) { $("#" + email).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("邮箱不能含有空格"); return false; }
    else if (!emailReg.test(v)) { $("#" + email).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("邮箱格式不正确"); return false; }
    else { $("#" + email).next(".jud-ico").show().removeClass("jud-wrong").parent().next(".redCol").html("").hide(); return true; }
}

/* 10.动态验证码校验 */
function checkYZM(yzm) {
    var v = $.trim($("#" + yzm).val());
    if (v == "") { $("#" + yzm).parent().nextAll(".redCol").show().html("验证码不能为空"); verifyCode.refresh(); return false; }
    else if (!verifyCode.validate($("#txtYZM").val())) { $("#" + yzm).parent().nextAll(".redCol").show().html("验证码不匹配"); verifyCode.refresh(); return false; }
    else { $("#" + yzm).parent().nextAll(".redCol").html("").hide(); return true;}
}

/* 11.手机号码校验 */
function checkPhone(phone) {
    var v = $.trim($("#" + phone).val());

    if (v == "") { $("#" + phone).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("手机号码不能为空"); return false; }
    else if (!phoneReg.test(v)) { $("#" + phone).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("手机号码格式不正确"); return false; }
    else if (type=="zhmm" &&IsOnlyPhone(v)){
        $("#" + phone).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("手机号码未注册过"); return false;
    }
    else if (type=="zcxx" && (!IsOnlyPhone(v))){ $("#" + phone).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("手机号码已存在，请更换"); return false; }
    else { $("#" + phone).next(".jud-ico").show().removeClass("jud-wrong").parent().next(".redCol").html("").hide(); return true; }
}

/* 12.手机验证码校验 */
function checkPhoneYzm(phonezym) {
    var v = $.trim($("#" + phonezym).val());
    if (v == "") { $("#" + phonezym).parent().parent().nextAll(".redCol").show().html("手机验证码不能为空"); return  false; }
    else if (v.length != 6) { $("#" + phonezym).parent().parent().nextAll(".redCol").show().html("手机验证码不正确"); return  false; }
    else if (!CheckPhoneYZM(v)) { $("#" + phonezym).parent().parent().nextAll(".redCol").show().html("手机验证码不正确"); return false; }
    else { $("#" + phonezym).parent().parent().nextAll(".redCol").html("").hide();return true; }
}

/* 验证手机号码唯一性 */
function IsOnlyPhone(sPhone) {
    var pass = true;
    var sUrl = GREI.ApplicationPath + "SuiteUI/RemoteHandle/SignonHandler.ashx?action=CheckOnlyPhone&T=" + Math.random();

    var sth = $("#iptSth").val();
    if (!sth) sth = GREI.Sth;
    var xt = new Xxtea(sth);
    sPhone = xt.xxtea_encrypt(sPhone);

    $.ajax({
        url: sUrl,
        type: "Post",
        data: { phone: sPhone },
        async: false,
        dataType: "text",
        success: function (res) {
            if (res != "") {
                var resObj = eval("(" + res + ")"); //转换为json对象

                if (resObj.success == "成功") {
                    pass = true;
                }
                else {
                    pass = false;
                }
            }
        },
        error: function (response) {
            pass = false;
        }
    });
    return pass;
}

/* 验证手机验证码 */
function CheckPhoneYZM(sPhoneYZM) {

    var pass = true;
    var sUrl = GREI.ApplicationPath + "SuiteUI/RemoteHandle/SignonHandler.ashx?action=CheckPhoneyzm&T=" + Math.random();
    var sPhone = $("#txtPhone").val();

    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);

    sPhone = xt.xxtea_encrypt(sPhone);
    sPhoneYZM = xt.xxtea_encrypt(sPhoneYZM);

    $.ajax({
        url: sUrl,
        type: "Post",
        data: { phone: sPhone, PhoneYzm: sPhoneYZM },
        async: false,
        dataType: "text",
        success: function (res) {
            if (res != "") {
                var resObj = eval("(" + res + ")"); //转换为json对象

                if (resObj.success == "成功") {
                    pass = true;
                }
                else {
                    pass = false;
                }
            }
        },
        error: function (response) {
            pass = false;
        }
    });
    return pass;
}

/* 修改密码 */
function UpdatePasswd() {
    var res = "ok";
    //验证密码方法
    var sPhone = $("#txtPhone").val();
    var sPasswd = $("#txtPwdT").val();

    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    sPhone = xt.xxtea_encrypt(sPhone);
    sPasswd = xt.xxtea_encrypt(sPasswd);

    $.ajax({
        type: "POST",
        url: GREI.ApplicationPath + "SuiteUI/RemoteHandle/SignonHandler.ashx?action=UpdatePasswd&T=" + Math.random(),
        dataType: 'text',
        data: {
            Phone: sPhone,
            PASSWD: sPasswd
        },
        async: false,
        success: function (res) {
            if (res != "") {
                var resObj = eval("(" + res + ")"); //转换为json对象
                if (resObj.success == "成功") {

                }
                else { //失败
                    res = "error";
                }
            }
        }
    });

    return res;
}

$(function () {
    $(".tip-txt").hide();
    $(".jud-ico").hide();

    $("#txtPhone").focus(function () {
        $(this).next(".jud-ico").html("").hide().parent().next(".redCol").html("").hide();
    }).blur(function () {
        var v = $(this).attr("id");
        isTrue = checkPhone(v);
        checkBtnGo();
    });

    $("#txtYZM").focus(function () {
        $(this).parent().next(".redCol").html("").hide()
    }).blur(function () {
        var v = $.trim($(this).val());
        if (v == "") { $(this).parent().nextAll(".redCol").show().html("验证码不能为空"); verifyCode.refresh(); isTrue = false; }
        else if (!verifyCode.validate($("#txtYZM").val())) { $(this).parent().nextAll(".redCol").show().html("验证码不匹配"); verifyCode.refresh(); isTrue = false; }
        else { $(this).parent().nextAll(".redCol").html("").hide(); }

    });

    $("#txtVFCCode").focus(function () {
        $(this).parent().parent().nextAll(".redCol").html("").hide()
    }).blur(function () {
        var v = $.trim($(this).val());
        if (v == "") { $(this).parent().parent().nextAll(".redCol").show().html("手机验证码不能为空"); isTrue = false; }
        else if (v.length != 6) { $(this).parent().parent().nextAll(".redCol").show().html("手机验证码不正确"); isTrue = false; }
        else if (!CheckPhoneYZM(v)) { $(this).parent().parent().nextAll(".redCol").show().html("手机验证码不正确"); isTrue = false; }
        else { $(this).parent().parent().nextAll(".redCol").html("").hide(); }
        checkBtnGo();
    });

    $("#txtUser").focus(function () {
        $(this).next(".jud-ico").html("").hide().parent().next(".redCol").html("").hide();
    }).blur(function () {
        var v = $(this).attr("id");
        isTrue = checkName(v);
    });

    $("#txtPwdT").focus(function () {
        $(this).next(".jud-ico").html("").hide().parent().next(".redCol").hide();
    }).blur(function () {
        var v = $(this).attr("id");
        isTrue = checkPwd(v);
        checkBtnGo();
    });

    $("#txtTPwd").focus(function () {
        $(this).next(".jud-ico").html("").hide().parent().next(".redCol").hide();
    }).blur(function () {
        var v = $(this).attr("id");
        isTrue = checkPwdCon(v);
        checkBtnGo();
    });

    //邮箱地址
    $("#txtEmail").focus(function () {
        $(this).next(".jud-ico").html("").hide().parent().next(".redCol").hide()
    }).blur(function () {
        var v = $(this).attr("id");
        isTrue = checkEmail(v)
    });

    //身份证号码，需要实名认证的
    $("#txtIdcard").focus(function () {
        $(this).next(".jud-ico").show().addClass("jud-wrong").parent().parent().next(".redCol").hide();
    }).blur(function () {
        var v = $(this).attr("id");
        isTrue = CheckIDCard(v, true);
    });

    //身份证号码，不需要实名认证的
    $("#txtRIdcard").focus(function () {
        $(this).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").hide();
    }).blur(function () {
        var v = $(this).attr("id");
        isTrue = CheckRIDCard(v);
    });
});

function checkBtnGo() {
    var sforcurL = $(".flow .flowListBox .for-cur").length;
    if (sforcurL == 0) {
        var sTtr = $.trim($("#txtPhone").parent().parent().children(".redCol").html());
        var sItr = $.trim($("#txtIdcard").parent().parent().children(".redCol").html());
        if (sTtr == "" && $("#txtPhone").val().length > 0) {
            $(".get-yzm-f").attr("onclick", "GetCode(this)").removeClass("disabled");
            if (!$("#txtAuth").hasClass("disabled") && CheckCardId(sItr) && emptyReg.test(sItr) && sItr!="") {
                $("#txtAuth").removeClass("disabled");
            }
        }
    } else if (sforcurL == 1) {
        $("#oneBack").prop("disabled", "disabled");
        var sTr = $.trim($("#txtPhone").parent().parent().children(".redCol").html());
        if (sTr == "") {
            $(".goForward").prop("disabled", "disabled");
            $(".get-yzm-f").attr("onclick", "GetCode(this)").removeClass("disabled");
            var sTrr = $.trim($("#txtVFCCode").parent().parent().parent().children(".redCol").html());
            if ($("#txtVFCCode").val().length > 0 && sTrr == "") {
                $(".goForward").removeAttr("disabled");
            } else {
                $(".goForward").prop("disabled", "disabled");
            }
        }
    } else if (sforcurL == 2) {
        $(".goBack").removeAttr("disabled");
        //var sTr = $.trim($(".redCol").html());
        var strOK;
        //保存更新密码
        if ($("#txtPwdT").val().length > 0 && $("#txtTPwd").val().length > 0 && $.trim($(".redCol").html()) == "") {
            strOK = UpdatePasswd();
            if (strOK=="ok") {
                $(".goForward").removeAttr("disabled");            
            }else{
                $("#showM").showmodal({
                    flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
                    title: "提示信息",    //设置模态窗标题
                    content: "密码修改失败！", //设置模态窗内容
                    Tclose: false //设置右上角关闭按钮是否显示，默认为显示
                });
            }
        }
    } else if (sforcurL == 3) {

    }
}

//对需要实名认证的帐号进行身份证号码验证
function CheckIDCard(card, b) {
    var reg = /^\d{15}|\d{17}[0-9Xx]/;
    var emptyReg = /n[s| ]*r/;
    var v = $.trim($("#" + card).val());
    if (v == "") {
        $("#" + card).next(".jud-ico").show().addClass("jud-wrong").parent().parent().next(".redCol").show().html("身份证号码不能为空");
        return false;
    } else if (emptyReg.test(v)) {
        $("#" + card).next(".jud-ico").show().addClass("jud-wrong").parent().parent().next(".redCol").show().html("身份证号码不能含有空格");
        return false;
    } else if (!CheckCardId(v)) {
        $("#" + card).next(".jud-ico").show().addClass("jud-wrong").parent().parent().next(".redCol").show().html("身份证号码格式不正确");
        return false;
    } else {
        //启用实名认证按钮
        if ($("#txtAuth").hasClass("disabled")) {
            $("#txtAuth").removeClass("disabled");
            $("#txtAuth").prop("disabled", false);
        }

        if (!sVerified && !b) { //点击注册按钮时，发现未做实名认证则提示
            $("#" + card).next(".jud-ico").show().addClass("jud-wrong").parent().parent().next(".redCol").show().html("请进行实名认证");
        }

        isTrue = sVerified;

        if (isTrue) {
            $("#" + card).next(".jud-ico").show().removeClass("jud-wrong").parent().parent().next(".redCol").html("").hide()
        }

        return sVerified;
        
        /*var sTr = $.trim($("#txtVFCCode").parent().parent().parent().children(".redCol").html());
        if (sTr == "" && $.trim($("#txtVFCCode").val()) != "" && $.trim($("#txtUser").val()) != "") {
            if ($("#txtAuth").hasClass("disabled")) {
                $("#txtAuth").removeClass("disabled");
                $("#txtAuth").prop("disabled",false);
            }
            if (!sVerified) {
                $("#" + card).next(".jud-ico").show().addClass("jud-wrong").parent().parent().next(".redCol").show().html("请进行实名认证。");
            }
            isTrue = sVerified;
            return sVerified;
        } else if ($.trim($("#txtVFCCode").val()) == "" || $.trim($("#txtUser").val()) == "") {
            $("#" + card).next(".jud-ico").show().addClass("jud-wrong").parent().parent().next(".redCol").show().html("验证码和姓名不能为空，请输入对应值。");
            return false;            
        } else {
            $("#" + card).next(".jud-ico").show().removeClass("jud-wrong").parent().parent().next(".redCol").html("").hide();
            return true;
        }*/
    }
}

//对不需要实名认证的帐号进行身份证号码验证
function CheckRIDCard(card) {
    var reg = /^\d{15}|\d{17}[0-9Xx]/;
    var emptyReg = /n[s| ]*r/;
    var v = $.trim($("#" + card).val());
    if (v == "") { $("#" + card).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("身份证号码不能为空"); return false; }
    else if (emptyReg.test(v)) { $("#" + card).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("身份证号码不能含有空格"); return false; }
    else if (!CheckCardId(v)) { $("#" + card).next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("身份证号码格式不正确"); return false; }
    else { $("#" + card).next(".jud-ico").show().removeClass("jud-wrong").parent().next(".redCol").html("").hide(); return true; }
}

//对用户进行实名认证
function VerifyUserInfo(sName, sZJHM, sSJH) {
    //传输之前进行数据加密
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    sName = xt.xxtea_encrypt(sName);
    sZJHM = xt.xxtea_encrypt(sZJHM);
    sSJH = xt.xxtea_encrypt(sSJH);
    $.ajax({
        type: "POST",
        url: GREI.ApplicationPath + 'SuiteUI/RemoteHandle/SignonHandler.ashx?T=' + Math.random(),
        dataType: 'text',
        data: {
            action: 'ZCVerifyUserInfo',
            xm: sName,
            sfz: sZJHM,
            sjh: sSJH
        },
        async: false,
        success: function (res) {
            if (res != "") {
                if (parseInt(res) === 1) {
                    sVerified = true;
                    $("#btnLogin").removeClass("disabled");
                    $("#selRZFS").next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("");
                    $("#selRZFS").next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").next(".greenCol").show().html("实名认证成功");                  
                    //$("#txtIdcard").parent().parent().find("#txtAuth").removeClass("btn-primary").addClass("btn-success").html("实名认证成功");
                    //$("#txtRIdcard").next(".jud-ico").show().addClass("jud-wrong").parent().parent().next(".redCol").show().html("");
                } else {
                    $("#btnLogin").addClass("disabled");
                    $("#selRZFS").next(".jud-ico").show().addClass("jud-wrong").parent().next(".redCol").show().html("实名认证失败，请确认书写的姓名，手机号，和身份证是否匹配");
                    $("#selRZFS").val("请选择");
                }
            }
        }
    })
}