//加载申请人grid
function showGrid(strLX) {
    var sWidth = ($(window).width() - 80) / 5;
    var strSQBH = $("#iptSQBH").val();
    var strUrl = "../DYA/RemoteHandle/DJXX.ashx";
    var isLC = strLX.indexOf("LC") > -1;
    if (!isLC) {
        strUrl += "?action=getSQRXX&sqbh=" + strSQBH + "&T=" + Math.random();
        if (strLX == "ZY") {
            strUrl += "&QLRLX=" + encodeURI("权利人");
        }
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
                { checkbox: isLC,
                  visible: isLC
                },
                {
                    field: "XH",
                    title: "序号",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        var strTemp = "<a href=\"#\" id='XH" + index + "'   data-type=\"select\" data-pk=\"" + index + "\" data-title=\"序号\">" + value + "</a>";
                        return strTemp;
                    }

                },
                {
                    field: "SXH",
                    title: "顺序号",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        var strTemp = "<a href=\"#\" id='SXH" + index + "'   data-value=''   data-type=\"text\"  data-pk=\"" + index + "\" data-title=\"顺序号\">" + value + "</a>";
                        return strTemp;
                    }

                },
                {
                    field: "SQRNAME",
                    title: "姓名",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        var strTemp;
                        if (!isLC) {
                            strTemp = "<a href=\"#\" id='SQRNAME" + index + "'  data-value=''   data-type=\"text\" data-pk=\"" + index + "\" data-title=\"姓名\">" + tranCSDE(value) + "</a>";
                        } else {
                            strTemp = "<a href=\"#\" id='SQRNAME" + index + "'  data-value=''   data-type=\"text\" data-pk=\"" + index + "\" data-title=\"姓名\">" + value + "</a>";
                        }
                        return strTemp;
                    }

                }, {
                    field: "ZJLB",
                    title: "证件种类",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        var strTemp = "<a href=\"#\" id='ZJLB" + index + "'   data-type=\"select\" data-pk=\"" + index + "\" data-title=\"证件种类\">" + value + "</a>";
                        return strTemp;
                    }
                },
                {
                    field: "ZJHM",
                    align: 'center',
                    title: "证件号码",
                    formatter: function (value, row, index, key) {
                        var strTemp;
                        if (!isLC) {
                           strTemp = "<a href=\"#\" id='ZJHM" + index + "'  data-value=''  data-type=\"text\" data-pk=\"" + index + "\" data-title=\"证件编号\">" + tranCSDE(value) + "</a>"
                        } else {
                           strTemp = "<a href=\"#\" id='ZJHM" + index + "'  data-value=''  data-type=\"text\" data-pk=\"" + index + "\" data-title=\"证件编号\">" + value + "</a>"
                        }
                        return strTemp;
                    }
                }, {
                    field: "GYFE",
                    align: 'center',
                    title: "共有份额",
                    formatter: function (value, row, index, key) {
                        var strTemp = "<a href=\"#\" id='GYFE" + index + "'  data-value=''  data-type=\"text\" data-pk=\"" + index + "\" data-title=\"共有份额\">" + value + "</a>";
                        return strTemp;
                    }
                }, {
                    field: "SQRLX",
                    title: "权利人类型",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        var strTemp = "<a href=\"#\" id='SQRLX" + index + "'    data-type=\"select\" data-pk=\"" + index + "\" data-title=\"权利人类型\">" + value + "</a>";
                        return strTemp;
                    },
                    visible: false

                }
            ], responseHandler: function (res) {
                return {
                    "total": res.total, //总页数
                    "rows": res.rows   //数据
                };

            },
        onLoadSuccess: function (data) {//数据加载成功事件
            //修改时有添加过的数据
            m_index = m_index + parseInt($('#tbSQR').bootstrapTable('getOptions').totalRows);
            //保存时修改 需要设置可编辑
            if ($("#iptCKLX").val() == "XG") {
                SetEditable();
            }

        }


    });

//    //转移登记需要隐藏权利人类型
//    if (strLX == "ZY") {
//        $('#tbSQR').bootstrapTable('hideColumn', 'SQRLX');
//    } 

    //给按钮添加点击事件
    $("#AddSQR").click(function () {
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
                content: "请确认是否要删除选择的数据！", //设置模态窗内容
                SWidth: 250,
                fontSize: 18,
                Qclose: true,  //设置右下角关闭按钮是否显示，默认为关闭
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
            GYFE: '100',
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


/*----------------------------------------------------------------合同版SQRGRID验证相关---------start-------*/
function checkSQRXX(strCYFS) {
    var strTemp;
    //获取申请人信息
    var jsonSQR = JSON.stringify($('#tbSQR').bootstrapTable('getData'));

    var objRes = eval('(' + jsonSQR + ')');
    if (objRes.length < 1) {
        strTemp = "请填写申请人信息！";
        bDone = false;
    } else {
        var arrXM = new Array();
        var arrZJLB = new Array();
        var arrZJHM = new Array();
        var arrSQRLX = new Array();
        var arrGYFE = new Array();
        var arrSXH = new Array();
        //验证身份证号码
        for (var i = 0; i < objRes.length; i++) {
            arrXM.push(objRes[i].SQRNAME);
            arrZJLB.push(objRes[i].ZJLB);
            arrZJHM.push(objRes[i].ZJHM);
            arrGYFE.push(objRes[i].GYFE);
            arrSXH.push(objRes[i].SXH);
        }
        strTemp = checkData(arrXM, arrZJLB, arrZJHM, arrSQRLX, arrGYFE, arrSXH, strCYFS);

    }   

    return strTemp;
}
//检测申请人信息正确性
function checkData(arrXM, arrZJLB, arrZJHM, arrSQRLX, arrGYFE, arrSXH, strCYFS) {
    var strError = '';
    strError = checkSXH(arrSXH);
    if (strError.length == 0) {
        strError = checkXM(arrXM);
    }
    if (strError.length == 0) {
        strError = checkZJLB(arrZJLB);
    }
    if (strError.length == 0) {
        strError = checkZJHM(arrZJLB, arrZJHM);
    }

    if (strError.length == 0) {
        strError = checkGYFE(arrGYFE, strCYFS);
    }
    return strError;
}

//检测申请人姓名是否正确
function checkXM(arr) {
    var strError = '';
    var isAllRight = true;
    if (arr.length == 0) {
        isAllRight = false;
    } else {
        if (arr.length == 1) {
            if (checkArrayNull(arr[0])) {
                isAllRight = false;
                strError += "第1行、";
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (checkArrayNull(arr[i])) {
                    isAllRight = false;
                    strError += "第" + (i + 1) + "行、";
                }
            }
        }
    }

    if (!isAllRight) {
        strError = strError.substring(0, strError.length - 1);
        strError += "申请人姓名为空";
    } else {
        if (checkArrayUnique(arr)) {
            strError += "申请人姓名重复";
        }
    }
    return strError;

}

//检测申请人证件类别是否正确
function checkZJLB(arr) {
    var strError = '';
    var isAllRight = true;
    if (arr.length == 0) {
        isAllRight = false;
    } else {
        if (arr.length == 1 && checkArrayNull(arr[0])) {
            isAllRight = false;
            strError += "第1行、";
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (checkArrayNull(arr[i])) {
                    isAllRight = false;
                    strError += "第" + (i + 1) + "行、";
                }
            }
        }
    }

    if (!isAllRight) {
        strError = strError.substring(0, strError.length - 1);
        strError += "证件类别为空";
    }
    return strError;

}

//检测申请人证件号码是否正确
function checkZJHM(arrZJLB, arrZJHM) {
    var strError = '';
    var isAllRight = true;
    if (arrZJHM.length == 0) {
        isAllRight = false;
    } else {
        if (arrZJHM.length == 1) {
            if (checkArrayNull(arrZJHM[0])) {
                isAllRight = false;
                strError += "第1行、";
            } else {
                if (arrZJLB[0] == key_sfz && !CheckCardId(arrZJHM[0])) {
                    isAllRight = false;
                    strError += "第1行、";
                }
            }
        } else {
            for (var i = 0; i < arrZJHM.length; i++) {
                if (checkArrayNull(arrZJHM[i])) {
                    isAllRight = false;
                    strError += "第" + (i + 1) + "行、";
                } else {
                    if (arrZJLB[i] == key_sfz && !CheckCardId(arrZJHM[i])) {
                        isAllRight = false;
                        strError += "第" + (i + 1) + "行、";
                    }
                }
            }
        }
    }

    if (!isAllRight) {
        strError = strError.substring(0, strError.length - 1);
        strError += "证件号码为空或者格式不正确";
    } else {
        if (checkArrayUnique(arrZJHM)) {
            strError += "证件号码重复";
        }
    }
    return strError;
}

//检测申请人共有份额是否正确
function checkGYFE(arr, strCYFS) {
    var strError = '';
    var isAllRight = true;
    if (arr.length == 0) {
        isAllRight = false;
    } else {
        if (arr.length == 1) {
            if (checkArrayNull(arr[0])) {
                isAllRight = false;
                strError += "第1行、";
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (checkArrayNull(arr[i]) || arr[i] <= 0) {
                    isAllRight = false;
                    strError += "第" + (i + 1) + "行、";
                }
            }
        }
    }


    if (!isAllRight) {
        strError = strError.substring(0, strError.length - 1);
        strError += "共有份额为空";
    } else {
        if (strCYFS == key_ddsy) {
            if (arr.length != 1 || sum(arr) != 100) {
                isAllRight = false;
                strError += key_ddsy + "的所有人必须为一个，且共有份额必须为100";
            }
        } else if (strCYFS == key_gggy) {
            if (arr.length <= 1) {
                isAllRight = false;
                strError += key_gggy + "的所有人至少包含两个";
            }
        } else if (strCYFS == key_afgg) {
            if (arr.length <= 1 || sum(arr) != 100) {
                isAllRight = false;
                strError += key_afgg + "的所有人至少包含两个，且共有份额之和必须为100";
            }
        }

    }

    return strError;
}

//检测申请人顺序号是否正确
function checkSXH(arr) {
    var strError = '';
    var isAllRight = true;
    if (arr.length == 0) {
        isAllRight = false;
    } else {
        if (arr.length == 1) {
            if (checkArrayNull(arr[0]) || !checkArrayInteger(parseInt(arr[0]))) {
                isAllRight = false;
                strError += "第1行、";
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (checkArrayNull(arr[i]) || !checkArrayInteger(parseInt(arr[i]))) {
                    isAllRight = false;
                    strError += "第" + (i + 1) + "行、";
                }
            }
        }
    }

    if (!isAllRight) {
        strError = strError.substring(0, strError.length - 1);
        strError += "顺序号为非正整数或空";
    } else {
        if (checkArrayUnique(arr)) {
            strError += "顺序号重复";
        }
    }
    return strError;
}


//给数组去重
Array.prototype.unique = function () {
    this.sort(); //先排序
    var res = [this[0]];
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== res[res.length - 1]) {
            res.push(this[i]);
        }
    }
    return res;
}

//计算数组之和
function sum(list) {
    return eval(list.join("+"));
}


//验证数组中是否包含重复数据
function checkArrayUnique(arr) {
    var isUnique = false;
    var initArrL = arr.length;
    if (arr.length > 1) {
        arr = arr.unique();
        if (arr.length != initArrL) {
            isUnique = true;
        }
    }

    return isUnique;
}

//验证数组中数据是否为中文
function checkArrayCh(str) {
    var isChinese = false;
    var chineseReg = /[\u4e00-\u9fa5]/; //检查中文的正则
    isChinese = chineseReg.test(str);
    return isChinese;
}

//验证数组中数据是否为空
function checkArrayNull(str) {
    var isNull = false;
    var emptyReg = /^\s*$/g; //验证是否为空
    isNull = emptyReg.test(str) || str == key_bjwb;
    return isNull;
}

//验证数组中数据是否为正整数
function checkArrayInteger(str) {
    var intReg = /[1-9]\d*/g;
    return intReg.test(str);
}

//验证数组中数据是否为0到100的两位小数
function checkArrayFloat(str) {
    var FloatReg = /(?!^0\.0?0$)^[0-9][0-9]?(\.[0-9]{1,2})?$/;
    return FloatReg.test(str);
}

/*----------------------------------------------------------------合同版SQRGRID验证相关---------end-------*/

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