var XZ_TYPE = "XZ";
var XX_TYPE = "XX";
var IsSP, isDefault, isMain;

/*----------------------------------------------------------------公共方法-----------start-----*/
//截取网址中的参数
function GetQueryString(type,name) {
    /*
    *@parameter string type 如果为"parent"则判断当前主要流程框架地址中包含的参数值
    如果为"parents"则判断当前主要流程框架的父级地址中包含的参数值
    如果为"iframe"则判断当前子步骤地址中包含的参数值
    默认为"parents"
    *@parameter string name 提供需要获取的参数值的参数名
    */
    var tempStr;
    if (type == "parent") {
        tempStr = window.location.search;
    } else if (type == "parents") {
        tempStr = parent.location;
    } else if (type == "iframe") {
        tempStr = iframeSelf.location.search;
    } else if (type == "") {
        tempStr = parent.location.search;
    }
    //console.log(tempStr);
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = tempStr.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//获取当前时间
function p(s) {
    return s < 10 ? '0' + s : s;
}

function getCurrentDate(type) {
    var myDate = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    //获取当前年
    var year = myDate.getFullYear();
    var month;
    if(type=="now"){
        //获取当前月
        month = myDate.getMonth() + 1;       
    }else if(type=="next"){
            //获取下一个月
        month = myDate.getMonth() + 2;        
    }else{
        //获取当前月
        month = myDate.getMonth() + 1;            
    }
    //获取当前天
    var date = myDate.getDate();
    //获取当前小时
    var hour = myDate.getHours();
    //获取当前分钟
    var minute = myDate.getMinutes();
    //获取当前秒钟
    var second = myDate.getSeconds();

    var now = year + seperator1 + p(month) + seperator1 + p(date) +" "+ p(hour) + seperator2 + p(minute) + seperator2 + p(second);
    return now;
}

/*----------------------------------------------------------------公共方法-----------end-----*/
/*----------------------------------------------------------------数据验证保存请求---------start-------*/
//在阅读须知中获取当前用户信息进行数据验证
function CheckUserInfo(type) {
/*
*@parameter string type 如果为"XX"则是阅读须知页的数据验证请求
                        如果为"XZ"则是填写信息页的数据验证请求

*/
    var sUrl = GREI.ApplicationPath + 'SuiteUI/RemoteHandle/SignonHandler.ashx?action=CheckUserInfo&T=' + Math.random();
    $.ajax({
        type: "POST",
        url: sUrl,
        dataType: 'text',
        async: false,
        success: function (res) {

            if (res != "") {
                var resObj = eval("(" + res + ")"); //转换为json对象

                if (resObj.success == "成功") {
                    var arr = eval(resObj.msg);
                    if ($("#iptSMRZ").val() == "是") {
                        var isVer = checkVerify(arr.USERNAME, arr.MOBILE, arr.IDCARDNO);
                        if (type == XZ_TYPE) {
                            if (!isVer) {
                                var tempStrr = "";
                                if (isDefault) {
                                    tempStrr = "用户未实名认证不能申请业务,请进入<b>用户个人信息</b>页面，进行实名认证之后再申请";
                                } else {
                                    if (isMain) {
                                        tempStrr = "用户未实名认证不能申请业务,请进行实名认证之后再申请";
                                    } else {
                                        tempStrr = "用户未实名认证不能申请业务,请进入<b>个人信息设置</b>页面，进行实名认证之后再申请";
                                    }
                                }
                                window.parent.showFlowModal("confirm", "温馨提示", tempStrr, true);
                            } else {
                                //数据加载完成，放开下一步按钮
                                window.parent.setFlowBtnState("next", true, false);
                            }
                        } else if (type == XX_TYPE) {
                            //显示之前进行数据解密
                            var sth = $("#iptSth").val();
                            var xt = new Xxtea(sth);

                            $("#txtSQRMC").val(xt.xxtea_decrypt(arr.USERNAME));
                            $("#txtLXDH").val(xt.xxtea_decrypt(arr.MOBILE));
                            $("#txtZJHM").val(xt.xxtea_decrypt(arr.IDCARDNO));
                            if (isVer) {
                                $(".divgrxx").removeClass("hide");
                            } else {
                                $("#tipdiv").removeClass("hide")
                            }
                        }
                    } else {
                        if (type == XZ_TYPE) {
                            //数据加载完成，放开下一步按钮
                            window.parent.setFlowBtnState("next", true, false);
                        } else if (type == XX_TYPE) {
                            //显示之前进行数据解密
                            var sth = $("#iptSth").val();
                            var xt = new Xxtea(sth);

                            $("#txtSQRMC").val(xt.xxtea_decrypt(arr.USERNAME));
                            $("#txtLXDH").val(xt.xxtea_decrypt(arr.MOBILE));
                            $("#txtZJHM").val(xt.xxtea_decrypt(arr.IDCARDNO));
                            $(".divgrxx").removeClass("hide");
                            window.parent.setFlowBtnState("next", true, false);

                        }

                    }




                } else {
                    if (type == XZ_TYPE) {
                        var tempStr = "";
                        if (isDefault) {
                            tempStr = "用户信息不完整不能申请业务,请进入<b>用户个人信息</b>页面，完善个人信息，并进行实名认证之后再申请";
                        } else {
                            if (isMain) {
                                tempStr = "用户信息不完整不能申请业务,请完善个人信息，并进行实名认证之后再申请";
                            } else {
                                tempStr = "用户信息不完整不能申请业务,请进入<b>个人信息设置</b>页面，完善个人信息，并进行实名认证之后再申请";
                            }
                        }
                        window.parent.showFlowModal("confirm", "温馨提示", tempStr, true);
                    }

                }
            } else {
                if (type == XZ_TYPE) {
                    var tempStr = "";
                    if (isDefault) {
                        tempStr = "用户信息不完整不能申请业务,请进入<b>用户个人信息</b>页面，完善个人信息，并进行实名认证之后再申请";
                    } else {
                        if (isMain) {
                            tempStr = "用户信息不完整不能申请业务,请完善个人信息，并进行实名认证之后再申请";
                        } else {
                            tempStr = "用户信息不完整不能申请业务,请进入<b>个人信息设置</b>页面，完善个人信息，并进行实名认证之后再申请";
                        }
                    }
                    window.parent.showFlowModal("confirm", "温馨提示", tempStr, true);
                }
            }
        }
    });
}


//验证用户信息是否通过实名认证通过
function checkVerify(SQRMC, MOBILE, IDCARDNO) {
    var tempStr = false;
    var strSQRMC = SQRMC; //获取申请人姓名
    var strLXDH = MOBILE; //获取申请人联系电话
    var strZJHM = IDCARDNO; //获取申请人证件号码
    var sUrl = GREI.ApplicationPath + 'SuiteUI/RemoteHandle/SignonHandler.ashx?T=' + Math.random();
    $.ajax({
        type: "POST",
        url: sUrl,
        dataType: 'text',
        data: {
            action: "CheckUserCard",
            xm: strSQRMC,
            sfz: strZJHM,
            sjh: strLXDH
        },
        async: false,
        success: function (res) {
            if (!!res) {
                if (res == 1) {
                    tempStr = true;
                    window.parent.setFlowBtnState("next", true);
                }
            }
        }
    });
    return tempStr;

}

//验证提交的审批数据
function checkSPSave() {
    var isHasSP = !$(".glyphicon-refresh").prop("disabled");
    var strSPZT = $.trim($("#drpSPZT").find("option:selected").val());
    var strSPBZ = $.trim($("#txtSPBZ").val());
    if (strSPZT != "未审批" && strSPZT != undefined) {
        if (strSPZT == "不通过" && strSPBZ == '') {
            showmodal({
                content: "请填写审批不通过的原因",
                SWidth: 300,
                fontSize: 18,
                callbackHide: function () {
                    $(".glyphicon-refresh").click();
                }
            });
        } else {
            if (isHasSP) {
                PostSPSave(strSPZT); 
            } else {
                showmodal({
                    content: "该信息已经审批过，请确认是否重新审批？",
                    Qclose: true,
                    SWidth: 300,
                    fontSize: 18,
                    callbackB: true,
                    callbackBF: function () {
                        $(".glyphicon-refresh").click();
                        PostSPSave(strSPZT);
                        return true;
                    }
                });

            }
                       
        }
        

    } else {
        showmodal({
            content: "请填写审批状态！", //设置模态窗内容
            Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
            SWidth: 250,
            fontSize: 18,
            callbackHide: function () {
                $(".glyphicon-refresh").click();
            }
        });

    }

}

//设置审批提交
function PostSPSave(SPZT) {
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    var objRes = new Object();
    var strSQBH = $.trim($("#iptSQBH").val());
    var strSPBZ = $.trim($("#txtSPBZ").val());
    var strSQRMC = xt.xxtea_encrypt($.trim($("#txtSQRMC").val())); //获取申请人姓名
    var strLXDH = xt.xxtea_encrypt($.trim($("#txtLXDH").val())); //获取申请人手机号

    var strUrl = GREI.ApplicationPath + "Model/CXSQ/RemoteHandle/CXZM.ashx?T=" + Math.random();
    $.ajax({
        type: "POST",
        url: strUrl,
        dataType: 'text',
        async: false,
        data: {
            action: 'SaveSP',
            SQBH: strSQBH,
            SPZT: SPZT,
            SPBZ: strSPBZ,
            SQRNAME: strSQRMC,
            SQRLXFS: strLXDH
        },
        success: function (t) {
            var objRes = eval('(' + t + ')');
            var strflag = objRes.success;
            if (strflag) {
                $(".glyphicon-refresh").prop("disabled", true);
                showmodal({
                    content: objRes.msg, //设置模态窗内容
                    Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
                    SWidth: 250,
                    fontSize: 18
                });

            } else {
                showmodal({
                    content: objRes.msg, //设置模态窗内容
                    Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
                    SWidth: 250,
                    fontSize: 18
                });
            }

        }
    });    
}
//数据验证
function ValidationData(strAction) {
    var objRes = new Object();

    //判断申请人信息是否完整
    var isfull = $("#tipdiv").hasClass("hide");

    //获取申请人信息
    var strSQRMC = $.trim($("#txtSQRMC").val()); //获取申请人姓名
    //var strLXDH = $.trim($("#txtLXDH").val()); //获取申请人联系电话
    var strZJLX = $.trim($("#txtZJLX").val()); //获取申请人证件类型
    var strZJHM = $.trim($("#txtZJHM").val()); //获取申请人证件号码
    var strLQFS = $.trim($("#selLQFS").find("option:selected").val()); //获取申请人结果领取方式

    //获取查询证明条件
    var strTempCX = $("#cboxCXYT div.col-sm-2");
    var strCXYT = [];  //获取申请查询用途
    for (var i = 0; i < strTempCX.length; i++) {
        var _this = strTempCX.eq(i).find(".input-group .input-group-addon input[type='checkbox']");
        if (_this.is(":checked")) {
            strCXYT.push(_this.val());
        }
    }
    var strCXTXT = $.trim($("#CXTXT").val()); //获取申请人查询声明备注

    //获取收件人信息
    var strSJName = $.trim($("#txtSJName").val()); //获取收件人姓名
    var strSJTel = $.trim($("#txtSJTel").val()); //获取收件人联系电话
    var strSJYB = $.trim($("#txtSJYB").val()); //获取收件人邮政编码
    var strSJDZ = $.trim($("#txtSJDZ").val()); //获取收件人收件地址

    //获取办理网点
    var strBLWD = "";
    if (strAction == "saveZMdata") {
        strBLWD = window.parent.getFlowData("data", true).BLWD;
    }

    //附件信息
    var jsonAttach = JSON.stringify($('#tbFJXX').bootstrapTable('getData'));

    var bDone = true;
    var phoneReg = /^1[0-9]{10}$/; //匹配手机号码
    var posterCode = /^[1-9]\d{5}(?!\d)$/;    //匹配邮编
    //var posterCode = /^[a-zA-Z0-9]{3,12}$/; //匹配邮编
    //判断申请人信息是否完全
    if (!isfull) {
        objRes = "{ CZLX:'SQRXX',data:'申请人信息不完整，请补全个人信息后再进行申请'}";
        bDone = false;

    } else {
        //判断是否要验证收件人信息
        if (strLQFS.indexOf("邮寄") > -1) {
            var strTemp = "";
            if (strSJName == "") {
                strTemp += "收件人姓名为空！";
            }
            if (strSJTel == "") {
                strTemp += "收件人联系电话为空！";
            } else if (!phoneReg.test(strSJTel)) {
                strTemp += "收件人联系电话格式不正确！";
            }
            if (strSJYB == "") {
                strTemp += "收件人邮政编码为空！";
            } else if (!posterCode.test(strSJYB)) {
                strTemp += "收件人邮政编码格式不正确！";
            }
            if (strSJDZ == "") {
                strTemp += "收件人地址为空！";
            }
            if (strTemp != "") {
                objRes = "{ CZLX:'SJXX',data:'" + strTemp + "'}";
                bDone = false;
            }
        }

        //判断查询用途
        if (bDone) {
            var strTemp = "";
            if (strCXYT.length == 0) {
                strTemp += "申请查询用途为空！";
            }
            if (strTemp != "") {
                objRes = "{ CZLX:'SJXX',data:'" + strTemp + "'}";
                bDone = false;
            }
        }
        //验证附件上传情况
        if (bDone) {
            var dFJ = true;
            var objFJ = eval('(' + jsonAttach + ')');
            if (objFJ.length > 0) {
                var msgFJ = "";
                for (var i = 0; i < objFJ.length; i++) {
                    var sFJMC = objFJ[i].FJNAME;
                    var sXH = objFJ[i].XH;
                    var strZT = $("#spanZT" + sXH).html();
                    if (strZT.indexOf("已上传") < 0) {//没有上传成功的
                        if (msgFJ == "") {
                            msgFJ = sFJMC;
                        } else {

                            msgFJ += "、" + sFJMC;
                        }
                    }
                }
                if (msgFJ != "") {
                    objRes = "{ CZLX:'FJXX',data:'OK',TSNR:'附件：" + msgFJ + "还未上传，请确认是否要提交该申请？'}";
                    dFJ = false;

                }

            }
        }
        if (bDone) {
            if (strAction == "updatedata") {//修改时直接调用
                objRes = SubmitData(strAction);
            } else {
                if (dFJ) {
                    objRes = "{ CZLX:'DJXX',data:'OK',TSNR:'请确认是否要提交该申请？'}";
                }

            }
        }

    }

    return objRes;

}

//填写信息页面提交
function SubmitData(strAction) {
    if (strAction == undefined) {
        strAction = "saveZMdata";
    }
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    var objRes = new Object();
    var strSQSJ = $("#dateSQSJ").val();
    //获取申请人信息
    var strSQRMC = xt.xxtea_encrypt($.trim($("#txtSQRMC").val())); //获取申请人姓名
    var strLXDH = xt.xxtea_encrypt($.trim($("#txtLXDH").val())); //获取申请人联系电话
    var strZJLX = $.trim($("#txtZJLX").val()); //获取申请人证件类型
    var strZJHM = xt.xxtea_encrypt($.trim($("#txtZJHM").val())); //获取申请人证件号码
    var strLQFS = $.trim($("#selLQFS").find("option:selected").val()); //获取申请人结果领取方式

    //获取查询证明条件
    var strTempCX = $("#cboxCXYT div.col-sm-2");
    var strCXYT = [];  //获取申请查询用途
    for (var i = 0; i < strTempCX.length; i++) {
        var _this = strTempCX.eq(i).find(".input-group .input-group-addon input[type='checkbox']");
        if (_this.is(":checked")) {
            strCXYT.push(_this.val());
        }
    }

    var strCXTXT = $.trim($("#CXTXT").val()); //获取申请人查询声明备注

    //获取收件人信息
    var strSJName = $.trim($("#txtSJName").val()); //获取收件人姓名
    var strSJTel = $.trim($("#txtSJTel").val()); //获取收件人联系电话
    if (strLQFS.indexOf("邮寄") > -1) {
        strSJName = xt.xxtea_encrypt(strSJName);
        strSJTel = xt.xxtea_encrypt(strSJTel);
    }
    var strSJYB = $.trim($("#txtSJYB").val()); //获取收件人邮政编码
    var strSJDZ = $.trim($("#txtSJDZ").val()); //获取收件人收件地址

    //获取办理网点
    var strBLWD = "";
    if (strAction == "saveZMdata") {
        strBLWD = window.parent.getFlowData("data", true).BLWD;
    }

    //获取隐藏控件的值
    var strSQBH = $("#iptSQBH").val();
    var sData = {
            action: strAction,
            SQBH: strSQBH,
            SQR: strSQRMC,
            SQRZJHM: strZJHM,
            SQRZJLX: strZJLX,
            SQRLXDH: strLXDH,
            CXYT: strCXYT.toString(),
            CXSM: strCXTXT,
            BLWD: strBLWD,
            LQFS: strLQFS,
            SJR: strSJName,
            SJRDHHM: strSJTel,
            SJDZ: strSJDZ,
            YB: strSJYB,
            SQSJ:strSQSJ
        };
    $.ajax({
        type: "POST",
        url: GREI.ApplicationPath + "Model/CXSQ/RemoteHandle/CXZM.ashx?T=" + Math.random(),
        dataType: 'text',
        async: false,
        data: sData,
        success: function (t) {
           if(!!t){
               objRes = eval('(' + t + ')');
               var strData = objRes.data;
               if (strData == "OK") {//数据验证通过弹出确认提交提示框
                   //设置参数并提交页面
                   window.parent.setFlowData("TXXX", sData, true);
                   window.parent.flowGo("normalGo");
               } else {
                   window.parent.showFlowModal("error", "提示", "提交失败！");
               }      
           }else{
               window.parent.showFlowModal("error", "提示", "提交失败！");
           }

        }
    })

    //return objRes;
}


//绑定审批意见与审批备注的值
function bindSPBZ(){
    var  tempTxt =$("#drpSPZT").find("option:selected").val();
//    if (tempTxt.indexOf("未审批") == -1) {
//        $("#txtSPBZ").val("审批" + tempTxt);
//    } else {
//        $("#txtSPBZ").val("");
    //    }   
     if (tempTxt=="通过"){
         $("#txtSPBZ").val("");
     }
}

//判断用户选择的领取方式
function checkLQFS() {
    var _sselTxt = $("#selLQFS").find("option:selected").val();
    if (_sselTxt.indexOf("邮寄") > -1) {
        if ($("#DivSJ").hasClass("hide")) {
            $("#DivSJ").removeClass("hide");
        }
    } else {
        if (!$("#DivSJ").hasClass("hide")) {
            $("#DivSJ").addClass("hide");
        }
    }

    $("#selLQFS").change(function () {
        var _selTxt = $(this).find("option:selected").val();
        if (_selTxt.indexOf("邮寄") > -1) {
            if ($("#DivSJ").hasClass("hide")) {
                $("#DivSJ").removeClass("hide");
            }
        } else {
            if (!$("#DivSJ").hasClass("hide")) {
                $("#DivSJ").addClass("hide");
            }
        }
    });
}

/*----------------------------------------------------------------数据验证保存请求---------end-------*/

/*----------------------------------------------------------------页面数据加载跳转---------start-------*/

//根据登记类型加载阅读须知信息
function LoadYDXZ() {
    var sFlowType = window.parent.getFlowData("flowType", false);
    var strUrl = GREI.ApplicationPath + 'SuiteUI/RemoteHandle/FlowHandler.ashx?T=' + Math.random();
    $.ajax({
        type: "POST",
        url: strUrl,
        dataType: 'text',
        data: {
            action: 'getYDXZ',
            flowType: sFlowType
        },
        async: false,
        success: function (res) {
            if (res != "") {
                $("#showBox").html(res);
            }
        }
    })
}

//加载Panel折叠动画
function LoadPanel() {
    $('.collapse.in').prev('.panel-heading').addClass('active');
    $('.panel-group').on('show.bs.collapse', function (a) {
        $(a.target).prev('.panel-heading').addClass('active');
    }).on('hide.bs.collapse', function (a) {
        $(a.target).prev('.panel-heading').removeClass('active');
    });
    //判断填写信息状态
    $('#BodySQXX,#BodyYT,#BodySJ,#BodyFJXX,#BodySPXX').collapse('show');
}


//加载审批信息
function LoadSP() {
    var strTemp = $("#iptCKLX").val();
    if (!!strTemp) {
        $('#tbFJXX').bootstrapTable('hideColumn', 'CZ');
        if (strTemp == "CK") {
            $("input[action='XX'],select[action='XX'],textarea[action='XX']").prop("disabled", true);
            $(".divgrxx").removeClass("hide");
        } else if (strTemp == "SP") {
            $("input[action='XX'],select[action='XX'],textarea[action='XX']").prop("disabled", true);
            $(".divgrxx,#DivSPXX").removeClass("hide");
            $("#drpSPZT option").eq(0).addClass("hide");
            $("#drpSPZT").change(function(){
                bindSPBZ();
            });
            $("#btnSave").click(function(){
                checkSPSave();
            });           
            $(".glyphicon-refresh").click(function(){
               $("#dtSPSJ").val(getCurrentDate("now"));
            });          
        } else if (strTemp == "XG") {
           $("input,select,textarea,button").prop("disabled", true);
           $(".divgrxx,#DivSPXX").removeClass("hide");
           //$("#drpSPZT option").eq(0).addClass("hide");
           $("#btnSave").addClass("hide");            
        }
    } else {
       
    }
    LoadSPData();
}

//加载审批信息
function LoadSPData() {
    var sUrl = GREI.ApplicationPath + "Model/CXSQ/RemoteHandle/CXZM.ashx?T=" + Math.random();
    $.ajax({
        type: "POST",
        url: sUrl,
        dataType: 'text',
        data: {
            action: "GetSPXX",
            SQBH: $("#iptSQBH").val()
        },
        async: false,
        success: function (res) {

            if (res != "") {
                var resObj = eval("(" + res + ")"); //转换为json对象

                if (resObj.success) {
                    var arr = eval(resObj.data);
                    //console.log(arr);
                    var sth = $("#iptSth").val();
                    var xt = new Xxtea(sth);
                    $("#dateSQSJ").val(arr.SQRQ);
                    //申请人信息
                    $("#txtSQRMC").val(xt.xxtea_decrypt(arr.SQR));
                    $("#txtZJHM").val(xt.xxtea_decrypt(arr.SQRZJHM));
                    $("#txtLXDH").val(xt.xxtea_decrypt(arr.SJRDHHM));
                    $("#txtZJLX").val(arr.SQRZJLX);
                    $("#selLQFS").val(arr.LQFS);

                    //获取查询证明条件
                    var strTempCX = $("#cboxCXYT div.col-sm-2");
                    var arrCXYT = arr.CXYT.split(",");  //申请查询用途

                    for (var i = 0; i < strTempCX.length; i++) {
                        //var itemp = parseInt(arrCXYT[i]) - 1;
                        //strTempCX.eq(itemp).find(".input-group .input-group-addon input[type='checkbox'][name='" + itemp + "']").prop("checked", true);
                        var itemp = parseInt(arrCXYT[i]);                        
                        strTempCX.find(".input-group .input-group-addon input[type='checkbox'][name='" + itemp + "']").prop("checked", true);
                    }

                    $("#CXTXT").val(arr.CXSM); //申请人查询声明备注
                    //SQRQ,SQR,SQRZJHM,SQRZJLX,CXYT,CXSM,BLZT,BLWD,LQFS,SJR
                    //SJRDHHM,SJDZ,YB,SPR,SPYJ,SPRQ


                    //获取收件人信息
                    if (arr.LQFS.indexOf("邮寄") > -1) {
                        $("#txtSJName").val(xt.xxtea_decrypt(arr.SJR)); //收件人姓名
                        $("#txtSJTel").val(xt.xxtea_decrypt(arr.SJRDHHM)); //收件人联系电话
                        $("#txtSJYB").val(arr.YB); //收件人邮政编码
                        $("#txtSJDZ").val(arr.SJDZ); //收件人收件地址
                        $("#DivSJ").removeClass("hide");
                    }

                    //审批人信息
                    if (arr.BLZT > 1 && arr.BLZT < 4) {
                        $("#txtSPR").val(xt.xxtea_decrypt(arr.SPR)); //审批人姓名
                        $("#dtSPSJ").val(arr.SPRQ); //审批日期
                        if (arr.SPYJ.indexOf("不") > -1) {
                            $("#drpSPZT").val("不通过"); //审批意见                        
                        } else {
                            $("#drpSPZT").val("通过"); //审批意见  
                        }
                        $("#txtSPBZ").val(arr.SPBZ); //审批备注
                        $(".glyphicon-refresh").prop("disabled", true);
                    } else {
                        $("#txtSPR").val($("#iptUserId").val()); //审批人姓名
                        $("#dtSPSJ").val(getCurrentDate("now")); //审批日期
                        if (arr.BLZT != 1) {
                            $("input[action='SP'],select[action='SP'],textarea[action='SP']").prop("disabled", true);
                            $(".SPfooter").addClass("hide");
                        }


                    }

                } else {
                    showmodal({
                        content: resObj.data, //设置模态窗内容
                        Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
                        SWidth: 250,
                        fontSize: 18
                    });

                }



            }

        }
    });
}

//加载附件信息
function showFJQDGrid(type) {
    var strSQBH = $("#iptSQBH").val();
    var strUrl;
    var isSC = true;
    if (type == "SC") {
        strUrl = GREI.ApplicationPath + "Model/DYA/RemoteHandle/DJXX.ashx?action=getFJXX&sqbh=" + $("#iptSQBH").val() + "&DJLX=" + encodeURI("查询证明申请") + "&T=" + Math.random();
    } else if (type == "SP") {
        isSC = false;
        strUrl = GREI.ApplicationPath + "Model/DYA/RemoteHandle/DJXX.ashx?action=getFJXX&sqbh=" + $("#iptSQBH").val() + "&DJLX=" + encodeURI("查询证明申请") + "&T=" + Math.random();
    } else {
       strUrl = GREI.ApplicationPath + "Model/DYA/RemoteHandle/DJXX.ashx?action=getFJXX&sqbh=" + $("#iptSQBH").val() + "&DJLX=" + encodeURI("查询证明申请") + "&T=" + Math.random();
    }
    $('#tbFJXX').bootstrapTable({
        url: strUrl,
        method: 'get', //请求方式（*）
        contentType: "application/x-www-form-urlencoded",
        //toolbar: '#toolbar', //工具按钮用哪个容器
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        // pagination: true, //是否显示分页（*）
        sortable: false, //是否启用排序
        sortOrder: "asc", //排序方式
        // queryParams: queryParams, //参数  
        queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求  
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        // pageNumber: 1, //初始化加载第一页，默认第一页
        // pageSize: 20, //每页的记录行数（*）
        // pageList: [20, 50, 100], //可供选择的每页的行数（*）
        search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        showColumns: false, //是否显示所有的列
        showRefresh: false, //是否显示刷新按钮
        minimumCountColumns: 2, //最少允许的列数
        clickToSelect: true, //是否启用点击选中行
        uniqueId: "ZID", //每一行的唯一标识，一般为主键列
        showToggle: false, //是否显示详细视图和列表视图的切换按钮
        cardView: false, //是否显示详细视图
        detailView: false, //是否显示父子表
        singleSelect: false,
        columns: [{
            field: 'XH',
            title: '序号',
            align: 'center'
        }, {
            field: 'FJNAME',
            title: '附件名称',
            align: 'center'
        }, {
            field: 'FJLX',
            title: '附件类型',
            align: 'center'
        }, {
            field: 'ZT',
            title: '上传状态',
            align: 'center',
            formatter: function (value, row, index) {
                if (row.ZT != "") {
                    html = "<span><button type=\"button\" id='spanZT" + row.XH + "'  class=\"btn btn-info\" onclick=\"showListWin('" + strSQBH + "','" + row.XH + "','" + row.FJM + "')\")>查看附件</button></span>";
                } else {
                    if (type == "SP") {
//                        html = "<span><button type=\"button\" id='spanZT" + row.XH + "'  class=\"btn btn-warning\" onclick=\"showAddWin('" + strSQBH + "','" + row.XH + "','" + row.FJM + "')\")>未上传</button></span>";
                        html = "<span class='text-danger' id='spanZT" + row.XH + "'>未上传</span>";
                    }else{
                        html = "<span class='text-info' id='spanZT" + row.XH + "'>" + value + "</span>";                
                    }
                }
                return html;
            }
        }, {
            field: 'CZ',
            title: '操作',
            align: 'center',
            formatter: function (value, row, index) {
                var html= "<span class=\"btn btn-primary glyphicon glyphicon-upload fileinput-button\"><span>上传</span><input type=\"button\" value=\"上传附件\"  name='" + row.XH + "' id = 'btnUpload" + row.XH + "'  onclick=\"showAddWin('" + strSQBH + "','" + row.XH + "','" + row.FJM + "')\"/></span>";
                return html;
            }
        }, {
            field: 'FJLJ',
            title: 'FJLJ',
            align: 'center',
            visible: false
        }, {
            field: 'FJKZM',
            title: 'FJKZM',
            align: 'center',
            visible: false
        }, {
            field: 'FJM',
            title: 'FJM',
            align: 'center',
            visible: false
        }], responseHandler: function (res) {
            return {
                "total": res.Ftotal, //总页数
                "rows": res.Frows   //数据
            };
        }
    });
}

//弹出上传附件窗口
function showAddWin(strSQBH, strXH, strFJMC) {
    var sDJLX = $("#iptDJLX").val();
    var sAJZT = $("#iptAJZT").val();
    var sCKLX = $("#iptCKLX").val();
    showmodal({
        flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
        title: "附件管理",    //设置模态窗标题
        isText: false,
        hideClick: "static",
        src: "../ZXSQ/AddAttach.aspx?SQBH=" + strSQBH + "&XH=" + strXH + "&FJMC=" + strFJMC + "&DJLX=" + sDJLX + "&AJZT=" + sAJZT + "&CKLX=" + sCKLX + "&rand=" + Math.random(), //设置模态窗内容
        SMaxheight: 300,  //设置模态窗高度，请输入具体的正整数像素值，默认为auto，请输入具体的像素值，例如300
        SWidth: 600,  //设置模态宽度，请输入具体的正整数像素值，默认为auto，请输入具体的像素值，例如300
        Bclose: false,
        callbackHide: function () {
            //清除附件上传弹窗关闭之后，就聚焦错误
            $("#CXTXT").focus(); //在线申请查询证明

            //查询是否上传成功
            $.ajax({
                type: "POST",
                url: GREI.ApplicationPath + "Model/DYA/RemoteHandle/DJXX.ashx?T=" + Math.random(),
                dataType: 'text',
                async: false,
                data: {
                    action: 'GetUploadState',
                    SQBH: strSQBH,
                    XH: strXH,
                    FileName: strFJMC,
                    DJLX: sDJLX
                },
                success: function (res) {
                    if (res != "") {
                        $("#spanZT" + strXH).html("已上传");
                    }
                }
            })
        }
    });


}

//跳转到附件列表
function showListWin(strSQBH, strXH, strFJMC) {
    var sDJLX = $("#iptDJLX").val();
    var isIndex = window.top.location.href.indexOf("Main.aspx") > -1;
    var strWinW = $(window).width() * 0.6;
    var strWinH = $(window).height() * 0.7;
    var tempUrl = GREI.ApplicationPath + "Model/FJGL/FJList.aspx?SQBH=" + strSQBH + "&FJLX=" + sDJLX + "&rand=" + Math.random();
    showmodal({
        title: "附件管理",
        isText: false,
        hideClick: "static",
        src: tempUrl,
        Sheight: strWinH,
        SWidth: strWinW,
        Bclose: false,
        iframePadding: false
    })
}

function downloadFJ(strName) {
    var sSQBH = $("#iptSQBH").val();
    //    form.dataSubmit({
    form.dataSubmit({
        //    $.ajax({
        url: GREI.ApplicationPath + 'Model/DYA/RemoteHandle/DJXX.ashx?action=XZFJ&T=' + Math.random(),
        data: { "SQBH": sSQBH, "Name": strName },
        type: 'post'
    });
}


//点击修改用户详细信息
function SetUserData() {
    var strUrl = "";
    if (isDefault) {
        strUrl = GREI.ApplicationPath + "SuiteUI/YHGL/UserMainInfo.aspx?T=" + Math.random();
    } else {
        if (isMain) {
            strUrl = GREI.ApplicationPath + "SuiteUI/GRXX/GRXXXX.aspx?flag=modify&T=" + Math.random();
        }
    }

    var modalH = Math.abs($(window).height() * 0.8);
    //alert(window.screen.width);
    var modalW;
    if ($(window).width() > 1024) {
        modalW = Math.abs($(window).width() * 0.4);
    } else if ($(window).width() <= 1024) {
        modalW = Math.abs($(window).width() * 0.8);
    }

    showmodal({
        isText: false,  //判断传进来content的是否为Text,默认为true
        title: "个人信息",    //设置模态窗标题
        isIframe: true,   //判断传进来content的是否为iframe,默认为false
        src: strUrl,  //如果传进来content的为iframe，通过修改iframe地址来设置模态窗内容
        Bclose: false, //设置右下角关闭按钮是否显示，默认为显示
        hideClick: "static",
        Sheight: modalH, //设置模态窗高度，默认为auto
        SWidth: modalW,
        callbackHide: function () {
            CheckUserInfo("XX");
        }
    });
}
/*----------------------------------------------------------------页面数据加载跳转---------end-------*/


/*----------------------------------------------------------------备选---------start-------*/

/*----------------------------------------------------------------备选---------end-------*/