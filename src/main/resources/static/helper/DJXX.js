/**
* @DJXX
* @version 1.0
* @author DENG XIAO HONG
**/


//加载申请人grid
function showGrid(strLX) {
    var sWidth = ($(window).width() - 80) / 5;
    var strSQBH = $("#iptSQBH").val();
    var strUrl = "../DYA/RemoteHandle/DJXX.ashx?action=getSQRXX&sqbh=" + strSQBH + "&T=" + Math.random();
    if (strLX=="ZY") {
        strUrl = strUrl + "&QLRLX="+encodeURI("权利人");
    }
    $("#tbSQR").bootstrapTable({
        idField: "Id",
        width: ShowWidth(),
        queryParams: function (param) {
            return {};
        },
        url: strUrl,
        method: 'post', //请求方式（*）
        contentType: "application/x-www-form-urlencoded",
        cache: true, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        sortable: false, //是否启用排序
        sortOrder: "asc", //排序方式
        queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求  
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        strictSearch: true,
        ///  height: 200, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        singleSelect: false,
        columns: [
                { checkbox: true },
                {
                    field: "XH",
                    title: "序号",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        return "<a href=\"#\" id='XH" + index + "'   data-type=\"select\" data-pk=\"" + index + "\" data-title=\"序号\">" + value + "</a>";
                    }
                    //visible: false

                },
                {
                    field: "SXH",
                    title: "顺序号",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        return "<a href=\"#\" id='SXH" + index + "'   data-value=''   data-type=\"text\"  data-pk=\"" + index + "\" data-title=\"顺序号\">" + value + "</a>";
                    }

                },
                {
                    field: "SQRNAME",
                    title: "姓名",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        return "<a href=\"#\" id='SQRNAME" + index + "'  data-value=''   data-type=\"text\" data-pk=\"" + index + "\" data-title=\"姓名\">" + value + "</a>";
                        //class='editable-click editable-empty'  onmouseout ='reloadRowData($(this), " + JSON.stringify(row) + ", \"" + key + "\", " + index + ")'       return "<input  type=\"text\" id='SQRNAME" + index + "'  onchange ='reloadRowData($(this), " + JSON.stringify(row) + ", \"" + key + "\", " + index + ")'    data-type=\"text\" data-pk=\"" + index + "\" data-title=\"姓名\"/>";
                    }

                }, {
                    field: "ZJLB",
                    title: "证件种类",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        return "<a href=\"#\" id='ZJLB" + index + "'   data-type=\"select\" data-pk=\"" + index + "\" data-title=\"证件种类\">" + value + "</a>";
                    }
                },
                {
                    field: "ZJHM",
                    align: 'center',
                    title: "证件号码",
                    formatter: function (value, row, index, key) {
                        return "<a href=\"#\" id='ZJHM" + index + "'  data-value=''  data-type=\"text\" data-pk=\"" + index + "\" data-title=\"证件编号\">" + value + "</a>";
                    }
                }, {
                    field: "GYFE",
                    align: 'center',
                    title: "共有份额",
                    formatter: function (value, row, index, key) {
                        return "<a href=\"#\" id='GYFE" + index + "'  data-value=''  data-type=\"text\" data-pk=\"" + index + "\" data-title=\"共有份额\">" + value + "</a>";
                    }
                }, {
                    field: "SQRLX",
                    title: "权利人类型",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        return "<a href=\"#\" id='SQRLX" + index + "'    data-type=\"select\" data-pk=\"" + index + "\" data-title=\"权利人类型\">" + value + "</a>";
                    }

                }
            ], responseHandler: function (res) {
                //解密申请人姓名和证件号码
                //显示之前进行数据解密
                var sth = $("#iptSth").val();
                var xt = new Xxtea(sth);
                var sData = res.rows;
                for (var i = 0; i < sData.length; i++) {
                    sData[i].SQRNAME = xt.xxtea_decrypt(sData[i].SQRNAME);
                    sData[i].ZJHM = xt.xxtea_decrypt(sData[i].ZJHM);
                }

                return {
                    "total": res.total, //总页数
                    "rows": res.rows   //数据
                };

            },
        onLoadSuccess: function (data) {//数据加载成功事件
            //修改时有添加过的数据
            //alert($('#tbSQR').bootstrapTable('getOptions').totalRows);
            m_index = m_index + parseInt($('#tbSQR').bootstrapTable('getOptions').totalRows);
            //保存时修改 需要设置可编辑
            if ($("#iptCKLX").val() == "XG") {
                SetEditable();
            }

        }


    });

    //转移登记需要隐藏权利人类型
    if (strLX == "ZY") {
        $('#tbSQR').bootstrapTable('hideColumn', 'SQRLX');
    } else {
        $('#tbSQR').bootstrapTable('hideColumn', 'GYFE');
    }

    //给按钮添加点击事件
    $("#AddSQR").click(function () {
        //alert($('#tbSQR').bootstrapTable('getOptions').totalRows);
        AddRow();

    });
    //删除行
    $("#deleteSQR").click(function () {

        var $table = $('#tbSQR');
        var ids = $.map($table.bootstrapTable('getSelections'), function (row) {
            m_index = m_index - 1;
            return row.XH;
        });
        if (ids != "") {
            showmodal({
                flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
                title: "提示信息",    //设置模态窗标题
                content: "请确认是否要删除选择的数据！", //设置模态窗内容
                Tclose: false,  //设置右上角关闭按钮是否显示，默认为显示
                Qclose: true,  //设置右下角关闭按钮是否显示，默认为关闭
                BcloseText: "确定", //设置右下角关闭按钮的文本内容，默认为确定
                QcloseText: "取消",//设置右下角关闭按钮的文本内容，默认为取消
                callbackB: true,
                callbackBF: function () {
                    $table.bootstrapTable('remove', {
                        field: 'XH',
                        values: ids
                    });
                    //重新可编辑
                    SetEditable();
                    return true;
                }
            });

        } else {
            showmodal({
                flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
                title: "提示信息",    //设置模态窗标题
                content: "请至少选择一条数据进行删除！", //设置模态窗内容
                SWidth: 350,
                fontSize: 18
            });

        }

    });


}


// 改变 input 编辑框值时，更新 data 数据，便于新增行时原来填写好的数据不会被新增行强制覆盖
function reloadRowData(obj, row, key, index) {
    row[key] = obj.context.innerHTML;
    //row[key] = obj.context.value;
    $('#tbSQR').bootstrapTable('getOptions').data.splice(index, 1, row);
}
//设置数据保存
function SetValue() {

    var columns = new Array('XH', 'SXH', 'SQRNAME', 'ZJLB', 'ZJHM', 'GYFE', 'SQRLX', 'CZ');
    var sCount = m_index + 1;
    for (var r = 0; r < sCount; r++) {
        var row = {
            XH: '',
            SXH: '编辑文本',
            SQRNAME: '编辑文本',
            ZJLB: '编辑文本',
            ZJHM: '编辑文本',
            SQRLX: '权利人',
            GYFE:'100',
            CZ: ''
        };
        for (var c = 0; c < 6; c++) {
            var key = columns[c];
            if (document.getElementById(key + r) != undefined) {
                row[key] = document.getElementById(key + r).innerHTML;
            }


        }
        $('#tbSQR').bootstrapTable('getOptions').data.splice(r, 1, row);

    }

}
//设置grid宽度
function ShowWidth() {
    var w = $(window).width();
    return w;
}

//添加行
var m_index = -1;
function AddRow() {
    if (m_index > -1) {
        SetValue();
    }
    m_index = m_index + 1;
    $('#tbSQR').bootstrapTable('insertRow', {
        index: m_index,
        row: {
            XH: m_index + 1,
            SXH: m_index + 1,
            SQRNAME: '编辑文本',
            ZJLB: '编辑文本',
            ZJHM: '编辑文本',
            SQRLX: '编辑文本',
            GYFE: '100',
            CZ: ''
        }
    });

    //设置可编辑
    SetEditable();

}
function SetEditable() {
    //设置全局的行数
    $.fn.editable.defaults.mode = 'inline';
    //证件种类数据源
    var objDJZL = $("#iptZJZL").val();
    if (objDJZL != "") {
        objDJZL = window.eval('(' + objDJZL + ')');
    }
    var objQLRLX = $("#iptSQRLX").val();
    if (objQLRLX != "") {
        objQLRLX = window.eval('(' + objQLRLX + ')');
    }
    for (var i = 0; i <= m_index; i++) {
        //编辑顺序号
        $("#SXH" + i).editable({
            type: "text",                //编辑框的类型。支持text|textarea|select|date|checklist等
            title: "顺序号",              //编辑框的标题
            disabled: false,             //是否禁用编辑
            // emptytext: "编辑文本",          //空值的默认文本
            mode: "inline",              //编辑框的模式：支持popup和inline两种模式，默认是popup
            validate: function (value) { //字段验证
                if (!$.trim(value)) {
                    return '不能为空';
                } else {
                    //验证是否数据
                    if (isNaN(value)) {
                        value = "";
                        return '请输入数字类型';
                    }
                }
            },
            success: function (response, newValue) {
                //alert(newValue);
            },
            savenochange: true,
            onblur: "submit"

        });

        //编辑姓名
        $("#SQRNAME" + i).editable({
            type: "text",                //编辑框的类型。支持text|textarea|select|date|checklist等
            title: "姓名",              //编辑框的标题
            disabled: false,             //是否禁用编辑
            // emptytext: "编辑文本",          //空值的默认文本
            mode: "inline",              //编辑框的模式：支持popup和inline两种模式，默认是popup
            validate: function (value) { //字段验证
                if (!$.trim(value)) {
                    return '不能为空';
                }
            },
            success: function (response, newValue) {
                //alert(newValue);
            },
            savenochange: true,
            onblur: "submit"

        });

        //编辑证件种类
        $('#ZJLB' + i).editable({
            type: 'select',
            title: '证件种类',
            placement: 'right',
            value: 99,
            source: objDJZL,
            savenochange: true,
            onblur: "submit"
        });

        //证件编号
        $("#ZJHM" + i).editable({
            type: "text",                //编辑框的类型。支持text|textarea|select|date|checklist等
            title: "证件编号",              //编辑框的标题
            disabled: false,             //是否禁用编辑
            //emptytext: "编辑文本",          //空值的默认文本
            mode: "inline",              //编辑框的模式：支持popup和inline两种模式，默认是popup
            validate: function (value) { //字段验证
                if (!$.trim(value)) {
                    return '不能为空';
                }
            },
            savenochange: true,
            onblur: "submit"//光标移开时提交编辑的数据
        });

        //编辑申请人类型
        $('#SQRLX' + i).editable({
            type: 'select',
            title: '申请人类型',
            placement: 'right',
            source: objQLRLX,
            savenochange: true,
            onblur: "submit"
        });

        //共有份额
        $("#GYFE" + i).editable({
            type: "text",                //编辑框的类型。支持text|textarea|select|date|checklist等
            title: "共有份额",              //编辑框的标题
            disabled: false,             //是否禁用编辑
            emptytext: 0,          //空值的默认文本
            mode: "inline",              //编辑框的模式：支持popup和inline两种模式，默认是popup
            validate: function (value) { //字段验证
                if (!$.trim(value)) {
                    return '不能为空';
                } else {
                    //验证是否数据
                    if (isNaN(value)) {
                        value = "";
                        return '请输入数字类型';
                    }
                }
            },
            savenochange: true,
            onblur: "submit"//光标移开时提交编辑的数据
        });
    } //for

}

//配置不动产单元查询参数
function queryDYHPars(params) {  //配置参数  
    var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的  
        limit: params.limit,   //页面大小  
        offset: params.offset,  //页码  
        sqbh: $("#iptSQBH").val(),
        HIDS: $("#iptHIDS").val()
    };
    return temp;
}

//加载不动产单元信息
function showBDCDYGrid(strLX) {
    var sWidth = ($(window).width() - 80) / 13;
    var strURL =" ../../Model/DYA/RemoteHandle/DJXX.ashx?action=getBDCDYHXX&T=" + Math.random();
    $('#tbBDCDYH').bootstrapTable({
        url: strURL,
        method: 'get', //请求方式（*）
        contentType: "application/x-www-form-urlencoded",
        //toolbar: '#toolbar', //工具按钮用哪个容器
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        // pagination: true, //是否显示分页（*）
        sortable: false, //是否启用排序
        sortOrder: "asc", //排序方式
        queryParams: queryDYHPars, //参数  
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
        onClickRow: function (row, $element) {
            // $("#ipZID").val(row.ZID);
            // $("#tb_departments tr").removeAttr("style");
            $element.css("background-color", "rgb(217, 237, 247)");
        },

        columns: [{
            field: 'XH',
            title: '序号',
            align: 'center'
        }, {
            field: 'DYH',
            title: '单元号',
            align: 'center'
        }, {
            field: 'SZC',
            title: '所在层',
            align: 'center'
        }, {
            field: 'ZCS',
            title: '总层数',
            align: 'center'
        }, {
            field: 'FJH',
            title: '房间号',
            align: 'center'
        }, {
            field: 'LJZH',
            title: '幢编号',
            align: 'center'
        }, {
            field: 'HH',
            title: '户编号',
            align: 'center'
        }, {
            field: 'BDCDYH',
            title: '不动产单元号',
            align: 'center'
        }, {
            field: 'ZL',
            title: '不动产所在坐落',
            align: 'center'
        }, {
            field: 'FWYT1',
            title: '规划用途',
            align: 'center'
        }, {
            field: 'YCJZMJ',
            title: '建筑面积（平方米）',
            align: 'center'
        }, {
            field: 'YCFTJZMJ',
            title: '分摊面积（平方米）',
            align: 'center'
        }, {
            field: 'YCTNJZMJ',
            title: '套内面积（平方米）',
            align: 'center'
        }, {
            field: 'HID',
            title: 'tstybm',
            align: 'center',
            visible: false
        }, {
            field: 'ZID',
            title: 'ZID',
            align: 'center',
            visible: false
        }, {
            field: 'GYTDMJ',
            title: 'GYTDMJ',
            align: 'center',
            visible: false
        }, {
            field: 'FTTDMJ',
            title: 'FTTDMJ',
            align: 'center',
            visible: false
        }, {
            field: 'DYTDMJ',
            title: 'DYTDMJ',
            align: 'center',
            visible: false
        }], responseHandler: function (res) {
            return {
                "total": res.Btotal, //总页数
                "rows": res.Brows   //数据
            };
        }, onLoadSuccess: function (data) {//数据加载成功事件
            //设置默认值
            setEmptyValue();
        }

    });

    //给按钮添加点击事件
    $("#btnXZBDCDYH").click(function () {
        SelectBDCDYH();
    });

    //给按钮添加点击事件,确定选择单元
    $("#btnSelect").click(function () {
        ChangeBDCDYH();
    });


}
//选择不动产单元号
function SelectBDCDYH() {
    var jsonBDCDY = JSON.stringify($('#tbBDCDYH').bootstrapTable('getData'));
    var objRes = eval('(' + jsonBDCDY + ')');
    var sZID = "";
    var sLJZH = "";
    if (objRes.length > 0) {
        for (var i = 0; i < objRes.length; i++) {
            if (sZID == "") {
                sZID = objRes[i].ZID;
            }
            if (sLJZH == "") {
                sLJZH = objRes[i].LJZH;
            }
        }
    }
    $("#ipZID").val(sZID);
    // alert($("#ipZID").val());
    //幢信息
    SCLJZ();
    $("#DivLPB").css('display', 'block');
    $('#myModal').modal();                      // 使用默认值初始化
    $('#myModal').modal({ keyboard: false })   // 初始化。不支持键盘导航
    $('#myModal').modal('show');
    MoveModal();
}

//选择后显示不动产
function ChangeBDCDYH() {
    var arrHid = "";
    $("input[name='LPcheckbox']:checkbox:checked").each(function () {
        if ($(this).val() != "") {
            if (arrHid == "") {
                arrHid = "'" + $(this).val() + "'";
            }
            else {
                arrHid = arrHid + ",'" + $(this).val() + "'";
            }
        }
    })
    $("#iptHIDS").val(arrHid);
    //重新加载
    var sURL = "../DYA/RemoteHandle/DJXX.ashx?action=getBDCDYHXX&T=" + Math.random();

    $('#tbBDCDYH').bootstrapTable('refresh', { url: sURL, queryParams: queryDYHPars });
    //
    $('#myModal').modal('hide');

}

//加载附件信息
function showFJQDGrid(strLX) {


    var strSQBH = $("#iptSQBH").val();
    var strDJLX = $("#iptDJLX").val();
    strDJLX = encodeURI(strDJLX);
    
    var strUrl = "../DYA/RemoteHandle/DJXX.ashx?action=getFJXX&sqbh=" + $("#iptSQBH").val() + "&DJLX=" + encodeURI($("#iptDJLX").val()) + "&T=" + Math.random();

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
                var html = value;
                if (row.ZT != "") {
                    var strSQBH = $("#iptSQBH").val();
                    html = "<span><button type=\"button\" id='spanZT" + row.XH + "'  class=\"btn btn-info\" onclick=\"showListWin('" + strSQBH + "','" + row.XH + "','" + row.FJM + "')\")>查看附件</button></span>";
                } else { 
                    html = "<span class='info' id='spanZT" + row.XH + "'>" + value + "</span>";
                }
                return html;
            }
        }, {
            field: 'CZ',
            title: '操作',
            align: 'center',
            formatter: function (value, row, index) {
                //var html = '<span class="btn btn-primary glyphicon glyphicon-upload fileinput-button"><span>上传</span><input type="file" value="上传附件"  name="' + row.XH + '" id = "file' + row.XH + '"  onclick=""/></span>';
                var strSQBH = $("#iptSQBH").val();
                var html = "<span class=\"btn btn-primary glyphicon glyphicon-upload fileinput-button\"><span>上传</span><input type=\"button\" value=\"上传附件\"  name='" + row.XH + "' id = 'btnUpload" + row.XH + "'  onclick=\"showAddWin('" + strSQBH + "','" + row.XH + "','" + row.FJM + "')\"/></span>";
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
        src: "../ZXSQ/AddAttach.aspx?SQBH=" + strSQBH + "&XH=" + strXH + "&FJMC=" + strFJMC + "&DJLX=" + sDJLX + "&AJZT=" + sAJZT + "&CKLX="+sCKLX+"&rand=" + Math.random(), //设置模态窗内容
        SMaxheight: 300,  //设置模态窗高度，请输入具体的正整数像素值，默认为auto，请输入具体的像素值，例如300
        SWidth: 600,  //设置模态宽度，请输入具体的正整数像素值，默认为auto，请输入具体的像素值，例如300
        Tclose: true,
        Qclose: true,
        Bclose: true,
        callbackHide: function () {
            //清除附件上传弹窗关闭之后，就聚焦错误
            if ($("#txtBDCZH").length > 0) {
                $("#txtBDCZH").focus();//转移登记
            } else if ($("#txtSQBZ").length > 0) {
                $("#txtSQBZ").focus(); //预告登记
            } else if ($("#txtZGZQQDSS").length > 0) {
                $("#txtZGZQQDSS").focus(); //在建工程抵押
            }
            
            //查询是否上传成功
            $.ajax({
                type: "POST",
                url: "../../Model/DYA/RemoteHandle/DJXX.ashx?T=" + Math.random(),
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


//显示附件信息
function showFJXX(strName) {
    var sSQBH = $("#iptSQBH").val();
    var sName = strName;
    showmodal({
        flag: "info",  //设置弹出modal的状态 success:成功窗体,warning:警告窗体,info:信息窗体,default:默认无样式
        title: "附件信息",    //设置模态窗标题
        content: "<img id='imgFJ' src='../../Model/DYA/RemoteHandle/DJXX.ashx?action=XSTP&SQBH=" + sSQBH + "&Name=" + sName + "' alt='' />", //设置模态窗内容
        Tclose: true,
        Bclose: false
    });
}
//跳转到附件列表
function showListWin(strSQBH, strXH, strFJMC) {
    var sDJLX = $("#iptDJLX").val();
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
        url: '../../Model/DYA/RemoteHandle/DJXX.ashx?action=XZFJ&T=' + Math.random(),
        data: { "SQBH": sSQBH, "Name": strName },
        type: 'post'
    });
}

/////获取父页面数据
//function getParentPData(strLX) {
//    var fType = window.parent.getFlowData("flowType", false);
//    return fType;

//}



//数据验证
function FormCheck(xfromElement, checkobj) {
    var om = {};
    if (checkobj) {
        om = checkobj;
    }
    if (!xfromElement) {
        return false;
    }
    for (var o in checkobj) {

        xfromElement[checkobj[o]].onblur = function (e) {
            e = window.event || e;
            var eSrc = e.srcElement || e.target;
            var Xvalue = trim(this.value);
            if (isEmpty(Xvalue)) {
                // ShowMes(eSrc, "此项不能为空", "wrong");
            } else {
                if (this.name == om.TDSYQMJ || this.name == om.DYTDMJ || this.name == om.FTTDMJ || this.name == om.SYQX || this.name == om.FWJZMJ || this.name == om.FWFTMJ || this.name == om.FWTNMJ || this.name == om.DYMJ || this.name == om.BDCJZ || this.name == om.BDCZQSE || this.name == om.ZQQX) {
                    if (!IsFloat(Xvalue)) {
                        this.value = "";
                    } else {
                        ShowMes(eSrc, "", "right");
                    }
                }
            }
        }
    }

    //信息输出
    function ShowMes(o, mes, type) {
        if (!o.ele) {
            var Xmes = document.createElement("div");
            document.body.appendChild(Xmes);
            o.ele = Xmes;
        }
        if (type == "right") {
            o.ele.className = "";
        } else {
            o.ele.className = type;
        }

        o.ele.style.display = "block";
        o.ele.style.left = (XgetPosition(o).x + 400) + "px";
        o.ele.style.top = XgetPosition(o).y + "px";
        o.ele.innerHTML = mes;
    }
}
//是否数据类型
function IsFloat(v) {
    var reg = /^[0-9]+(.[0-9]{2})?$/;
    if (reg.test(v)) {
        return true;
    } else {
        return false;
    }

}

/*去除空白字符*/
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/*判断为空*/
function isEmpty(o) {
    return o == "" ? true : false;
} /*判断是否为合适长度 6-18 位*/


function XgetPosition(e) {
    var left = 0;
    var top = 0;
    while (e.offsetParent) {
        left += e.offsetLeft;
        top += e.offsetTop;
        e = e.offsetParent;
    }
    left += e.offsetLeft;
    top += e.offsetTop;
    return {
        x: left,
        y: top
    };
}

//从父页面获取单元号
function getPData() {
    if ($("#iptCKLX").val() == "") {//当前页面显示在iframe
        var sRes = window.parent.getFlowData("hids",false); // parent.getDataByCZLX("BDCDYH");
        $("#iptHIDS").val(sRes);
    }

}

//移动窗体
function MoveModal() {
    var $dialog = $("#myModal").find('.modal-dialog');
    //设置高度和宽度

    var m_top = $("#myModal.modal").css("margin-top");
    $("#myModal.modal .modal-dialog").css({ "width": $(window).width() - 80 + "px" });

    //设置模态窗高度

    // $("#myModal.modal .modal-dialog .modal-body").css({ "height": 400 + "px" });

    var $head = $dialog.children().eq(0);
    var move = {
        isMove: false,
        left: 0,
        top: 0
    };
    //委托
    $head.mousedown(function (e) {
        move.isMove = true;
        var offset = $dialog.offset();
        move.left = e.pageX - offset.left;
        move.top = e.pageY - offset.top;
    });
    $("#myModal").mousemove(function (e) {
        if (!move.isMove) return;
        //console.log('移动的是', e.target);
        $dialog.offset({
            top: e.pageY - move.top,
            left: e.pageX - move.left
        });
    }).mouseup(function (e) {
        //console.log("left:"+move.left+", top:"+move.top );
        move.isMove = false;
    });

}

///转换申请的业务类型
function ConvertYWLX(strBM) {
    var sMC = "转移登记";
    switch (strBM) {
        case "YGDY":
            sMC = "预告抵押登记";
            break;
        case "ZJGCDY":
            sMC = "在建工程抵押登记";
            break;
        case "YGDYLP":
            sMC = "预告抵押登记（从楼盘表驱动）";
            break;
        case "YBDY":
            sMC = "一般抵押登记";
            break;
        case "ZYDJ":
            sMC = "转移登记";
            break;
        case "ZYDJ":
            sMC = "变更登记";
            break;
        case "YGDJ":
            sMC = "预告登记";
            break;
        case "YSF":
            sMC = "一手房转移登记";
            break;
        case "ESF":
            sMC = "二手房转移登记";
            break;
        default:
            break;


    }
    return sMC;

}

 