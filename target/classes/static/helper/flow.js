var colorList;
var count;
var m_CZLX;
//页面倒计时行为
function timer(intDiff) {
    var time = window.setInterval(function () {
        var second = 0; //时间默认值
        if (intDiff > 0) {
            second = Math.floor(intDiff);
        }
        else if (intDiff <= 0) {
            clearInterval(time);
            $("#btnTJ").prop("disabled",false);
        }
        $('#second_show').html(second + '秒');
        intDiff--;
    }, 1000);

    return time;
}

//页面跳转行为
function methodBtn(index, method, end,strPar) {
    var fFor;
    var url;
    if (end != true) {
        if (method == "back") {
            if (index == 1) {
                fFor = ".for" + String.fromCharCode(index + 65);
            } else {
                fFor = ".for" + String.fromCharCode(index + 64);
            }
            $(fFor).removeClass("for-cur");
            url = $(".for" + String.fromCharCode(index + 63)).children("strong").attr("id") + "?strRes=" + strPar + "&DJLX=" + $("#iptDJLX").val()+'&new=' + Math.random(); 
            $("#iList").attr("src", url);
            checkColor("default");
        } else if (method == "forward") {
             $("#btnTJ").prop("disabled",true);
            fFor = ".for" + String.fromCharCode(index + 65);
            url = $(fFor).children("strong").attr("id") + "?strRes=" + strPar + "&DJLX=" + $("#iptDJLX").val() + '&new=' + Math.random(); 
               $(fFor).addClass("for-cur");

               $("#iList").attr("src", url);
                checkColor(colorList);
           
        }
    } else if (end == true) {
        //timer(5);
    }

}
//给流程绑定颜色和移除样式
function checkColor(color) {
    if (color != "default") {
        $(".flowList.for-cur").css({ "border": "2px solid rgb(" + color + ")","text-align": "right" });
        $(".flowList.for-cur,.flowListBox .for-cur em").css({ "background-color": "rgb(" + color + ")" });
        $(".flowListBox .for-cur em").css({ "border": "0px none #000","box-shadow": "0 0 5px 2px rgba(" + color + ", 0.56)" });
        $(".flowListBox .for-cur em").removeClass("glyphicon-time").addClass("glyphicon-ok");
        $(".flowListBox .for-cur strong,.successs h3").css({ "text-align": "right", "color": "rgb(" + color + ")" });
    } else {
        $this = $('.flowList:not(.for-cur)');
        $this.css({ "border": "2px dashed #fff", "background-color": "#ccc", "text-align": "center" });
        $this.children("em").css({ "background-color": "#ccc", "box-shadow": "0 0 5px 0px rgba(255, 255, 255, 0.56)" });
        $this.children("em").removeClass("glyphicon-ok").addClass("glyphicon-time");
        $this.children("strong").css({ "color": "#ccc"});
    }
}
//给流程绑定宽度
function fixWidth(count) {
    var part = parseInt(100 / count) + "%";
    $(".flowListBox .flowList").css("width", part);
}

//给按钮绑定相关事件
function checkBtn(index, count) {
    $("#btnBack").addClass("disabled");
    $("#btnTJ").prop("disabled",true);
    var Winwidth = $("#iList").width();
    $("#btnBack,#btnTJ").css({ "width": Winwidth * 0.2 + "px"});
    var icheck = ($("#iList").parent().width() - $("#btnBack").width() * 2) / 4;
    if (icheck > 0) {
        $("#btnBack").css({ "margin-left": icheck*0.3 + "px", "margin-right": icheck + "px" });

    }
    $("#iList").load(function() { 
        //console.log("加载完了");
        timer(5);
        //console.log("加载完了");

        //$("#btnTJ").prop("disabled",false);
    });  
    $("#btnTJ").click(function () {
        //将上一页面的返回传给下一个页面
        var strSendData = CallChildPage(index);
        if (strSendData != "Err"&&typeof(strSendData)!="undefined") {
            //在线申请需要在提交的时候确认一下
            if(m_CZLX=="DJXX"){
                var sRes = iframeSelf.window.getResult();
                var objRes = eval('(' + sRes + ')');
                var content = objRes.TSNR;
                $("#iptDJLX").showmodal({
                    flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
                    title: "提示信息",    //设置模态窗标题
                    content: content, //设置模态窗内容
                    Tclose: false,  //设置右上角关闭按钮是否显示，默认为显示
                    Qclose: true,  //设置右下角关闭按钮是否显示，默认为关闭
                    BcloseText:"确定并提交",//设置右下角关闭按钮的文本内容，默认为确定
                    QcloseText:"返回修改"//设置右下角关闭按钮的文本内容，默认为取消
                });
                //确认提交
                $("#close").click(function () {
                    //执行数据提交
                    var sRes = iframeSelf.window.SubmitData("savedata");
                    var objRes = eval('(' + sRes + ')');
                    var strCZLX = objRes.CZLX;
                    var strData = objRes.data;
                    if(strData=="OK"){
                        //提交成功，就可以获取到申请编号
                        var strSQBH = objRes.SQBH;
                        strSendData = strSQBH;
                        //保存到隐藏控件
                        $("#iptSQBH").val(strSQBH);
                         var _thisl=$(".flow .flowListBox .for-cur").length;
                        index = (index>_thisl)?index:_thisl;
                        methodBtn(index++, 'forward', false, strSendData);
                        if (index != 1) {
                            $("#btnBack").removeClass("disabled");
                        }
                        if (index >= count) {
                            $("#btnBack,#btnTJ").addClass("disabled hidden").prop('disabled', true);
                        }
                        refreshBack(index);
                    }else{
                    
                         $("#iptDJXX").showmodal({
                            flag: "info",
                            title: "提示信息",
                            content: strData,
                            Tclose: true
                        });
                         cancelFlow();  
                    } 
                });
                //返回修改
                $("#bcancel").click(function() {
                    //$("#btnTJ").prop("disabled",false);
                })
                
            }else{//其他的直接提交
                 var _thisl=$(".flow .flowListBox .for-cur").length;
                index = (index>_thisl)?index:_thisl;

                methodBtn(index++, 'forward', false, strSendData);
                if (index != 1) {
                    $("#btnBack").removeClass("disabled");
                }
                if (index >= count) {
                    $("#btnBack,#btnTJ").addClass("disabled hidden").prop('disabled', true);
                }
                refreshBack(index);
            
            }
//            $("#btnTJ").prop("disabled",true);
//            $("#iList").load(function() { 
//                //console.log("加载完了");
//                timer(5500);
//                //console.log("加载完了");

//                $("#btnTJ").prop("disabled",false);
//            });            
        }else{
            cancelFlow();  
        }



    });
    $("#btnBack").click(function () {
        var _this=refreshBack(index);
        var _thisl=$(".flow .flowListBox .for-cur").length;
        index = (_this>_thisl)?_this:_thisl;
        if (index > 1) {
            //var strSendData = back();
            methodBtn(index--, 'back', false, "");
            if (index == 1) {
                $("#btnBack").addClass("disabled");
            }
        }
       
    });
}

//刷新上一步执行情况
function refreshBack(index) {
    return index;

}

//判断不同页面回传参数方式
function back() {
    var url = location.href;
    if (url.indexOf("ZXYY") >= 0) { //判断url地址中是否包含Main字符串
        
        var sRes = iframeSelf.window.getInfo();
        var objRes = eval('(' + sRes + ')');
        var strCZLX = objRes.CZLX;
        var strData = objRes.data;
        return strData;
     }
}

function open_xmll(url) {
    $("#iList").attr("src", url);
}

//调用子页面的方法
function CallChildPage(index) {
    var bDone = true;
    var sRes = iframeSelf.window.getResult();
    var objRes = eval('(' + sRes + ')');
    var strCZLX = objRes.CZLX;
    var strData = objRes.data;
    m_CZLX=strCZLX;
    var strSendData = "";
    //阅读须知需要
    if (strCZLX == "YDXZ") {
        var strDJLX = objRes.DJLX;
        $("#iptDJLX").val(strDJLX);
        strSendData=strDJLX;

    } else if (strCZLX == "LPB") {//楼盘表返回的数据是JSon对象

        var bdcdyObj = objRes.data.list;
        for (var i = 0; i < bdcdyObj.length; i++) {
            var strHID = bdcdyObj[i].HID;
            if (strSendData == "") {
                strSendData = "'" + strHID + "'";
            } else {
                strSendData = strSendData + ",'" + strHID + "'";
            }
        }
        //判断楼盘表是否选择数据
        if (strSendData == "") {
            //alert("请至少选择一个不动产单元！");
            $("#iptDJLX").showmodal({
                flag: "info",
                title: "提示信息",
                content: "请至少选择一个不动产单元！",
                Tclose: true
            });
            bDone = false;
        } else {
            bDone = false;
            //验证不动产单元
            var strDJLX = $("#iptDJLX").val();
            $.ajax({
                type: "post",
                dataType: "json",
                async: false,
                url: '../../Model/LPB/RemoteHandle/BuildingTable.ashx?action=IscheckHs',
                data: { Hids: strSendData, DJZL: strDJLX },
                success: function (data) {
                    var JG = data[0].JG;
                    var XX = data[0].XX;
                    if (JG == "TRUE") {
                        if (XX != "") {
                            $('#btnTJ', parent.document).showmodal({
                                flag:"info",
                                title: "提示信息",
                                content: XX,
                                fontSize: 18,
                                Tclose: false,
                                Qclose: true
                            });
                            $("#close").click(function() {
                               //保存到隐藏控件
                                $("#iptBDCDHYS").val(strSendData);
                                bDone = true;
                                methodBtn(index++, 'forward', false, strSendData);
                                if (index != 1) {
                                    $("#btnBack").removeClass("disabled");
                                }
                                if (index >= count) {
                                    $("#btnBack,#btnTJ").addClass("disabled hidden");
                                    $('#btnBack,#btnTJ').prop('disabled', true);
                                }
                                
                                refreshBack(index);
                            })
                            $("#bcancel").click(function() {
                             
                            })
                        }
                        else
                        {
                            //保存到隐藏控件
                            $("#iptBDCDHYS").val(strSendData);
                             bDone = true;
                        }
                    }
                    else {
                        $('#btnTJ', parent.document).showmodal({
                            flag: "info",
                            title: "提示信息",
                            content: XX,
                            Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
                            fontSize: 18,
                        });
                    }
                }
            });
            
        }
    } else if (strCZLX == "DJXX") {//登记信息

        if (strData != "OK") {
            $("#iptDJXX").showmodal({
                flag: "info",
                title: "提示信息",
                content: strData,
                Tclose: true
            });
            bDone = false;
        } else { 
            //验证通过，确认是否提交
            strSendData = strData;
        }
    }
    else if (strCZLX == "YYXZ") {

        var res = objRes.data; //预约信息是json串
        if (res != "OK") {
            if (res.indexOf('{') >= 0) {
                strSendData = res;
            } else {
                $("#showM").showmodal({
                    flag: "info",
                    title: "提示信息",
                    content: res,
                    Tclose: true

                });

                bDone = false;
            }

        }

    }
    else if (strCZLX == "YYXX") {

        var yyxx = objRes.data; //预约信息是json串
        if (yyxx == "error") {
            $("#showM").showmodal({
                flag: "info",
                title: "提示信息",
                content: "必填项均不能为空！",
                Tclose: true
            });
            bDone = false;

        } else if (yyxx == "empty") {

            $("#showM").showmodal({
                flag: "info",
                title: "提示信息",
                content: "个人信息不全不可进行预约！",
                Tclose: true
            });

            bDone = false;
        } else {
            var yyxx = objRes.data.list; //预约信息是json串
            if (yyxx != null && yyxx != "null" && typeof (yyxx) != "undefined") {
                var res = eval(yyxx);

                strSendData = JSON.stringify(yyxx);
            }
        }
    }
    else if (strCZLX == "YYSJ") {

        var yyxx = objRes.data; //预约信息是json串

        if (yyxx == "error") {
            $("#showM").showmodal({
                content: "请至少选择一个预约时间段！",
                SWidth: "200"
            });
            bDone = false;
        }
        else if (yyxx != null && yyxx != "null" && typeof (yyxx) != "undefined") {
            var res = eval(yyxx);
            if (res.length > 0) {
                strSendData = JSON.stringify(res[0]);
            }
        }

    }
    else if (strCZLX == "ERROR") { 
       var info = objRes.data;
       $("#showM").showmodal({
                flag: "info",
                title: "提示信息",
                content: info,
                Tclose: true,
                fontSize: "16px",
                contentLeft: true
              
            });
            bDone = false;
    }
    else if (strCZLX == "BLWD") {
        var strSendData = objRes.data; //接受传过来的办公地点
        if (strSendData == "") {
            $("#showM").showmodal({
                flag: "info",
                title: "提示信息",
                content: "请选择一个办理网点！",
                Tclose: true

            });

            bDone = false;
        } else {
            //保存到隐藏控件
            $("#iptBLWD").val(strSendData);
        }
        
    }

    if (bDone) {
        return strSendData
    } else {

        return "Err";
    }
}

//阻止默认事件
function cancelFlow(){
    // 兼容FF和IE和Opera    
    var Event = event || window.event;    
    if ( Event && Event.preventDefault ){
        //因此它支持W3C的stopPropagation()方法
        Event.preventDefault(); 
        Event.stopPropagation();  
         
    }
    else{
     //否则，我们需要使用IE的方式来取消事件冒泡 
     Event.returnValue = false; 
     Event.cancelBubble=true; 

     return false;   
    }

}

//重新加载界面计算相关高度
function ReHeight() {
    var bodyH, rbodyH, marginB, bodyW;
    //var url = parent.location.href;
    bodyW = window.screen.width;
    if (bodyW > 1024) {
       bodyH = document.documentElement.clientHeight-200;
    } else {
       bodyH = document.documentElement.clientHeight - 160;
    }

    $("#iList").height(bodyH);
}

//调整页面居中
function adjustCenter(obj, childobj) {
    // 是childobj居中。。。  
    var $childobj = obj.find(childobj);
    //获取可视窗口的高度  
    //var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    var clientHeight = $(document.body).parent().parent().height();
    var clientWidth = $(document.body).parent().parent().width();
    if (clientWidth >= window.screen.width) {
        clientWidth = window.screen.width;
    }
    //得到dialog的高度  
    var childHeight = $childobj.height()+50;
    var childWidth = $childobj.width();
    //计算出距离顶部的高度  
    var m_top;
    var m_left;

    if (childobj == "#showBox") {
        m_top = Math.abs((clientHeight - childHeight) / 4);
        m_left = Math.abs((clientWidth - childWidth) / 8);
        if (clientWidth > 1024) {
            $childobj.css({ 'margin': m_top + 'px auto '+m_top + 'px auto', 'padding-left': m_left + 'px ', 'padding-right': m_left + 'px ' });
        } else {
            $childobj.css({ 'padding': m_top + 'px '+m_left + 'px '});
        }
        
        checkPanelCss(clientWidth, $childobj);
    } else {
        m_top = Math.abs((clientHeight - childHeight) / 2);
        m_left = Math.abs((clientWidth - childWidth) / 2);
        $childobj.css({ 'margin': m_top + 'px ' + m_left + 'px ' });
    }

}

//确定当前面板字体样式
function checkPanelCss(clientWidth, showbox) {
    if (clientWidth > 1024) {
        showbox.removeClass("h4");
        showbox.addClass("h3");
        showbox.css({"line-height":"150%"});
    } else {
        showbox.removeClass("h3");
        showbox.addClass("h4");
        showbox.css({ "line-height": "100%" });
    }
}

///供子页面获取父页面
function getDataByCZLX(strLX) {
    var strRes = "";
    var tempRes=$("#iptBLWD").val();
    var sWDMC=""
    var sWDID="";
    var sWDLXDH="";
    var sWDSL="";
    if(tempRes!=""){
     var resArr=tempRes.split("|");
     sWDID=resArr[0];
     sWDMC=resArr[1];
     sWDLXDH=resArr[2];
     sWDSL=resArr[3];
    }
    switch (strLX) {
        case "DJLX":
            strRes = $("#iptDJLX").val();
            break;
        case "BDCDYH":
            strRes = $("#iptBDCDHYS").val();
            break;
        case "SQBH":
            strRes = $("#iptSQBH").val();
            break;
        case "BLWD":
            strRes = sWDMC;
            break;
         case "WDID":
            strRes = sWDID;
            break;
         case "WDLXDH":
            strRes = sWDLXDH;
            break;
         case "WDSL":
            strRes = sWDSL;
            break;
         
    }
    return strRes;

}
