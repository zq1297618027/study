/**
* Created by wu Eva on 2017/03/31.
*/
var mheight;
var strCXFS;
var g_g;
//在JQ中注册字数限制组件
jQuery.fn.limit = function() {
	var self = $("[limit]");
	self.each(function() {
		var objString = $(this).text();
		var objLength = $(this).text().length;
		var num = $(this).attr("limit");
		if (objLength > num) {
			$(this).attr("title", objString);
			objString = $(this).text(objString.substring(0, num) + '...');
		}
		$(this).attr("title","");
		})
}


//检查页面用户登录状态，及时刷新界面显示的用户信息
function checkLoginS(checkShow) {
    if (checkShow == "") {
        $("#forRLogin,.welcome").addClass("hidden");
        $("#forLogin,#forReg").removeClass("hidden");
    } else {
        $("#forLogin,#forReg").addClass("hidden");
        $("#forRLogin,.welcome").removeClass("hidden");
    }
}

//调整页面垂直水平居中
function adjustCenter(obj, childobj) {
    // 是childobj居中。。。  
    var $childobj = obj.find(childobj);
    //获取可视窗口的高度  
    //var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    var clientHeight = $(document.body).parent().parent().height();
    var clientWidth = $(document.body).parent().parent().width();
    //得到dialog的高度  
    var childHeight = $childobj.height() + 100;
    var childWidth = $childobj.width();
    //计算出距离顶部的高度  
    var m_top;
    var m_left;

    if (childobj == "#showBox") {
        m_top = Math.abs((clientHeight - childHeight) / 8);
        m_left = Math.abs((clientWidth - childWidth) / 2);
        if (clientWidth > 1024) {
            $childobj.css({ 'margin': m_top + 'px auto ', 'padding-left': +m_left + 'px ', 'padding-right': +m_left + 'px ' });
        } else {
            $childobj.css({ 'padding-left': +m_left + 'px ', 'padding-right': +m_left + 'px ' });
        }

        //checkPanelCss(clientWidth, $childobj);
    } else {
        m_top = Math.abs((clientHeight - childHeight) / 2);
        m_left = Math.abs((clientWidth - childWidth) / 2);
        $childobj.css({ 'margin': m_top + 'px ' + m_left + 'px ' });
    }
 
}

//调整页面垂直居中
function adjustHCenter(obj, childobj) {
    // 是childobj居中。。。  
    var $childobj = $(obj).find(childobj);
    //获取可视窗口的高度  
    var parentHeight = $(obj).height();
    //得到dialog的高度  
    var childHeight = $childobj.height();
    //计算出距离顶部的高度  
    var m_top = Math.abs((parentHeight - childHeight) / 2);
    if ($childobj.attr("id") == "menuDiv") {
        $childobj.css({ 'margin-top': m_top*0.7 + 'px' });
    } else {
        $childobj.css({ 'margin-top': m_top + 'px', 'margin-bottom': m_top + 'px' });
    }
    
}

//调整页面为父节点底部
function adjustBCenter(obj, childobj) {
    // 是childobj居中。。。  
    var $childobj = $(obj).find(childobj);
    //获取可视窗口的高度  
    var parentHeight = $(obj).height();
    var parentWidth = $(obj).width();
    //得到dialog的高度  
    var childHeight = $childobj.height()+5;
    //计算出距离顶部的高度  
    var m_top = Math.abs(parentHeight - childHeight);
    var m_right = Math.abs(parentWidth*0.02);
    if ($childobj.children("ol").attr("id") == "tipbtn") {
        $childobj.css({ 'top': m_top + 'px', 'right': m_right + 'px' });
    } else if ($childobj.attr("id") == "tipList") {
        $childobj.css({ 'top': m_top + 'px', 'left': m_right + 'px' });
    } else {
        $childobj.css({ 'top': m_top + 'px'});
    }
    
    if ($childobj.children("ol").attr("id") == "tipbtn") {
        $childobj.css({ 'top': m_top + 'px', 'right': m_right + 'px' });
    } else if ($childobj.attr("id") == "tipList") {
        $childobj.css({ 'top': m_top + 'px', 'left': m_right + 'px' });
    } else {
        $childobj.css({ 'top': m_top + 'px'});
    }


}


//监听backspace的操作对象
function checkBack(event) {  
      
        // 兼容FF和IE和Opera    
        var Event = event || window.event;    
        //获取事件对象    
        var elem = Event.relatedTarget || Event.srcElement || Event.target || Event.currentTarget;
        //console.log("Event.which" + Event.which);
        if (Event.keyCode == 8) {//判断按键为backSpace键    
            
                //获取按键按下时光标做指向的element    
                var elem = Event.srcElement || Event.currentTarget;     
                    
                //判断是否需要阻止按下键盘的事件默认传递    
                var name = elem.nodeName;    
                    
                if(name!='INPUT' && name!='TEXTAREA'){
                    return _stopIt(Event);    
                }    
                var type_e = elem.type.toUpperCase();    
                if(name=='INPUT' && (type_e!='TEXT' && type_e!='TEXTAREA' && type_e!='PASSWORD' && type_e!='FILE')){
                    return _stopIt(Event);    
                }
                if (name == 'INPUT' && (elem.readOnly == true || elem.disabled == true)) {
                    return _stopIt(Event);    
                }
                }
        /*$(window).bind("help",function(){
             return false      //屏蔽F1帮助  
         });
         $(document).bind("contextmenu", function () {
              event.returnValue = false; //屏蔽鼠标右键
         });
         onkeydown(Event);*/
                 
}    

//判断是否需要阻断backspace的事件 
function _stopIt(e){    
        if(e.returnValue){    
            e.returnValue = false ;    
        }    
        if(e.preventDefault ){    
            e.preventDefault();    
        }                   
    
        return false;
}

//监听其他按键的事件执行状态
function onkeydown(event) {
    //console.log("event.which" + event.which);
    if ((event.altKey) && ((event.keyCode == 37) || //屏蔽Alt+方向键←    

	(event.keyCode == 39))) { //屏蔽Alt+方向键→ 

        //console.log("不准你使用ALT+方向键前进或后退网页！");

        event.returnValue = false;

    }
    if ((event.keyCode == 116) || //屏蔽F5刷新键    

	(event.ctrlKey && event.keyCode == 37)) { //Ctrl+R    
        event.keyCode = 0;
        event.returnValue = false;

    }

    if (event.keyCode == 122) {
        event.keyCode = 0;
        event.returnValue = false;
    } //屏蔽F11    

    if (event.ctrlKey && event.keyCode == 78) event.returnValue = false; //屏蔽Ctrl+n    

    if (event.shiftKey && event.keyCode == 121) event.returnValue = false; //屏蔽shift+F10    

    if (event.srcElement.tagName == "A" && event.shiftKey)

        event.returnValue = false; //屏蔽shift加鼠标左键新开一网页    

    if ((event.altKey) && (event.keyCode == 115)) { //屏蔽Alt+F4     

        showModelessDialog("about:blank", "", "dialogWidth:1px;dialogheight:1px");

        return false;

    }

}

//检查字符串是否满足电话号码的正则表达式
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//格式化
function Format(sVal) {
    if (sVal == null || sVal + "" == "null" || typeof (sVal) == "undefined") {
        return "";
    }
    else {
        return "" + sVal;
    }
}



//绑定页面上按钮相关事件
function checkBtnD() {

    //将userCode转为mobile
    var url = GREI.ApplicationPath + "SuiteUI/RemoteHandle/SignonHandler.ashx?action=username&T=" + Math.random();
    $.ajax({
        type: "POST",
        url: url,
        dataType: "text",
        success: function (res) {
            //显示之前进行数据解密
            var sth = $("#iptSth").val();
            var xt = new Xxtea(sth);
            if (res != "") {
                $(".welcome").html("欢迎您！<br/>" + xt.xxtea_decrypt(res) + "<br/>");
                rcheckTipBtn();
            }
        },
        error: function (res) { }
    });


    $("#forLogin").click(function () {
        var v_width, v_height;
        $('#LoginModal').modal({ backdrop: 'static', keyboard: false });
        if (tempCheck) {
            v_width = $("#v_container").width() > 152 ? $("#v_container").width() : 152;
            v_height = $(".glyphicon-info-sign").height() > 34 ? $(".glyphicon-info-sign").height() : 34;
            $("#verifyCanvas").css({ "width": v_width, "height": v_height });
            $("#v_container").css({ "height": v_height });
        } else if (!tempCheck && g_loginCount>0) {
            v_width = $("#v_container").width() > 152 ? $("#v_container").width() : 152;
            v_height = $(".glyphicon-info-sign").height() > 34 ? $(".glyphicon-info-sign").height() : 34;
            $("#verifyCanvas").css({ "width": v_width, "height": v_height });
            $("#v_container").css({ "height": v_height });        
        }




        $("#LoginModal").on("hide.bs.modal", function () {
            //hide方法后调用
            if ($(".error").length > 0) {
                $(".error").html(" ");
            }
            $('input.form-control').val("");
        });

    });
    $("#forReg").click(function () {
        open_w("Login/ZC.aspx");
    });
    $("#Reg").click(function () {
        open_w("Login/ZC.aspx");
    });
    $("#forForget").click(function () {
        open_w("Login/ZHMM.aspx");
    });
    $("#showM").click(function () {
        open_w("Index.aspx");
    });

    //验证用户是否注册过
    $("#txtUG").blur(function () {
        var userinfo = $.trim($("#txtUG").val());
        if (userinfo) {
            IsRegistUser(userinfo);
        }
    });
    
    //帐号密码登录
    $("#Login").click(function () {
        var sUG = $.trim(Format($('#txtUG').val()));
        var sPH = $.trim(Format($("#txtPH").val()));

        //用户名为空，请输入用户名或密码
        if (sUG == "") {
            $("#errortip").css("display", "block");
            $(".error").html("请输入用户名和密码");
            $("#txtUG").focus();
            if (tempCheck||g_loginCount > 0) {
                verifyCode.refresh();
            }
            return;
        }
        //密码为空，您还没有输入密码
        if (sPH == "") {
            $("#errortip").css("display", "block");
            $(".error").html("您还没有输入密码");
            $("#txtPH").focus();
            if (tempCheck||g_loginCount > 0) {
                verifyCode.refresh();
            }
            return;
        }
        var sDone;
        if (tempCheck || g_loginCount > 0) {
            sDone = verifyCode.validate($("#txtYZM").val());
            //验证码输入错误，请重新输入验证码
            if (!sDone) {
                $("#errortip").css("display", "block");
                $(".error").html("验证码输入错误，请重新输入验证码");
                verifyCode.refresh();
                $("#txtYZM").focus();
                return;
            }
        }

        InternetCheckLogin(sUG, sPH, strCXFS);
        


    });

    //手机号快速登录
    $("#dx_login").click(function () {
        var sDXphone = Format($('#dx_phone').val());
        var sVF = Format($("#txtRVFCCode").val());

        //用户名为空，请输入用户名或密码
        if (sDXphone == "") {
            $("#dx_errortip").css("display", "block").children("span.error").html("手机号码不能为空");
            $("#dx_phone").focus();
            return;
        }
        //对短信验证码进行相关验证
        if (!checkRRPhoneYzm("txtRVFCCode")) {
            $("#txtRVFCCode").focus();
            return;
        }

        InternetRCheckLogin(sDXphone, strCXFS);


    });

    $("#forRLogin").click(function () {
        showmodal({
            flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
            title: "提示信息",    //设置模态窗标题
            content: "确认退出当前帐号吗", //设置模态窗内容
            Tclose: false,  //设置右上角关闭按钮是否显示，默认为显示
            Qclose: true  //设置右下角关闭按钮是否显示，默认为关闭
        });

        $("#close").click(function () {
            LoginOut();

            checkLoginS("");
        })

    });


    //在模态框完全展示出来做一些动作
    $(document).on("keydown", function (e) {
        // 兼容FF和IE和Opera    
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
            //console.log(strCXFS + "strCXFS");

            //回车执行查询
            if ($('#LoginModal').hasClass("in")) {
                //console.log($("#strCXFS").html());ZHTab">DXTab
                if($("#ZHTab").hasClass("active")){
                    $("#Login").click();

                } else if ($("#DXTab").hasClass("active")) {
                    $("#dx_login").click();
                
                }
            }
            
        }
    });

}

//重新计算页面上tipbtn的位置，绑定相关样式
function rcheckTipBtn() {
//    if ($(".forAction").height() > 56) {
//        $(".tipbox").css({ "right": parseInt($(".tipbox").css("right")) - 15 });
//        $(".tipbox #tipbtn li:last-child").css({ "margin-right": "65px" });
//    } else {
//        if ($(".tipbox #tipbtn li:last-child").css("margin-right") == 50) {
//            $(".tipbox").css({ "right": parseInt($(".tipbox").css("right")) + 15 });
//            $(".tipbox #tipbtn li:last-child").css({ "margin-right": "0px" });
//        }
//    }

    $(".tipbox .breadcrumb li").click(function () {
        var _this = $(this);
        $checkbtn = _this.children("button");
        if ($checkbtn.hasClass("btn-info")) {
            _this.siblings().children("button").removeClass("btn-success").addClass("btn-info");
            $checkbtn.addClass("btn-success").removeClass("btn-info");
        }
    });

}

//绑定页面上按钮相关事件
function openWin(url) {
    window.top.open(url);
}

//绑定页面上按钮相关事件
function open_w(url) {
    if (g_g == "True") {
        if (url.indexOf('?') >= 0) {
            //var showval= GetQueryString("show", url)
            var getval = url.split('?')[1];
            var showval = getval.split("=")[1].split('&')[0];
            var gokind = getval.split("=")[2].split('&')[0];
            if (showval == "false") {
                if ($("#forRLogin").hasClass("hidden")) {
                    $('#LoginModal').modal({ backdrop: 'static', keyboard: false });
                    v_width = $("#v_container").width() > 152 ? $("#v_container").width() : 152;
                    v_height = $(".glyphicon-info-sign").height() > 34 ? $(".glyphicon-info-sign").height() : 34;
                    $("#verifyCanvas").css({ "width": v_width, "height": v_height });
                    $("#v_container").css({ "height": v_height });
                    if (gokind != "false") {
                        $("#strCXFS").html(gokind);
                    } else {
                        url = url.split("?")[0] + "?cxfs=false";
                         $("#strCXFS").html(url);
                    }
                    strCXFS = $("#strCXFS").html();

                } else {
                    if (gokind != "false") {
                        location.replace("Main.aspx?cxfs=" + gokind);
                    } else {
                        url = url.split("?")[0];
                        openWin(url);
                    }
                    
                }

            } else if (showval == "true") {
                location.href = "Dmain.aspx?cxfs=" + gokind;
            }
        } else {
            location.href = url;
        }
    } else if (g_g == "False") {
        showmodal({
            flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
            title: "提示信息",    //设置模态窗标题
            content: "检测系统授权信息异常，请联系系统管理员！", //设置模态窗内容
            Tclose: false,  //设置右上角关闭按钮是否显示，默认为显示
            Qclose: true  //设置右下角关闭按钮是否显示，默认为关闭
        });
    }


}

//控制功能页显示效果
function checkMenuDiv() {
    if (strcols != 12) {
        $child = $("#menuDiv");
        $parent = $(document.body);
        if (mwidth > 700) {
            adjustHCenter($parent, "#menuDiv");
            if (!$(".thumbnail").hasClass("h1")) {
                $(".thumbnail").addClass("h1")
            }
        } else {
            if (!$("#menuiframe").length > 0 && $child.length > 0) {
                $child.css({ "margin-top": "0" });
                $(".thumbnail").removeClass("h1").css({ "margin-bottom": "20px" });
            }
        }
        if ($("#menuDiv").css("display")=="block") {
            $("#menuiframe").addClass("hidden");
        }
        
    } else {
        if ($("#menuiframe").hasClass("hidden")) {
            $("#menuiframe").removeClass("hidden");
        }
        $checkbtn = $(".tipbox .breadcrumb li").children("button").eq(0);
        if ($checkbtn.hasClass("btn-info")) {
            $(this).siblings().children("button").removeClass("btn-success").addClass("btn-info");
            $checkbtn.addClass("btn-success").removeClass("btn-info");
        }

    }

}

//打开外网功能页面对应的流程
function open_xml_win(id, url, checkbtnindex) {
    var _this = $(".tipbox .breadcrumb li");
    if (strcols != 12) {
        $("#menuDiv").addClass("hidden");
        $("#menuiframe").removeClass("hidden");
        $checkbtn = $(".tipbox .breadcrumb li").children("button").eq(checkbtnindex);
        if ($checkbtn.hasClass("btn-info")) {
            _this.siblings().children("button").removeClass("btn-success").addClass("btn-info");
            $checkbtn.addClass("btn-success").removeClass("btn-info");
        } else {
            _this.siblings().children("button").removeClass("btn-success").addClass("btn-info");    
        }

    } else {
        if ($("#menuiframe").hasClass("hidden")) {
            $("#menuiframe").removeClass("hidden");
        }
    }
    //checkMW();

    //跳转到在线预约界面时，需要判断是否在允许的时间内执行该操作
    if (url.indexOf("FlowMainPage.aspx?flowType=ZXYY") > -1) {
        if (inthmd == 1) {
            showmodal({
                title: "提示信息",
                content: "您的账号已经被设置为黑名单用户，在没有被解除之前不能申请该业务！", //设置模态窗内容
                contentLeft: true,
                hideClick: 'static',
                callbackB: true,
                SWidth: 400,
                fontSize: 16,
                callbackBF: function () {
                    //执行成功后关闭
                    this.closeModal();
                    $("#tipbtn li").children("button").eq(1).click();
                }
            });
            return false;
        }
        else {
            if (isAllow == "否") {
                //不在预约开放时间，不可预约
                var msg = "请在预约开放时间" + spanYY + "进行操作！";
                showmodal({
                    title: "预约提醒",    //设置模态窗标题
                    content: msg,
                    fontSize: 16,
                    hideClick: "static",
                    callbackB: true,
                    callbackBF: function () {
                        $("#tipbtn li").children("button").eq(1).click();
                        return true;
                    }

                });
                return false;
            }
            else {
                var sRes = CheckYYXXBySFZH();
                if (sRes.length > 0) {
                    //页面调准
                    showmodal({
                        title: "预约提醒",    //设置模态窗标题
                        content: sRes,
                        fontSize: 16,
                        contentLeft: true,
                        hideClick: "static",
                        callbackB: true,
                        callbackBF: function () {
                            $("#tipbtn li").children("button").eq(1).click();
                            return true;
                        }

                    });
                    return false;
                }
            }
        }
    }
    else if (url.indexOf("FlowMainPage.aspx?flowType=ZXSQ") > -1) {
        if (inthmd == 1) {
            showmodal({
                title: "提示信息",
                content: "您的账号已经被设置为黑名单用户，在没有被解除之前不能申请该业务！", //设置模态窗内容
                contentLeft: true,
                hideClick: 'static',
                callbackB: true,
                SWidth: 400,
                fontSize: 16,
                callbackBF: function () {
                    //执行成功后关闭
                    this.closeModal();
                    $("#tipbtn li").children("button").eq(3).click();
                }
            });
            return false;
        }
    }

    //根据身份证号判断是否有有效的预约记录，有的话就不可以继续预约
    

    $("#" + id).attr("src", url);
   
}

//重新计算外网主页面高度控制
function checkW() {
    if(!tempCheck){
        g_loginCount = 0;
    } else {
        $("#YZMdiv").removeClass("hide");
    }    
    verifyCode = new GVerify("v_container");

    mheight = $(window).height() - 50;
    mwidth = $(window).width();

    if (mwidth > 1024) {
        $("#header").css({ "height": mheight * 0.3, "margin-bottom": mheight * 0.1 });
        $(".row,.menu_div #menuList").height(mheight * 0.6);
        $(".footer").css({ "height": "30px", "bottom": "0px" });
        $(".footer .h6").css({ "line-height": "30px" });
        $(".functionSubTitle").attr("limit", 15);
        $("[limit]").limit();
    } else if (mwidth >= 992 && mwidth <= 1024) {
        $("#header").css({ "height": mheight * 0.3, "margin-bottom": mheight * 0.05 });
        $(".row,.menu_div #menuList").height(mheight * 0.66);
        $(".footer").css({ "height": "30px" });
        $(".footer .h6").css({ "line-height": "30px" });
        $(".functionSubTitle").attr("limit", 15);
        $("[limit]").limit();
    } else if (mwidth >= 768 && mwidth < 992) {
        $("#header").css({ "height": mheight * 0.2, "margin-bottom": "0px" });
        $(".row,.menu_div #menuList").height(mheight * 0.7);
        $(".footer").css({ "height": "40px", "bottom": "0px" });
        $(".footer .h6").css({ "line-height": "20px" });
        $(".functionSubTitle").attr("limit", 8);
        $("[limit]").limit();
    } else if (mwidth >= 320 && mwidth < 768) {

        if (mheight > 750) {
            $("#header").css({});
            $("#header").css({ "height": mheight * 0.2, "margin-bottom": mheight * 0.1 });
            $(".main").height(mheight);
            $(".row,.menu_div #menuList").height(mheight * 0.66);
            $(".functionSubTitle").attr("limit", 15);
            $("[limit]").limit();
        } else if (mheight <= 750) {
            $("#header").css({ "height": mheight * 0.1, "margin-bottom": "0px" });
            $(".main").height(mheight + 10);
            $(".row,.menu_div #menuList").height(650);
            $(".functionSubTitle").attr("limit", 5);
            $("[limit]").limit();
        }

        $(".footer").css({ "height": "40px", "bottom": "0px" });
        $(".footer .h6").css({ "line-height": "20px" });

    }
}

//重新计算外网功能页面高度控制
function checkMW() {
    //mheight = $(window).height() - 30;
    mheight = window.top.document.documentElement.clientHeight;
    mwidth = window.screen.width;
    $(".main").height(mheight);
    $("#menuiframe").height(mheight - 140);

//    if (mwidth > 1024) {
//        $("#header").css({ "height": mheight * 0.1, "margin-bottom": "0px" });
//        $("#menuiframe").height((mheight - 50) * 0.93);
//        $(".footer").css({ "height": "30px", "bottom": "0px" });
//        $(".footer .h6").css({ "line-height": "30px" });
//    } else if (mwidth >= 992 && mwidth <= 1024) {
//        $("#header").css({ "height": mheight * 0.18, "margin-bottom": "0px" });
//        $("#menuiframe").height(mheight * 0.81);
//        $(".footer").css({ "height": "30px" });
//        $(".footer .h6").css({ "line-height": "30px" });
//    } else if (mwidth >= 768 && mwidth < 992) {
//        $("#header").css({ "height": mheight * 0.2, "margin-bottom": "0px" });
//        $("#menuiframe").height(mheight * 0.8);
//        $(".footer").css({ "height": "40px", "bottom": "0px" });
//        $(".footer .h6").css({ "line-height": "20px" });
//    } else if (mwidth >= 320 && mwidth < 768) {
//        if (mheight > 750) {
//            $("#header").css({ "height": mheight * 0.1, "margin-bottom": "10px" });
//            $("#menuiframe").height(mheight * 0.8);

//        } else if (mheight <= 750) {
//            $("#header").css({ "height": mheight * 0.05, "margin-bottom": "10px" });
//            $(".main").height(mheight + 10);
//            $("#menuiframe").height(450);
//        }

//        $(".footer").css({ "height": "40px", "bottom": "0px" });
//        $(".footer .h6").css({ "line-height": "20px" });
//    }

    //$("#menuiframe").height(mheight - 100);

    adjustBCenter("#header", ".tipbox");
    adjustBCenter("#header", "#tipList");
}

//绑定外网功能页面功能按钮行为
function checkTipBtn() {

    $(".tipbox .breadcrumb li").click(function () {
        $checkbtn = $(this).children("button");
        if ($checkbtn.hasClass("btn-info")) {
            $(this).siblings().children("button").removeClass("btn-success").addClass("btn-info");
            $checkbtn.addClass("btn-success").removeClass("btn-info");
        }
    });

}

//重新计算验证码高度
function reCheckYZMH(type) { 
    var v_width, v_height;
    if (g_loginCount > 0) {
        if ($("#v_container").width() > 156) {
            v_width = $("#v_container").width();
        } else {
            v_width = $("#v_container").width() > 156 ? $("#v_container").width() : 156;
        
        }
        if ($(".glyphicon-info-sign").height() > 34) {
            v_height = $(".glyphicon-user").height();
        } else {
            v_height = $(".glyphicon-user").height() > 34 ? $(".glyphicon-user").height() : 34;
        }
        if (type == "WW") { //如果是外网的验证码需要重新计算高度
            $("#verifyCanvas").css({ "width": v_width, "height": v_height });
            $("#v_container").css({ "height": v_height });
            //$("#txtYZM").css({ "width": $("#txtYZM").parent().width(), "height": v_height });
            $("#txtYZM").css({ "height": v_height });

        } else if (type == "NW") { //如果是内网的验证码需要重新计算高度
            $("#verifyCanvas").css({ "width": $("#v_container").width(), "height": $("#v_container").height() });
        }


    }

}

//确认验证码是否在页面加载的时候进行使用
function showCheck(a) {
    var c = document.getElementById("verifyCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 300, 300);
    ctx.font = "100px 'Microsoft Yahei'";
    ctx.fillText(a, 20, 100);
    ctx.fillStyle = "white";
}
var code;
//生成二维码
function createCode() {
    code = "";
    var codeLength = 4;
    var selectChar = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    for (var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 60);
        code += selectChar[charIndex];
    }
    if (code.length != codeLength) {
        createCode();
    }
    showCheck(code);
}
//验证二维码
function validate() {
    var inputCode = document.getElementById("txtYZM").value.toUpperCase();
    var codeToUp = code.toUpperCase();
    var result;
    if (inputCode.length <= 0) {
        createCode();
        result = "begin";
        return false;
    }
    else if (inputCode != codeToUp) {
        document.getElementById("txtYZM").value = "";
        createCode();
        result = "error";

    }
    else {
        result = "success";
    }
    return result;
}

//验证快速登录验证码是否正确
function checkRRPhoneYzm(phonezym) {

    var v = $.trim($("#" + phonezym).val());
    if (v == "") { $("#dx_errortip").css("display", "block").children("span.error").html("手机验证码不能为空"); return false; }
    else if (v.length != 6) { $("#dx_errortip").css("display", "block").children("span.error").html("手机验证码格式不正确"); return false; }
    else if (!CheckRRPhoneYZM(v)) { $("#dx_errortip").css("display", "block").children("span.error").html("手机验证码不正确"); return false; }
    else { $("#dx_errortip").css("display", "none").children("span.error").html("").hide(); return true; }
}

//验证快速登录验证码与数据库是否匹配
function CheckRRPhoneYZM(sPhoneYZM) {

    var pass = true;
    var sUrl = GREI.ApplicationPath + "SuiteUI/RemoteHandle/SignonHandler.ashx?action=CheckPhoneyzm&T=" + Math.random();
    var sPhone = $("#dx_phone").val();

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
    })
    return pass;

}