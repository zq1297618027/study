var XZ_TYPE = "XZ";
var XX_TYPE = "XX";
var IsSP, isDefault, isMain, strTXXX;
var key_ygdj, key_ysf, key_esf, value_ygdj, value_ysf, value_esf, value_ishh, value_ck, value_cs, value_lc, value_sp, value_fs, key_ddsy, key_gggy, key_afgg, value_sfyz;
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
                    if (type == XZ_TYPE) {
//                        var tempType = $("#iptTYPE").val();
//                        if (tempType == "GR") {
                            checkYWSL();
//                        } else {
//                            tempType = tranXZSP(tempType);
//                            window.parent.showFlowModal("confirm", "温馨提示", "拥有" + tempType + "权限的人不能申请业务", true);
//                        }
                    } else if (type == XX_TYPE) {
                        //显示之前进行数据解密
                        var sth = $("#iptSth").val();
                        var xt = new Xxtea(sth);

                        $("#txtSQRMC").val(xt.xxtea_decrypt(arr.USERNAME));
                        $("#txtLXDH").val(xt.xxtea_decrypt(arr.MOBILE));
                        $("#txtZJHM").val(xt.xxtea_decrypt(arr.IDCARDNO));
                        if ($("#txtZJHM").val() != '') {
                            $(".divgrxx").removeClass("hide");
                            window.parent.setFlowBtnState("next", true);
                        } else {
                            $("#tipdiv").removeClass("hide");
                        }
                    }



                } else {
                    if (type == XZ_TYPE) {
                        var tempStr = "";
                        if (isDefault) {
                            tempStr = "用户信息不完整不能申请业务,请进入<b>用户个人信息</b>页面，完善个人信息之后再申请";
                        } else {
                            if (isMain) {
                                tempStr = "用户信息不完整不能申请业务,请完善个人信息之后再申请";
                            } else {
                                tempStr = "用户信息不完整不能申请业务,请进入<b>个人信息设置</b>页面，完善个人信息之后再申请";
                            }
                        }
                        window.parent.showFlowModal("confirm", "温馨提示", tempStr, true);
                    } else if (type == XX_TYPE) {
                        $("#tipdiv").removeClass("hide");
                    }

                }
            } else {
                if (type == XZ_TYPE) {
                    var tempStr = "";
                    if (isDefault) {
                        tempStr = "用户信息不完整不能申请业务,请进入<b>用户个人信息</b>页面，完善个人信息之后再申请";
                    } else {
                        if (isMain) {
                            tempStr = "用户信息不完整不能申请业务,请完善个人信息，并进行实名认证之后再申请";
                        } else {
                            tempStr = "用户信息不完整不能申请业务,请进入<b>个人信息设置</b>页面，完善个人信息之后再申请";
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
    var strCKLX = $("#iptCKLX").val();
    var strSPZT, isHasSP, strSHYJ;
    if (strCKLX.indexOf("S") > -1) {
        isHasSP = !$(".glyphicon-refresh").prop("disabled");
        if (strCKLX == value_cs || strCKLX == value_sp) {
            strSPZT = $.trim($("#drpCSZT").find("option:selected").val());
            strSHYJ = $.trim($("#txtCSSPBZ").val());
        } else if (strCKLX == value_fs) {
            strSPZT = $.trim($("#drpFSZT").find("option:selected").val());
            strSHYJ = $.trim($("#txtFSSPBZ").val());
        }
        if (strSPZT != "未审批" && strSPZT != undefined) {
            if (isHasSP) {
                if (strSPZT == "通过") {
                    PostSPSave(strSPZT, strSHYJ, strCKLX);
                } else {
                    if (strSHYJ == '') {
                        showmodal({
                            content: "请填写审批不通过的理由！", //设置模态窗内容
                            Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
                            SWidth: 300,
                            fontSize: 18,
                            callbackHide: function () {
                                if (strCKLX == value_cs || strCKLX == value_sp) {
                                    $(".glyphicon-refresh[action='CS']").click();
                                } else if (strCKLX == value_fs) {
                                    $(".glyphicon-refresh[action='FS']").click();
                                }
                            }
                        });
                    } else {
                        PostSPSave(strSPZT, strSHYJ, strCKLX);
                    }
                }
            } else {
            showmodal({
                content: "该信息已经审批过，请确认是否重新审批？",
                Qclose: true,
                SWidth: 300,
                fontSize: 18,
                callbackB: true,
                callbackBF: function () {
                    if (strSPZT != "未审批" && strSPZT != undefined) {
                        if (strSPZT == "通过") {
                            PostSPSave(strSPZT, strSHYJ, strCKLX);
                        } else {
                            if (strSHYJ == '') {
                                showmodal({
                                    content: "请填写审批不通过的理由！", //设置模态窗内容
                                    Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
                                    SWidth: 300,
                                    modalIndex: "02",
                                    fontSize: 18,
                                    callbackHide: function () {
                                        if (strCKLX == value_cs || strCKLX == value_sp) {
                                            $(".glyphicon-refresh[action='CS']").click();
                                        } else if (strCKLX == value_fs) {
                                            $(".glyphicon-refresh[action='FS']").click();
                                        }
                                    }
                                });
                            } else {
                                PostSPSave(strSPZT, strSHYJ, strCKLX);
                            }
                        }
                    }
                    return true;
                }
            });

            }
        } else {
            showmodal({
                content: "请填写审批状态！", //设置模态窗内容
                Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
                SWidth: 300,
                modalIndex: "02",
                fontSize: 18,
                callbackHide: function () {
                    if (strCKLX == value_cs || strCKLX == value_sp) {
                        $(".glyphicon-refresh[action='CS']").click();
                    } else if (strCKLX == value_fs) {
                        $(".glyphicon-refresh[action='FS']").click();
                    }
                }
            });

        }
    } else {
        showTip("请确认你是否有审批权限");
    } 



}

//设置审批提交
function PostSPSave(SPZT,SHYJ,type) {

    var strSQBH = $.trim($("#iptSQBH").val());
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    var strLXDH = xt.xxtea_encrypt($.trim($("#txtLXDH").val())); //获取申请人联系电话
    var strUrl = GREI.ApplicationPath + "Model/XSDJ/RemoteHandle/MyTask_XSDJHandler.ashx?&T=" + Math.random();

    $.ajax({
        type: "POST",
        url: strUrl,
        dataType: 'text',
        async: false,
        data: {
            action: 'saveSHdate',
            SQBH: strSQBH,
            SJHM: strLXDH,
            SHZT: SPZT,
            SHYJ: SHYJ
        },
        success: function (t) {
            var objRes = eval('(' + t + ')');
            var strflag = objRes.success;
            if (strflag) {
                if (type == value_cs || type == value_sp) {
                    $(".glyphicon-refresh[action='CS']").prop("disabled", true);
                } else if (type == value_fs) {
                    $(".glyphicon-refresh[action='FS']").prop("disabled", true);
                }
                showTip(objRes.msg);

            } else {
                showTip(objRes.msg);
            }

        }
    });
}

function setSQBH() {
    var strBLWDQZ = window.parent.getFlowData("data", true).WDQZ; //获取办理网点前缀
    var strUrl = GREI.ApplicationPath + "Model/XSDJ/RemoteHandle/MyTask_XSDJHandler.ashx?&T=" + Math.random();
    var res = false;
    $.ajax({
        type: "POST",
        url: strUrl,
        dataType: 'text',
        async: false,
        data: {
            action: "SetSQBH",
            BLWDQZ: strBLWDQZ
        },
        success: function (t) {
            if (!!t) {
                $("#iptSQBH").val(t);
                res = true;
            }

        }
    });
    return res;
}

//数据验证
function ValidationData(strAction) {
    var objRes = new Object();

    //判断申请人信息是否完整
    var isfull = $("#tipdiv").hasClass("hide");

    //附件信息
    var jsonAttach = JSON.stringify($('#tbFJXX').bootstrapTable('getData'));

    var bDone = true;
    var phoneReg = /^1[0-9]{10}$/; //匹配手机号码
    var posterCode = /^[1-9]\d{5}(?!\d)$/;    //匹配邮编
    //判断申请人信息是否完全
    if (!isfull) {
        objRes = "{ CZLX:'SQRXX',data:'申请人信息不完整，请补全个人信息后再进行申请'}";
        bDone = false;

    } else {

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
                            msgFJ = sFJMC.substring(0, sFJMC.length-1);
                        } else {

                            msgFJ += "、" + sFJMC.substring(0, sFJMC.length - 1);
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
        strAction = "saveZXSQ";
    }
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    var objRes = new Object();
    //获取申请人信息
    //var strSQRMC = xt.xxtea_encrypt($.trim($("#txtSQRMC").val())); //获取申请人姓名
    var strLXDH = xt.xxtea_encrypt($.trim($("#txtLXDH").val())); //获取申请人联系电话
    //var strZJLX = $.trim($("#txtZJLX").val()); //获取申请人证件类型
    var strZJHM = xt.xxtea_encrypt($.trim($("#txtZJHM").val())); //获取申请人证件号码
    var strDJDL = $("#iptDJLX").val(); //获取登记大类
    var jsonBLWD = window.parent.getFlowData("data", true);
    var strBLWDID = jsonBLWD.WDID; //获取办理网点ID
    var strBLWDNAME = jsonBLWD.BLWD; //获取办理网点名称

    //获取隐藏控件的值
    var strSQBH = $("#iptSQBH").val();
    var strUrl = GREI.ApplicationPath + "Model/XSDJ/RemoteHandle/MyTask_XSDJHandler.ashx?&T=" + Math.random();
    $.ajax({
        type: "POST",
        url: strUrl,
        dataType: 'text',
        async: false,
        data: {
            action: strAction,
            DJDL: strDJDL,
            SQBH: strSQBH,
            SQRSFZH: strZJHM,
            SQRDHHM: strLXDH,
            HTH:strTXXX.HTH,   
            CSH:strTXXX.CSH,          
            ZSYX:strTXXX.ZSYX,           
            ZSYY:strTXXX.ZSYY,            
            CYFS:strTXXX.CYFS,            
            DDSY:strTXXX.DDSY,
            DJXL: strTXXX.DJXL,
            DKLX: strTXXX.DKLX,
            ISHH: strTXXX.ISHH,
            SQRXX: strTXXX.SQRXX,
            AFGYXX: strTXXX.AFGYXX,
            GGGYXX: strTXXX.GGGYXX,
            BLWDID:strBLWDID,
            BLWDNAME:strBLWDNAME
        },
        success: function (t) {
            objRes = t;
            window.parent.removeFlowData("TXXX");
        }
    })

    return objRes;
}

//加载弹窗提示
function showTip(text) {
    showmodal({
        content: text, 
        Bclose: false,
        SWidth: 250,
        modalIndex: "04",
        fontSize: 18
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

//判断当前在线申请是否超过规定数量
function checkYWSL() {
    var strUrl = GREI.ApplicationPath + "Model/XSDJ/RemoteHandle/MyTask_XSDJHandler.ashx?&T=" + Math.random();
    $.ajax({
        type: "POST",
        url: strUrl,
        dataType: 'text',
        data: {
            action: 'checkSQKZ',
            TYPE: "XSDJ"
        },
        async: false,
        success: function (res) {
            if (res != "" && res.indexOf("success")>-1) {
                var resObj = eval("(" + res + ")"); //转换为json对象
                if (!resObj.success) {
                    window.parent.showFlowModal("confirm", "温馨提示", resObj.data, true);
                } else {
                    window.parent.setFlowBtnState("next", true, false);
                }
            }
        }
    });
}

//加载Panel折叠动画
function LoadPanel(type) {
    $('.collapse.in').prev('.panel-heading').addClass('active');
    $('.panel-group').on('show.bs.collapse', function (a) {
        $(a.target).prev('.panel-heading').addClass('active');
    }).on('hide.bs.collapse', function (a) {
        $(a.target).prev('.panel-heading').removeClass('active');
    });
    var openPanel = "#BodySQXX,#BodyYT,#BodySJ,#BodyFJXX,#BodyDJXL,#BodyTXXX,#BodyYDXZ";
        openPanel += ",#BodySQR";
    if (type == value_ck) {
        //
    } else if (type == value_cs || type == value_sp) {
        openPanel = openPanel + ",#BodyCSXX";
    } else if (type == value_fs) {
        openPanel = openPanel + ",#BodyCSXX,#BodyFSXX";
    }
    $(openPanel).collapse('show');
}

//加载初始化值
function initKey() {
    key_ygdj = "预告及预告抵押";//已经废弃使用---2017-11-21
    key_ysf = "一手房转移登记"; //已经废弃使用---2017-11-21
    key_esf = "二手房转移登记"; //已经废弃使用---2017-11-21
    value_ygdj = "YGDYDJ";
    value_ysf = "YSF";
    value_esf = "ESF";
    value_ishh = $(".HHSQR").length > 0;
    value_lc = "LC";
    value_ck = "CK";
    value_cs = "CS";
    value_sp = "SP";
    value_fs = "FS";
    key_ddsy = "单独所有";
    key_gggy = "共同共有";
    key_afgg = "按份共有";
    var strSFJC = $.trim($("#iptSFJC").val());
    if (!!strSFJC) {
        value_sfyz = strSFJC.indexOf("是") > -1;
    } else {
        value_sfyz = true;
    }
}

//加载审批判断
function checkSP(type) {
    var strTemp = $("#iptSQBH").val();
    var sTemp;
    if (!!strTemp) {
        if (type == value_ck) {
            $("input[action='XX'],select[action='XX'],textarea[action='XX']").prop("disabled", true);
            sTemp = ".divgrxx,.divTXT,.divYDXZ,.divGSY";
            if (value_ishh) {
                sTemp += ",.HHSQR";
            }
            
            if (!value_sfyz) {
                sTemp += ",.divggzh";
            }
            $(sTemp).removeClass("hide");
        } else if (type == value_cs || type == value_sp) {
            $("input[action='XX'],select[action='XX'],textarea[action='XX']").prop("disabled", true);
            sTemp = "#divCSXX,.divTXT,.divYDXZ,.divGSYR,.divgrxx";
            if (value_ishh) {
                sTemp += ",.HHSQR";
            }
            if (!value_sfyz) {
                sTemp += ",.divggzh";
            }
            $(sTemp).removeClass("hide");
            $("#drpCSZT option").eq(0).addClass("hide");
            $("#btnSave").click(function(){
                checkSPSave(type);
            });           
            $(".glyphicon-refresh").click(function(){
                $("#dtCSSJ").val(getCurrentDate("now"));
            });
            getSPData(type);
        } else if (type == value_fs) {
           $("input[action='XX'],select[action='XX'],textarea[action='XX'],input[action='CS'],select[action='CS'],textarea[action='CS']").prop("disabled", true);
           sTemp = ".divTXT,.divYDXZ,.divGSY,.divgrxx";
           if (!value_sfyz) {
               sTemp += ",.divggzh";
           }
           $(sTemp).removeClass("hide");
           $("#drpFSZT option").eq(0).addClass("hide");
           $("#btnSave").click(function () {
               checkSPSave(type);
           });  
           $(".glyphicon-refresh").click(function () {
               $("#dtFSSJ").val(getCurrentDate("now"));
           });
           getSPData(type);                      
        }
    } else {

   }
   getGRData();
}

//加载个人信息
function getGRData() {
    var strUrl = GREI.ApplicationPath + "Model/XSDJ/RemoteHandle/MyTask_XSDJHandler.ashx?T=" + Math.random();
    $.ajax({
        type: "POST",
        url: strUrl,
        dataType: 'text',
        data: {
            action: "loadZXSQ",
            SQBH: $("#iptSQBH").val()
        },
        async: false,
        success: function (res) {

            if (res != "") {
                var resObj = eval("(" + res + ")"); //转换为json对象

                if (resObj.success) {
                    checkDJDL();
                    var arr = eval(resObj.data);
                    loadGRXX(arr);
                } else {
                    showTip(resObj.data);

                }
            }

        }
    });
}

//加载合同版相关个人申请信息
function loadGRXX(arr) {
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    //申请人信息
    if (!!arr.SQR) {
        $("#txtSQRMC").val(tranCSDE(arr.SQR));
    }
    if (!!arr.SQRSFZH) {
        $("#txtZJHM").val(tranCSDE(arr.SQRSFZH));
    }
    if (!!arr.SQRDHHM) {
        $("#txtLXDH").val(tranCSDE(arr.SQRDHHM));
    }

    var strLCLX = $("#iptLCLX").val();

    //-------------------------------------所有业务会有的信息
    //获取合同号
    $("#txtHTH").val(arr.HTBH);
    //获取办理网点
    $("#txtBLWD").val(arr.BLWD);
    //获取是否真实意愿的值
    $(".radioZSYY[value='" + arr.SFZSBD + "']").prop("checked", true);
    //获取是否真实有效的值
    $(".radioZSYX[value='" + arr.SFZSYX + "']").prop("checked", true);
    //获取持有方式的值
    $(".radioCYFS[value='" + arr.GYFS + "']").prop("checked", true);
    
    //---------------------一手房业务和二手房业务会有的信息
    //获取登记小类的值

    if (strLCLX == value_ygdj) {
        //获取贷款类型
        $(".radioDKLX[value='" + arr.DKLX + "']").prop("checked", true);
        if (!value_sfyz) {
            //获取初始登记证号的值
            $("#txtCSH").val(arr.XGZH);            
        }
    } else if (strLCLX == value_ysf) {
        //获取登记小类的值
        $(".radioSPF[value='" + arr.DJXL + "']").prop("checked", true);
        //获取初始登记证号的值
        $("#txtCSH").val(arr.XGZH);
        //获取土地分割证号的值
        //$("#txtFGH").val();
    } else if (strLCLX == value_esf) {
        //获取登记小类的值
        $(".radioCLF[value='" + arr.DJXL + "']").prop("checked", true);
        if (!value_sfyz) {
            //获取初始登记证号的值
            $("#txtCSH").val(arr.XGZH);
        }
    }
}

//通过判断持有方式加载对应的申请人信息
function loadSQRByCYLX(arr) {
    if (arr.GYFS == key_ddsy) {
        $("#txtDDSY").val(tranCSDE(arr.QLRXX[0].SQRMC));
        if ($(".divDDSY").hasClass("hide")) {
            $(".divDDSY").removeClass("hide");
        }
        if (!$(".divGSYR").hasClass("hide")) {
            $(".divGSYR").addClass("hide");
        }
        if (!$(".divGGSY").hasClass("hide")) {
            $(".divGGSY").addClass("hide");
        }
    } else if (arr.GYFS == key_gggy) {
        if ($(".divGGSY").hasClass("hide")) {
            $(".divGGSY").removeClass("hide");
        }
        if (!$(".divGSYR").hasClass("hide")) {
            $(".divGSYR").addClass("hide");
        }
        if (!$(".divDDSY").hasClass("hide")) {
            $(".divDDSY").addClass("hide");
        }
        arr.QLRXX = eval(arr.QLRXX);
        loadGGGY(arr.QLRXX);
    } else if (arr.GYFS == key_afgg) {
        if ($(".divGSYR").hasClass("hide")) {
            $(".divGSYR").removeClass("hide");
        }
        if (!$(".divDDSY").hasClass("hide")) {
            $(".divDDSY").addClass("hide");
        }
        if (!$(".divGGSY").hasClass("hide")) {
            $(".divGGSY").addClass("hide");
        }
        arr.QLRXX = eval(arr.QLRXX);
        loadGYFE(arr.QLRXX);
    }

}

//加载审批信息
function getSPData(type) {
    var strUrl = GREI.ApplicationPath + "Model/XSDJ/RemoteHandle/MyTask_XSDJHandler.ashx?T=" + Math.random();
    $.ajax({
        type: "POST",
        url: strUrl,
        dataType: 'text',
        data: {
            action: "loadSH",
            SQBH: $("#iptSQBH").val()
        },
        async: false,
        success: function (res) {

            if (res != "") {
                var resObj = eval("(" + res + ")"); //转换为json对象

                if (resObj.success) {
                    var arr = eval(resObj.data);
                    var sth = $("#iptSth").val();
                    var xt = new Xxtea(sth);
                    if (type == value_cs || type == value_sp) {
                        if (arr.SPR) {
                            $("#txtCSSPR").val(xt.xxtea_decrypt(arr.SPR)); //审批人姓名
                            $("#dtCSSJ").val(arr.SPRQ); //审批日期
                            $("#drpCSZT").val(arr.CSZT); //审批状态  
                            $("#txtCSSPBZ").val(arr.SPYJ); //审批备注
                            if (!!arr.FSZT) {
                                $("input[action='CS'],select[action='CS'],textarea[action='CS'],.glyphicon-refresh[action='CS']").prop("disabled", true);
                                if (!$(".btn-group").hasClass("hide")) {
                                    $(".btn-group").addClass("hide");
                                }
                            } else {
                                if (type == value_sp) {
                                    $(".glyphicon-refresh[action='CS']").prop("disabled", true);
                                } else {
                                    $(".glyphicon-refresh[action='CS']").prop("disabled", false);
                                }
                                if ($(".btn-group").hasClass("hide")) {
                                    $(".btn-group").removeClass("hide");
                                }
                            }
                        } else {
                            $("#txtCSSPR").val($("#iptUserId").val()); //审批人姓名
                            $("#dtCSSJ").val(getCurrentDate("now")); //审批日期
                            if ($(".btn-group").hasClass("hide")) {
                                $(".btn-group").removeClass("hide");
                            }
                        }
                    } else {
                        if (!!arr.SPR) {
                            //初审
                            $("#txtCSSPR").val(xt.xxtea_decrypt(arr.SPR)); //审批人姓名
                            if ($("#txtCSSPR").val().length > -1) {
                                $("#divFSXX,#divCSXX").removeClass("hide");
                            }
                            $("#dtCSSJ").val(arr.SPRQ); //审批日期{
                            $("#drpCSZT").val(arr.CSZT); //审批状态                        

                            $("#txtCSSPBZ").val(arr.SPYJ); //审批意见

                            if (arr.FSR) {

                                //复审
                                $("#txtFSSPR").val(xt.xxtea_decrypt(arr.FSR)); //审批人姓名
                                $("#dtFSSJ").val(arr.FSRQ); //审批日期
                                $("#drpFSZT").val(arr.FSZT); //审批状态  
                                $("#txtFSSPBZ").val(arr.FSYJ); //审批意见
                                $(".glyphicon-refresh").prop("disabled", true);
                            } else {
                                $("#txtFSSPR").val($("#iptUserId").val()); //审批人姓名
                                $("#dtFSSJ").val(getCurrentDate("now")); //审批日期

                            }
                            if ($(".btn-group").hasClass("hide")) {
                                $(".btn-group").removeClass("hide");
                            }
                        }

                    }
                } else {
                    showTip(resObj.data);

                }



            }

        }
    });
}

//根据登记大类加载对应的信息
function checkDJDL() {
    if ($.trim($("#iptDJLX").val()) != '') {
        $(".divDKLX,.divggzh").addClass("hide");
        var strDJLX = $("#iptLCLX").val();
        
        if (strDJLX == value_ygdj) {
            //显示贷款类型
            if ($(".divDKLX").hasClass("hide")) {
                $(".divDKLX").removeClass("hide");
            }
            //隐藏登记小类
            if (!$(".divDJXL").hasClass("hide")) {
                $(".divDJXL").addClass("hide");
            }
            if (!value_sfyz) {
                //显示初始证号
                if ($(".divggzh").hasClass("hide")) {
                    $(".divggzh").removeClass("hide");
                }
            }
        } else {
            //隐藏贷款类型
            if (!$(".divDKLX").hasClass("hide")) {
                $(".divDKLX").addClass("hide");
            }
            //显示登记小类
            if ($(".divDJXL").hasClass("hide")) {
                $(".divDJXL").removeClass("hide");
            }

            if (strDJLX == value_ysf) {
                //显示一手房转移登记登记小类
                if ($(".djxlSPF").hasClass("hide")) {
                    $(".djxlSPF").removeClass("hide");
                }
                //隐藏二手房转移登记登记小类
                if (!$(".djxlCLF").hasClass("hide")) {
                    $(".djxlCLF").addClass("hide");
                }
                //显示一手房转移登记必填信息
                if ($(".divggzh").hasClass("hide")) {
                    $(".divggzh").removeClass("hide");
                }
            } else {
                //隐藏一手房转移登记登记小类
                if (!$(".djxlSPF").hasClass("hide")) {
                    $(".djxlSPF").addClass("hide");
                }
                //显示二手房转移登记登记小类
                if ($(".djxlCLF").hasClass("hide")) {
                    $(".djxlCLF").removeClass("hide");
                }
                if (!value_sfyz) {
                    //显示初始证号
                    if ($(".divggzh").hasClass("hide")) {
                        $(".divggzh").removeClass("hide");
                    }
                } else {
                    //隐藏value_ysf必填信息
                    if (!$(".divggzh").hasClass("hide")) {
                        $(".divggzh").addClass("hide");
                    }
                }
            }

        }

    } else {

    }

}

//加载相关grid数据
function loadXXGrid(type) {
    showGrid("");
    showFJQDGrid(type);
}

//加载附件信息
function showFJQDGrid(type) {
    var strSQBH = $("#iptSQBH").val();
    var strDJLX = $("#iptDJLX").val();
    var strLCLX = $("#iptLCLX").val();
    if (type == value_lc) {
        strDJXL = strTXXX.DJXL;
        if (strLCLX.indexOf("SF") > -1) {
            strDJLX = strDJXL;
        }

    } else if (type == value_ck) {
        if (strLCLX == value_ysf) {
            strDJXL = $.trim($(".radioSPF:checked").val());
            strDJLX = strDJXL;
        } else if (strLCLX == value_esf) {
            strDJXL = $.trim($(".radioCLF:checked").val());
            strDJLX = strDJXL;
        } 
    } else{
        //strDJLX = key_ygdj;
    }
    var isLC = type == value_lc;

    var strUrl = GREI.ApplicationPath + "Model/XSDJ/RemoteHandle/MyTask_XSDJHandler.ashx?action=getFJXX&sqbh=" + $("#iptSQBH").val() + "&DJLX=" + encodeURI(strDJLX) + "&T=" + Math.random();
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
            align: 'center',
            formatter: function (value, row, index) {
                if (value.indexOf("*") > -1) {
                    html = "<span class='text-danger' id='spanName" + row.XH + "'>" + value + "</span>";
                } else {
                    html = value;
                }
                return html;
            }
        }, {
            field: 'FJLX',
            title: '附件备注',
            align: 'center',
            formatter: function (value, row, index) {
                if (!!value) {
                    html = "<span id='spanName" + row.XH + "'>" + value + "</span>";
                } else if(row.FJNAME.indexOf("*") > -1){
                    html = "<span id='spanName" + row.XH + "'>必选</span>";
                }
                return html;
            }
        }, {
            field: 'ZT',
            title: '上传状态',
            align: 'center',
            formatter: function (value, row, index) {
                if (row.ZT != "") {
                    html = "<span><button type='button' id='spanZT" + row.XH + "'  class='btn btn-info' onclick=\"showListWin('" + strSQBH + "','" + row.XH + "','" + row.FJM + "')\")>查看附件</button></span>";
                } else {
                    if (type != value_lc) {
                        html = "<span class='text-danger' id='spanZT" + row.XH + "'>未上传</span>";
                    } else {
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
                var html = "<span class='btn btn-primary glyphicon glyphicon-upload fileinput-button'><span>上传</span><input type='button' value='上传附件'  name='" + row.XH + "' id = 'btnUpload" + row.XH + "'  onclick=\"showAddWin('" + strSQBH + "','" + row.XH + "','" + row.FJM + "')\"/></span>";
                return html;
            },
            visible: isLC
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
    var sDJLX = tranLCLXC($("#iptDJLX").val());
    var sAJZT = $("#iptAJZT").val();
    var sCKLX = $("#iptCKLX").val();
    var tempUrl =  GREI.ApplicationPath + "Model/ZXSQ/AddAttach.aspx?SQBH=" + strSQBH + "&XH=" + strXH + "&FJMC=" + strFJMC + "&DJLX=" + sDJLX + "&AJZT=" + sAJZT + "&CKLX=" + sCKLX + "&rand=" + Math.random();
    showmodal({
        flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
        title: "附件管理",    //设置模态窗标题
        isText: false,
        hideClick: "static",
        src: tempUrl, //设置模态窗内容
        SMaxheight: 300,  //设置模态窗高度，请输入具体的正整数像素值，默认为auto，请输入具体的像素值，例如300
        SWidth: 600,  //设置模态宽度，请输入具体的正整数像素值，默认为auto，请输入具体的像素值，例如300
        Bclose: false,
        callbackHide: function () {
            //清除附件上传弹窗关闭之后，就聚焦错误
            $("#txtSQRMC").focus(); //在线申请查询证明

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
        iframePadding:false
    })
}

//转义流程类型--数字
function tranLCLX(type) {
    
    switch (type) {
        case value_ygdj:
            strDJLX = 1;
            break;
        case value_ysf:
            strDJLX = 2;
            break;
        case value_esf:
            strDJLX = 3;
            break;
        default:
            strDJLX = 1;
            break;
    }
    return strDJLX;
}

//已经废弃使用---2017-11-21
//转义流程类型--中文
function tranLCLXC(type) {
    switch (type) {
        case value_ygdj:
            strDJLX = key_ygdj;
            break;
        case value_ysf:
        case value_esf:
            strDJLX = strTXXX.DJXL;
            break;
        default:
            strDJLX = key_ygdj;
            break;
    }
    return strDJLX;
}

//转义审批状态
function tranSPZT(type) {
    // "全款购买一手房转移登记" "全款"  /"贷款购买一手房转移登记"  "贷款"
    switch (type) {
        case "通过":
            strSPZT = 3;
            break;
        case "不通过":
            strSPZT = 4;
            break;
        default:
            strSPZT = 4;
            break;
    }
    return strSPZT;
}

//转义审批状态
function tranXZSP(type) {
    // "全款购买一手房转移登记" "全款"  /"贷款购买一手房转移登记"  "贷款"
    switch (type) {
        case value_cs:
            strSPZT = "初审";
            break;
        case value_fs:
            strSPZT = "复审";
            break;
        default:
            strSPZT = "个人";
            break;
    }
    return strSPZT;
}

//加载按份共有的所有人
function loadGYFE(arrGYFE) {
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    var strVar = "";
    strVar += "                                <div class='input-group col-xs-12 text-danger'><p>所有人姓名只支持中文输入，不允许重复，共有份额只支持在0~100之内的两位小数，且共有份额总数必须要等于100。</p></div>\n";
    for (var i = 0; i < arrGYFE.length;i++ ) {
        strVar += "                                <div class='GYXX'>\n";
        strVar += "                                    <div  class='input-group col-xs-12 col-sm-6'>\n";
        strVar += "                                        <label class='input-group-addon bg-iinfo'><b class='text-danger'>*</b>所有人</label>\n";
        strVar += "                                        <input type='text' class='form-control txtGSYR' disabled='disabled' value='" + xt.xxtea_decrypt(arrGYFE[i].SQRMC) + "'/>\n";
        strVar += "                                    </div>\n";
        strVar += "                                    <div  class='input-group col-xs-12 col-sm-6'>\n";
        strVar += "                                        <label class='input-group-addon bg-iinfo'><b class='text-danger'>*</b>共有份额</label>\n";
        strVar += "                                        <input type='text' class='form-control txtGYFS' disabled='disabled' value='" + arrGYFE[i].GYFE + "'/>\n";
        strVar += "                                        <span class='input-group-addon bg-iinfo'>%</span>\n";
        strVar += "                                    </div>                                      \n";
        strVar += "                                </div>\n";
    }
    $(".divGYFE").html(strVar);
}

//加载共同共有的所有人
function loadGGGY(arrGGGY) {
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    var strVar = "";
    strVar += "                                <div class='input-group col-xs-12 text-danger'><p>所有人姓名只支持中文输入，不允许重复。</p></div>\n";
    for (var i = 0; i < arrGGGY.length; i++) {
        strVar += "                                    <div class=\"input-group col-xs-12 col-sm-6 GGXX clearfix p-r-0\">\n";
        strVar += "                                        <label class=\"input-group-addon bg-iinfo\"><b class='text-danger'>*</b>所有人</label>\n";
        strVar += "                                        <input type=\"text\" class=\"form-control txtGGSY\" disabled ='disabled' value='" + xt.xxtea_decrypt(arrGGGY[i].SQRMC) + "'/>\n";
        strVar += "                                    </div>\n";
    }
    $("#BodyGGSY .panel-body .row").html(strVar);
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
//传输解密数据
function tranCSDE(str) {
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    str = xt.xxtea_decrypt(str);
    return str;
}

//传输加密数据
function tranCSEN(str) {
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    str = xt.xxtea_encrypt(str);
    return str;
}

/*----------------------------------------------------------------备选---------end-------*/