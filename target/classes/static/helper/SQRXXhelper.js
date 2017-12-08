//����������grid
function showGrid(strLX) {
    var sWidth = ($(window).width() - 80) / 5;
    var strSQBH = $("#iptSQBH").val();
    var strUrl = "../DYA/RemoteHandle/DJXX.ashx";
    var isLC = strLX.indexOf("LC") > -1;
    if (!isLC) {
        strUrl += "?action=getSQRXX&sqbh=" + strSQBH + "&T=" + Math.random();
        if (strLX == "ZY") {
            strUrl += "&QLRLX=" + encodeURI("Ȩ����");
        }
    }
    $("#tbSQR").bootstrapTable({
        idField: "Id",
        width: ShowWidth(),
        queryParams: function (param) {
            return {};
        },
        url: strUrl,
        method: 'post', //����ʽ��*��
        contentType: "application/x-www-form-urlencoded",
        cache: true, //�Ƿ�ʹ�û��棬Ĭ��Ϊtrue������һ���������Ҫ����һ��������ԣ�*��
        sortable: false, //�Ƿ���������
        sortOrder: "asc", //����ʽ
        queryParamsType: "limit", //������ʽ,���ͱ�׼��RESTFul���͵Ĳ�������  
        sidePagination: "server", //��ҳ��ʽ��client�ͻ��˷�ҳ��server����˷�ҳ��*��
        strictSearch: true,
        ///  height: 200, //�иߣ����û������height���ԣ�����Զ����ݼ�¼�������ñ��߶�
        singleSelect: false,
        columns: [
                { checkbox: isLC,
                  visible: isLC
                },
                {
                    field: "XH",
                    title: "���",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        var strTemp = "<a href=\"#\" id='XH" + index + "'   data-type=\"select\" data-pk=\"" + index + "\" data-title=\"���\">" + value + "</a>";
                        return strTemp;
                    }

                },
                {
                    field: "SXH",
                    title: "˳���",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        var strTemp = "<a href=\"#\" id='SXH" + index + "'   data-value=''   data-type=\"text\"  data-pk=\"" + index + "\" data-title=\"˳���\">" + value + "</a>";
                        return strTemp;
                    }

                },
                {
                    field: "SQRNAME",
                    title: "����",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        var strTemp;
                        if (!isLC) {
                            strTemp = "<a href=\"#\" id='SQRNAME" + index + "'  data-value=''   data-type=\"text\" data-pk=\"" + index + "\" data-title=\"����\">" + tranCSDE(value) + "</a>";
                        } else {
                            strTemp = "<a href=\"#\" id='SQRNAME" + index + "'  data-value=''   data-type=\"text\" data-pk=\"" + index + "\" data-title=\"����\">" + value + "</a>";
                        }
                        return strTemp;
                    }

                }, {
                    field: "ZJLB",
                    title: "֤������",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        var strTemp = "<a href=\"#\" id='ZJLB" + index + "'   data-type=\"select\" data-pk=\"" + index + "\" data-title=\"֤������\">" + value + "</a>";
                        return strTemp;
                    }
                },
                {
                    field: "ZJHM",
                    align: 'center',
                    title: "֤������",
                    formatter: function (value, row, index, key) {
                        var strTemp;
                        if (!isLC) {
                           strTemp = "<a href=\"#\" id='ZJHM" + index + "'  data-value=''  data-type=\"text\" data-pk=\"" + index + "\" data-title=\"֤�����\">" + tranCSDE(value) + "</a>"
                        } else {
                           strTemp = "<a href=\"#\" id='ZJHM" + index + "'  data-value=''  data-type=\"text\" data-pk=\"" + index + "\" data-title=\"֤�����\">" + value + "</a>"
                        }
                        return strTemp;
                    }
                }, {
                    field: "GYFE",
                    align: 'center',
                    title: "���зݶ�",
                    formatter: function (value, row, index, key) {
                        var strTemp = "<a href=\"#\" id='GYFE" + index + "'  data-value=''  data-type=\"text\" data-pk=\"" + index + "\" data-title=\"���зݶ�\">" + value + "</a>";
                        return strTemp;
                    }
                }, {
                    field: "SQRLX",
                    title: "Ȩ��������",
                    align: 'center',
                    formatter: function (value, row, index, key) {
                        var strTemp = "<a href=\"#\" id='SQRLX" + index + "'    data-type=\"select\" data-pk=\"" + index + "\" data-title=\"Ȩ��������\">" + value + "</a>";
                        return strTemp;
                    },
                    visible: false

                }
            ], responseHandler: function (res) {
                return {
                    "total": res.total, //��ҳ��
                    "rows": res.rows   //����
                };

            },
        onLoadSuccess: function (data) {//���ݼ��سɹ��¼�
            //�޸�ʱ����ӹ�������
            m_index = m_index + parseInt($('#tbSQR').bootstrapTable('getOptions').totalRows);
            //����ʱ�޸� ��Ҫ���ÿɱ༭
            if ($("#iptCKLX").val() == "XG") {
                SetEditable();
            }

        }


    });

//    //ת�ƵǼ���Ҫ����Ȩ��������
//    if (strLX == "ZY") {
//        $('#tbSQR').bootstrapTable('hideColumn', 'SQRLX');
//    } 

    //����ť��ӵ���¼�
    $("#AddSQR").click(function () {
        AddRow();

    });
    //ɾ����
    $("#deleteSQR").click(function () {

        var $table = $('#tbSQR');
        var ids = $.map($table.bootstrapTable('getSelections'), function (row) {
            m_index = m_index - 1;
            return row.XH;
        });
        if (ids != "") {
            showmodal({
                content: "��ȷ���Ƿ�Ҫɾ��ѡ������ݣ�", //����ģ̬������
                SWidth: 250,
                fontSize: 18,
                Qclose: true,  //�������½ǹرհ�ť�Ƿ���ʾ��Ĭ��Ϊ�ر�
                callbackB: true,
                callbackBF: function () {
                    $table.bootstrapTable('remove', {
                        field: 'XH',
                        values: ids
                    });
                    //���¿ɱ༭
                    SetEditable();
                    return true;
                }
            });

        } else {
            showmodal({
                flag: "info",  //���õ���modal��״̬ success:�ɹ�����,warning:���洰��,info:��Ϣ����,default:Ĭ������ʽ
                title: "��ʾ��Ϣ",    //����ģ̬������
                content: "������ѡ��һ�����ݽ���ɾ����", //����ģ̬������
                SWidth: 350,
                fontSize: 18
            });

        }

    });
}

//�����
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
            SQRNAME: '�༭�ı�',
            ZJLB: '�༭�ı�',
            ZJHM: '�༭�ı�',
            SQRLX: '�༭�ı�',
            GYFE: '100',
            CZ: ''
        }
    });

    //���ÿɱ༭
    SetEditable();

}

//�������ݱ���
function SetValue() {

    var columns = new Array('XH', 'SXH', 'SQRNAME', 'ZJLB', 'ZJHM', 'GYFE', 'SQRLX', 'CZ');
    var sCount = m_index + 1;
    for (var r = 0; r < sCount; r++) {
        var row = {
            XH: '',
            SXH: '�༭�ı�',
            SQRNAME: '�༭�ı�',
            ZJLB: '�༭�ı�',
            ZJHM: '�༭�ı�',
            SQRLX: 'Ȩ����',
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

//����grid���
function ShowWidth() {
    var w = $(window).width();
    return w;
}

function SetEditable() {
    //����ȫ�ֵ�����
    $.fn.editable.defaults.mode = 'inline';
    //֤����������Դ
    var objDJZL = $("#iptZJZL").val();
    if (objDJZL != "") {
        objDJZL = window.eval('(' + objDJZL + ')');
    }
    var objQLRLX = $("#iptSQRLX").val();
    if (objQLRLX != "") {
        objQLRLX = window.eval('(' + objQLRLX + ')');
    }
    for (var i = 0; i <= m_index; i++) {
        //�༭˳���
        $("#SXH" + i).editable({
            type: "text",                //�༭������͡�֧��text|textarea|select|date|checklist��
            title: "˳���",              //�༭��ı���
            disabled: false,             //�Ƿ���ñ༭
            // emptytext: "�༭�ı�",          //��ֵ��Ĭ���ı�
            mode: "inline",              //�༭���ģʽ��֧��popup��inline����ģʽ��Ĭ����popup
            validate: function (value) { //�ֶ���֤
                if (!$.trim(value)) {
                    return '����Ϊ��';
                } else {
                    //��֤�Ƿ�����
                    if (isNaN(value)) {
                        value = "";
                        return '��������������';
                    }
                }
            },
            success: function (response, newValue) {
                //alert(newValue);
            },
            savenochange: true,
            onblur: "submit"

        });

        //�༭����
        $("#SQRNAME" + i).editable({
            type: "text",                //�༭������͡�֧��text|textarea|select|date|checklist��
            title: "����",              //�༭��ı���
            disabled: false,             //�Ƿ���ñ༭
            // emptytext: "�༭�ı�",          //��ֵ��Ĭ���ı�
            mode: "inline",              //�༭���ģʽ��֧��popup��inline����ģʽ��Ĭ����popup
            validate: function (value) { //�ֶ���֤
                if (!$.trim(value)) {
                    return '����Ϊ��';
                }
            },
            success: function (response, newValue) {
                //alert(newValue);
            },
            savenochange: true,
            onblur: "submit"

        });

        //�༭֤������
        $('#ZJLB' + i).editable({
            type: 'select',
            title: '֤������',
            placement: 'right',
            value: 99,
            source: objDJZL,
            savenochange: true,
            onblur: "submit"
        });

        //֤�����
        $("#ZJHM" + i).editable({
            type: "text",                //�༭������͡�֧��text|textarea|select|date|checklist��
            title: "֤�����",              //�༭��ı���
            disabled: false,             //�Ƿ���ñ༭
            //emptytext: "�༭�ı�",          //��ֵ��Ĭ���ı�
            mode: "inline",              //�༭���ģʽ��֧��popup��inline����ģʽ��Ĭ����popup
            validate: function (value) { //�ֶ���֤
                if (!$.trim(value)) {
                    return '����Ϊ��';
                }
            },
            savenochange: true,
            onblur: "submit"//����ƿ�ʱ�ύ�༭������
        });

        //�༭����������
        $('#SQRLX' + i).editable({
            type: 'select',
            title: '����������',
            placement: 'right',
            source: objQLRLX,
            savenochange: true,
            onblur: "submit"
        });

        //���зݶ�
        $("#GYFE" + i).editable({
            type: "text",                //�༭������͡�֧��text|textarea|select|date|checklist��
            title: "���зݶ�",              //�༭��ı���
            disabled: false,             //�Ƿ���ñ༭
            emptytext: 0,          //��ֵ��Ĭ���ı�
            mode: "inline",              //�༭���ģʽ��֧��popup��inline����ģʽ��Ĭ����popup
            validate: function (value) { //�ֶ���֤
                if (!$.trim(value)) {
                    return '����Ϊ��';
                } else {
                    //��֤�Ƿ�����
                    if (isNaN(value)) {
                        value = "";
                        return '��������������';
                    }
                }
            },
            savenochange: true,
            onblur: "submit"//����ƿ�ʱ�ύ�༭������
        });
    } //for

}


/*----------------------------------------------------------------��ͬ��SQRGRID��֤���---------start-------*/
function checkSQRXX(strCYFS) {
    var strTemp;
    //��ȡ��������Ϣ
    var jsonSQR = JSON.stringify($('#tbSQR').bootstrapTable('getData'));

    var objRes = eval('(' + jsonSQR + ')');
    if (objRes.length < 1) {
        strTemp = "����д��������Ϣ��";
        bDone = false;
    } else {
        var arrXM = new Array();
        var arrZJLB = new Array();
        var arrZJHM = new Array();
        var arrSQRLX = new Array();
        var arrGYFE = new Array();
        var arrSXH = new Array();
        //��֤���֤����
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
//�����������Ϣ��ȷ��
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

//��������������Ƿ���ȷ
function checkXM(arr) {
    var strError = '';
    var isAllRight = true;
    if (arr.length == 0) {
        isAllRight = false;
    } else {
        if (arr.length == 1) {
            if (checkArrayNull(arr[0])) {
                isAllRight = false;
                strError += "��1�С�";
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (checkArrayNull(arr[i])) {
                    isAllRight = false;
                    strError += "��" + (i + 1) + "�С�";
                }
            }
        }
    }

    if (!isAllRight) {
        strError = strError.substring(0, strError.length - 1);
        strError += "����������Ϊ��";
    } else {
        if (checkArrayUnique(arr)) {
            strError += "�����������ظ�";
        }
    }
    return strError;

}

//���������֤������Ƿ���ȷ
function checkZJLB(arr) {
    var strError = '';
    var isAllRight = true;
    if (arr.length == 0) {
        isAllRight = false;
    } else {
        if (arr.length == 1 && checkArrayNull(arr[0])) {
            isAllRight = false;
            strError += "��1�С�";
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (checkArrayNull(arr[i])) {
                    isAllRight = false;
                    strError += "��" + (i + 1) + "�С�";
                }
            }
        }
    }

    if (!isAllRight) {
        strError = strError.substring(0, strError.length - 1);
        strError += "֤�����Ϊ��";
    }
    return strError;

}

//���������֤�������Ƿ���ȷ
function checkZJHM(arrZJLB, arrZJHM) {
    var strError = '';
    var isAllRight = true;
    if (arrZJHM.length == 0) {
        isAllRight = false;
    } else {
        if (arrZJHM.length == 1) {
            if (checkArrayNull(arrZJHM[0])) {
                isAllRight = false;
                strError += "��1�С�";
            } else {
                if (arrZJLB[0] == key_sfz && !CheckCardId(arrZJHM[0])) {
                    isAllRight = false;
                    strError += "��1�С�";
                }
            }
        } else {
            for (var i = 0; i < arrZJHM.length; i++) {
                if (checkArrayNull(arrZJHM[i])) {
                    isAllRight = false;
                    strError += "��" + (i + 1) + "�С�";
                } else {
                    if (arrZJLB[i] == key_sfz && !CheckCardId(arrZJHM[i])) {
                        isAllRight = false;
                        strError += "��" + (i + 1) + "�С�";
                    }
                }
            }
        }
    }

    if (!isAllRight) {
        strError = strError.substring(0, strError.length - 1);
        strError += "֤������Ϊ�ջ��߸�ʽ����ȷ";
    } else {
        if (checkArrayUnique(arrZJHM)) {
            strError += "֤�������ظ�";
        }
    }
    return strError;
}

//��������˹��зݶ��Ƿ���ȷ
function checkGYFE(arr, strCYFS) {
    var strError = '';
    var isAllRight = true;
    if (arr.length == 0) {
        isAllRight = false;
    } else {
        if (arr.length == 1) {
            if (checkArrayNull(arr[0])) {
                isAllRight = false;
                strError += "��1�С�";
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (checkArrayNull(arr[i]) || arr[i] <= 0) {
                    isAllRight = false;
                    strError += "��" + (i + 1) + "�С�";
                }
            }
        }
    }


    if (!isAllRight) {
        strError = strError.substring(0, strError.length - 1);
        strError += "���зݶ�Ϊ��";
    } else {
        if (strCYFS == key_ddsy) {
            if (arr.length != 1 || sum(arr) != 100) {
                isAllRight = false;
                strError += key_ddsy + "�������˱���Ϊһ�����ҹ��зݶ����Ϊ100";
            }
        } else if (strCYFS == key_gggy) {
            if (arr.length <= 1) {
                isAllRight = false;
                strError += key_gggy + "�����������ٰ�������";
            }
        } else if (strCYFS == key_afgg) {
            if (arr.length <= 1 || sum(arr) != 100) {
                isAllRight = false;
                strError += key_afgg + "�����������ٰ����������ҹ��зݶ�֮�ͱ���Ϊ100";
            }
        }

    }

    return strError;
}

//���������˳����Ƿ���ȷ
function checkSXH(arr) {
    var strError = '';
    var isAllRight = true;
    if (arr.length == 0) {
        isAllRight = false;
    } else {
        if (arr.length == 1) {
            if (checkArrayNull(arr[0]) || !checkArrayInteger(parseInt(arr[0]))) {
                isAllRight = false;
                strError += "��1�С�";
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (checkArrayNull(arr[i]) || !checkArrayInteger(parseInt(arr[i]))) {
                    isAllRight = false;
                    strError += "��" + (i + 1) + "�С�";
                }
            }
        }
    }

    if (!isAllRight) {
        strError = strError.substring(0, strError.length - 1);
        strError += "˳���Ϊ�����������";
    } else {
        if (checkArrayUnique(arr)) {
            strError += "˳����ظ�";
        }
    }
    return strError;
}


//������ȥ��
Array.prototype.unique = function () {
    this.sort(); //������
    var res = [this[0]];
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== res[res.length - 1]) {
            res.push(this[i]);
        }
    }
    return res;
}

//��������֮��
function sum(list) {
    return eval(list.join("+"));
}


//��֤�������Ƿ�����ظ�����
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

//��֤�����������Ƿ�Ϊ����
function checkArrayCh(str) {
    var isChinese = false;
    var chineseReg = /[\u4e00-\u9fa5]/; //������ĵ�����
    isChinese = chineseReg.test(str);
    return isChinese;
}

//��֤�����������Ƿ�Ϊ��
function checkArrayNull(str) {
    var isNull = false;
    var emptyReg = /^\s*$/g; //��֤�Ƿ�Ϊ��
    isNull = emptyReg.test(str) || str == key_bjwb;
    return isNull;
}

//��֤�����������Ƿ�Ϊ������
function checkArrayInteger(str) {
    var intReg = /[1-9]\d*/g;
    return intReg.test(str);
}

//��֤�����������Ƿ�Ϊ0��100����λС��
function checkArrayFloat(str) {
    var FloatReg = /(?!^0\.0?0$)^[0-9][0-9]?(\.[0-9]{1,2})?$/;
    return FloatReg.test(str);
}

/*----------------------------------------------------------------��ͬ��SQRGRID��֤���---------end-------*/

/*----------------------------------------------------------------��ѡ---------start-------*/
//�����������
function tranCSDE(str) {
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    str = xt.xxtea_decrypt(str);
    return str;
}

//�����������
function tranCSEN(str) {
    var sth = $("#iptSth").val();
    var xt = new Xxtea(sth);
    str = xt.xxtea_encrypt(str);
    return str;
}

/*----------------------------------------------------------------��ѡ---------end-------*/