/**
* @生成楼盘表
* @version 1.0
* @author 方堃
**/
//生成幢
function SCLJZ() {
    if ($("#ipZID").val() == "") {
        showmodal({
            flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
            title: "提示信息",    //设置模态窗标题
            content: "请先选择幢后生成楼盘！", //设置模态窗内容
            Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
            SWidth: 450,
            fontSize: 18
        });
    }
    else {
        $.ajax({
            type: "post",
            dataType: "html",
            url: '../../Model/LPB/RemoteHandle/BuildingTable.ashx?action=GetLJZ',
            data: { ZId: $("#ipZID").val() },
            success: function (data) {
                if (data == "") {
                    showmodal({
                        flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
                        title: "提示信息",    //设置模态窗标题
                        content: "该幢下没有户信息！", //设置模态窗内容
                        Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
                        SWidth: 250,
                        fontSize: 18,
                        hideClick:'static'
                    });
                }
                else {
                    $("#DivZCX").css('display', 'none');
                    $("#divLP").html(data);
                    SCLPB($("#ipZID").val(), $("#red").html());
                    BDSJ();
                    
                }
            },
            complete: function(){

            }
        });

        if($("#DivLPB").css("display")=="block"){
            $(".modal-backdrop,#showModal").remove();
        }         
    }
}

//显示标注设置
function BDSJ() {
    $("#drpXSFS").change(function () {
        var XZZ = $(this).children('option:selected').val();
        if (XZZ == "1") {
            $.each($('.arrFJH'), function () {
                if( $(this).hasClass("hide"))
                {
                    $(this).removeClass("hide");
                }
            });
            $.each($('.arrBDCDYH'), function () {
                if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
            $.each($('.arrZL'), function () {
                if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
            $.each($('.arrQLRMC'), function () {
               if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
            $.each($('.arrBDCZH'), function () {
                if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
        }
        else if (XZZ == "2") {
            $.each($('.arrFJH'), function () {
                if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
            $.each($('.arrBDCDYH'), function () {
                if( $(this).hasClass("hide"))
                {
                    $(this).removeClass("hide");
                }
            });
            $.each($('.arrZL'), function () {
                if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
            $.each($('.arrQLRMC'), function () {
                if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
            $.each($('.arrBDCZH'), function () {
                if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
        }
        else if (XZZ == "3") {
            $.each($('.arrFJH'), function () {
                if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
            $.each($('.arrBDCDYH'), function () {
                if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
            $.each($('.arrZL'), function () {
                if( $(this).hasClass("hide"))
                {
                    $(this).removeClass("hide");
                }
            });
            $.each($('.arrQLRMC'), function () {
                if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
            $.each($('.arrBDCZH'), function () {
               if(!$(this).hasClass("hide"))
                {
                    $(this).addClass("hide");
                }
            });
        }
        else if (XZZ == "4") {
            var SCQLR = $("#ipHQQLR").val();
            if (SCQLR == "1") {
                $.each($('.arrFJH'), function () {
                    if(!$(this).hasClass("hide"))
                    {
                        $(this).addClass("hide");
                    }
                });
                $.each($('.arrBDCDYH'), function () {
                    if(!$(this).hasClass("hide"))
                    {
                        $(this).addClass("hide");
                    }
                });
                $.each($('.arrZL'), function () {
                    if(!$(this).hasClass("hide"))
                    {
                        $(this).addClass("hide");
                    }
                });
                $.each($('.arrQLRMC'), function () {
                    if( $(this).hasClass("hide"))
                    {
                        $(this).removeClass("hide");
                    }
                });
                $.each($('.arrBDCZH'), function () {
                    if(!$(this).hasClass("hide"))
                    {
                        $(this).addClass("hide");
                    }
                });
            }
            else {
                //权利人名称；
                var ZID = $("#ipHQQLR").val();
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: '../../Model/LPB/RemoteHandle/BuildingTable.ashx?action=GetQLRMC',
                    data: { ZId: $("#ipZID").val() },
                    success: function (data) {
                        $.each($('.arrQLRMC'), function () {
                            var ZJ = data[0][$(this).text()];
                            if (typeof (ZJ) == "undefined") {
                                ZJ = " ";
                            }
                            $(this).text(ZJ);
                            if( $(this).hasClass("hide"))
                            {
                                $(this).removeClass("hide");
                            }
                        });
                        $.each($('.arrFJH'), function () {
                            if(!$(this).hasClass("hide"))
                            {
                                $(this).addClass("hide");
                            }
                        });
                        $.each($('.arrBDCDYH'), function () {
                            if(!$(this).hasClass("hide"))
                            {
                                $(this).addClass("hide");
                            }
                        });
                        $.each($('.arrZL'), function () {
                            if(!$(this).hasClass("hide"))
                            {
                                $(this).addClass("hide");
                            }
                        });
                        $.each($('.arrBDCZH'), function () {
                            if(!$(this).hasClass("hide"))
                            {
                                $(this).addClass("hide");
                            }
                        });
                        $("#ipHQQLR").val(1);
                    }
                });
            }
        }
        else if (XZZ == "5") {
            var SCBDCZH = $("#ipHQZH").val();
            if (SCBDCZH == "1") {
                $.each($('.arrFJH'), function () {
                    if(!$(this).hasClass("hide"))
                    {
                        $(this).addClass("hide");
                    }
                });
                $.each($('.arrBDCDYH'), function () {
                    if(!$(this).hasClass("hide"))
                    {
                        $(this).addClass("hide");
                    }
                });
                $.each($('.arrZL'), function () {
                    if(!$(this).hasClass("hide"))
                    {
                        $(this).addClass("hide");
                    }
                });
                $.each($('.arrQLRMC'), function () {
                    if(!$(this).hasClass("hide"))
                    {
                        $(this).addClass("hide");
                    }
                });
                $.each($('.arrBDCZH'), function () {
                    if( $(this).hasClass("hide"))
                    {
                        $(this).removeClass("hide");
                    }
                });
            }
            else {
                //不动产证号；
                var ZID = $("#ipHQQLR").val();
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: '../../Model/LPB/RemoteHandle/BuildingTable.ashx?action=GetBDCZH',
                    data: { ZId: $("#ipZID").val() },
                    success: function (data) {
                        $.each($('.arrBDCZH'), function () {
                            var ZJ = data[0][$(this).text()];
                            if (typeof (ZJ) == "undefined") {
                                ZJ = " ";
                            }
                            $(this).text(ZJ);
                            if( $(this).hasClass("hide"))
                            {
                                $(this).removeClass("hide");
                            }
                        });
                        $.each($('.arrFJH'), function () {
                            if(!$(this).hasClass("hide"))
                            {
                                $(this).addClass("hide");
                            }
                        });
                        $.each($('.arrBDCDYH'), function () {
                            if(!$(this).hasClass("hide"))
                            {
                                $(this).addClass("hide");
                            }
                        });
                        $.each($('.arrZL'), function () {
                            if(!$(this).hasClass("hide"))
                            {
                                $(this).addClass("hide");
                            }
                        });
                        $.each($('.arrQLRMC'), function () {
                            if(!$(this).hasClass("hide"))
                            {
                                $(this).addClass("hide");
                            }
                        });
                        $("#ipHQZH").val(1);
                    }
                });
            }
        }
    });
}


//单击逻辑撞号
function GetZRZH(e) {
    $("#red").removeClass("btn-info");
    $("#red").addClass("btn-default");
    $("#red").removeAttr("id");
    $(e).attr('id', "red");
    $("#red").removeClass("btn-default");
    $("#red").addClass("btn-info");
    $("#LBP").empty();
    SCLPB($("#ipZID").val(), $(e).html())
    $("#drpXSFS").val(1);
}

/*生成楼盘表*/
function ZSCLP() {
    if ($("#ipZID").val() == "") {
        showmodal({
            flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
            title: "提示信息",    //设置模态窗标题
            content: "请先选择幢后生成楼盘！", //设置模态窗内容
            Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
            SWidth: 450,
            fontSize: 18
        });
    }
    else {
        $.ajax({
            type: "post",
            dataType: "html",
            url: '../../Model/LPB/RemoteHandle/BuildingTable.ashx?action=GetLJZ',
            data: { ZId: $("#ipZID").val() },
            success: function (data) {
                if (data == "") {
                    showmodal({
                        flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
                        title: "提示信息",    //设置模态窗标题
                        content: "该幢下没有户信息！", //设置模态窗内容
                        Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
                        SWidth: 250,
                        fontSize: 18
                    });
                }
                else {
                    $("#DivZCX").css('display', 'none');
                    $("#dLJZ").html(data);
                    SCLPB($("#ipZID").val(), $("#red").html());
                }
            }
        });
    }

}

//后台处理LBP
function SCLPB(sZid, sLJZH) {
    $.ajax({
        type: "post",
        dataType: "html",
        url: '../../Model/LPB/RemoteHandle/BuildingTable.ashx?action=GetLPB',
        data: { ZId: sZid, LJZH: sLJZH },
        beforeSend:function(){
            $("#btnQuery").prop("disabled","disabled");
            try{
                window.parent.setFlowBtnState("all",false);
             }
             catch(e){
             
             }
            showmodal({
                flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
                title: "提示信息",    //设置模态窗标题
                content: "<span class='glyphicon  glyphicon-search sprite'></span> 正在查询.... ", //设置模态窗内容
                Tclose:false,
                Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
                SWidth: 300,
                fontSize: 18,
                hideClick:'static'
            });
        },        
        success: function (data) {
            $("#LBP").html(data);
            $("#DivLPB").css('display', 'block');
            try{
                 window.parent.setFlowBtnState("all",true);
             }
             catch(e){
             
             }
            //绑定全选按钮
            BDQX();
            $("#btnQuery").removeAttr("disabled")
            $(".modal-backdrop,#showModal01").remove();
            $(document.body).removeClass("modal-open");
        }
    });
}


//给CKqx绑定全选
function BDQX()
{
   $("#CKqx").click(function (){
     if ($("#CKqx").is(':checked')) {
       $("input[name = 'LPcheckbox']").prop("checked", true); 
     }
     else
     {
      $("input[name = 'LPcheckbox']").prop("checked", false); 
     }
   })
}

//给Check单击事件
function BDCheck() {
    $("input[name = 'LPcheckbox']").click(function () {
        var xzCHECK = $(this);
        if ($(this).is(':checked')) {
            $('#btnTJ', parent.document).addClass("disabled");
            $('#btnTJ', parent.document).prop('disabled', true);
            $.ajax({
                type: "post",
                dataType: "json",
                url: '../../Model/LPB/RemoteHandle/BuildingTable.ashx?action=IscheckH',
                data: { Hid: $(this).val(), DJZL: $("#iptDJLX").val() },
                success: function (data) {
                    var JG = data[0].JG;
                    var XX = data[0].XX;
                    if (JG == "TRUE") {
                        if (XX != "") {
                            showmodal({
                                flag:"info",
                                title: "提示信息",
                                content: XX,
                                fontSize: 18,
                                Tclose: false,
            
                                Qclose: true,
                                callbackB:true,
                                callbackQ:true,
                                callbackBF: function(){
                                    xzCHECK.prop("checked", true);
                                    return true
                                },
                                callbackQF:function(){
                                    xzCHECK.prop("checked", false);
                                    return true
                                }
                            });
                        }
                    }
                    else {
                        showmodal({
                            flag: "info",
                            title: "提示信息",
                            content: XX,
                            Bclose: false,  //设置右下角关闭按钮是否显示，默认为显示
                            fontSize: 18,
                        });
                        xzCHECK.removeAttr("checked");
                    }
                    $('#btnTJ', parent.document).removeClass("disabled");
                    $('#btnTJ', parent.document).removeAttr('disabled');
                }
            });
        }
    });

}
