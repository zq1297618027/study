/***************************************************************************************
*                              市场交易公共脚本函数                                    *
****************************************************************************************/
var m_sDicName = "";
var m_bTree = "";
var m_sValueIndex = "";

//加载字典信息
//dicName  字典名称
//bTree  是否为自定义树结构
//valueIndex  自定义树时要显示的字段索引【1-10】
//inputName  接收返回值的控件id
var GetZDXX = function (dicName, bTree, valueIndex, inputID) {
    m_sDicName = dicName;
    m_bTree = bTree;
    m_sValueIndex = valueIndex;

    var sRes = "";
    var bDone = false;
    var sContent = "";
    //通用字典
    if (!bTree) {
        sContent = '<div class="container" style="margin-top:-20px">' +
                   '    <table id="tb_ZDXX" style=""></table>' +
                   '</div>';
    } else {
        //自定义树结构
        sContent = '<div class="container" style="margin-top:-20px">' +
                   '    <table class="tree table" id="tb_ZDXX" style="text-align:left"></table>' +
                   '</div>';
    }
    
    showmodal({
        flag: "info",
        content: sContent,  //内容
        title: "选择" + dicName,       //设置模态窗标题
        Bclose: true,       //设置右下角关闭按钮是否显示，默认为显示
        Qclose: true,       //设置右下角确定按钮是否显示，默认为显示
        Sheight: 320,       //设置模态窗高度，默认为auto
        SWidth: 600,        //设置模态窗宽度，默认为auto
        fontSize: "15",
        callbackB: true,
        callbackBF: function () {
           sRes = GetYXX();
           $("#" + inputID).val(sRes);
           var ss = $("#" + inputID).val();
           this.closeModal();
        }
    })

    if(!bTree){
        LoadTable();
    }else{
        LoadTree();
    }    
}

//加载数据
function LoadTable() { 
    var url = GREI.ApplicationPath + "Model/SCJY/RemoteHandle/CommonHandler.ashx?T=" + Math.random();
    $('#tb_ZDXX').bootstrapTable({
        url: url,
        method: 'get', //请求方式（*）
        contentType: "application/x-www-form-urlencoded",
        toolbar: '#toolbar', //工具按钮用哪个容器
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: false, //是否显示分页（*）
        sortable: false, //是否启用排序
        queryParams: queryParams, //参数  
        minimumCountColumns: 2, //最少允许的列数
        clickToSelect: true, //是否启用点击选中行
        idField: "ITEMID", //每一行的唯一标识，一般为主键列
        ingleSelect: false,
        columns: [
        { checkbox: true,
            field: 'XZ',
            title: '选择'
        },
        { field: 'XH',
            title: '序号',
            align: 'center',
        },
        { field: 'ITEMNAME',
            title: '名称',
            align: 'center'
        },
        { field: 'ITEMVAL',
            title: '值',
            align: 'center'
        },
        { field: 'ITEMNOTE',
            title: '描述',
            align: 'center',
            visible:false
        },
        { field: 'ITEMID',
            title: 'ID',
            align: 'center',
            visible:false
        }
        ]
    });
}

//参数
function queryParams() {  //配置参数  
    var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的  
        DICNAME: m_sDicName,
        action: "LoadItem"
    };
    return temp;
}

function LoadTree() {
    $.ajax({
        type: "POST",
        url: GREI.ApplicationPath + "Model/SCJY/RemoteHandle/CommonHandler.ashx?T=" + Math.random(),
        dataType: 'text',
        data: {
            action: 'LoadUSRDEF',
            ValueIndex: m_sValueIndex,
            DICNAME: m_sDicName
        },
        async: false,
        success: function (res) {
            if (res != "") {
                $('.tree').append(res);
            }
        }
    })

    $('.tree').treegrid({
        treeColumn: 0,
        initialState: 'expanded'
    });
}

//选中check
function tdCheck(obj) {
    var Check = $(obj).val();
    if ($(obj).is(':checked')) {
        //gxXXChecked(obj,true);
        $(obj).parent().addClass("checked");
    }
    else {
        //gxXXChecked(obj,false);
        $(obj).parent().removeClass("checked");
    }
}

//递归向下勾选
function gxXXChecked(obj,bCheck) {
    var Check = $(obj).val();
    var sXZQ = "treegrid-parent-" + Check;
    if ($("." + sXZQ).length > 0) {
        $("." + sXZQ).each(function () {
            var sCZName = $(this).find("input[type=checkbox]");
            gxXXChecked(sCZName, bCheck);
        });
    }
    $(obj).prop("checked", bCheck);
    if(bCheck){
        $(obj).parent().addClass("checked");
    }else{
        $(obj).parent().removeClass("checked");
    }
}
                    
//获取已选项
function GetYXX(){
    var sRes = "";
    var name = "", value = "";
    if(!m_bTree){
        var $table = $("#tb_ZDXX");
        var row = $.map($table.bootstrapTable('getSelections'), function (row) {
            name += row.ITEMNAME + ",";
            value += row.ITEMVAL + ",";
        });
        if(name != "" && value != ""){
            name = name.substr(0,name.length-1);
            value = value.substr(0,value.length-1);
            sRes += '{"' + name + '":"' + value + '"}';
        }
    }else{
        $("#tb_ZDXX").find("tr").each(function(){
            var tdArr = $(this).children();
            if(tdArr.eq(0).hasClass("checked")){
                name += tdArr.eq(1).text() + ",";
                value += tdArr.eq(2).text() + ",";
            }
        })
        if(name != "" && value != ""){
            name = name.substr(0,name.length-1);
            value = value.substr(0,value.length-1);
            sRes += '{"' + name + '":"' + value + '"}';
        }
    }
    return sRes;
}

//加载审批详情
//sSLBH  受理编号
function LoadSPXQ(sSLBH) {
    var sContent = '<div class="container" >' +
                   '    <table id="SPXXGrid"></table>' +
                   '</div>';
    showmodal({
        flag: "info",
        content: sContent,  //内容
        title: "审批详情",       //设置模态窗标题
        Bclose: true,       //设置右下角关闭按钮是否显示，默认为显示
        Qclose: true,       //设置右下角确定按钮是否显示，默认为显示
        Sheight: 320,       //设置模态窗高度，默认为auto
        SWidth: 600,        //设置模态窗宽度，默认为auto
        fontSize: "15",
        callbackB: true,
        callbackBF: function () {
           this.closeModal();
        }
    })   
    GetSPXX(sSLBH);
}

//得到审批信息
function GetSPXX(sSLBH) { 
    var strURL = GREI.ApplicationPath + "Model/SCJY/RemoteHandle/CommonHandler.ashx?T=" + Math.random();
    $('#SPXXGrid').bootstrapTable({
        url: strURL,
        method: 'get', //请求方式（*）
        contentType: "application/x-www-form-urlencoded",
        //toolbar: '#toolbar', //工具按钮用哪个容器
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: false, //是否显示分页（*）
        sortable: false, //是否启用排序
        sortOrder: "asc", //排序方式
        queryParams: querySPParams(sSLBH), //参数  
        queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求  
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1, //初始化加载第一页，默认第一页
        pageSize: 20, //每页的记录行数（*）
        pageList: [20, 50, 100], //可供选择的每页的行数（*）
        search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        showColumns: false, //是否显示所有的列
        showRefresh: false, //是否显示刷新按钮
        showHeader: true,  //是否显示表头
        minimumCountColumns: 2, //最少允许的列数
        clickToSelect: true, //是否启用点击选中行
        uniqueId: "SPBH", //每一行的唯一标识，一般为主键列
        showToggle: false, //是否显示详细视图和列表视图的切换按钮
        cardView: false, //是否显示详细视图
        detailView: false, //是否显示父子表
        singleSelect: false,
        onClickRow: function (row, $element) {
        },
        columns: [{
            field: 'SPXQ',
            title: '审批意见详情',
            halign: 'center',
        }, {
            field: 'SPBH',
            title: '审批编号',
            align: 'center',
            visible: false
        }, {
            field: 'SPR',
            title: '审批人',
            align: 'center',
            visible: false
        }, {
            field: 'SPDX',
            title: '审批对象',
            align: 'center',
            visible: false
        }, {
            field: 'SPYJ',
            title: '审批意见',
            align: 'center',
            visible: false
        }, {
            field: 'SPRQ',
            title: '审批日期',
            align: 'center',
            visible: false
        }, {
            field: 'SPRZGZH',
            title: '审批人资格证号',
            align: 'center',
            visible: false
        }], responseHandler: function (res) {  
            var sData = res.rows;
            for (var i = 0; i < sData.length; i++) {
                var sSPR = sData[i].SPR;
                var sSPDX = sData[i].SPDX;
                var sSPYJ = sData[i].SPYJ;
                var sSPRQ = sData[i].SPRQ;
                var sSPJG = sData[i].SPJG;
                var sSPXQ = "<span style='text-align:left;display: block;'>" + sSPR + "(" + sSPDX + "):";
                if (sSPJG == "原意见") {
                    sSPXQ = "<span style='text-align:left;display: block;'>" +sSPR + "(" + sSPDX + "-原意见):";
                }
                sSPXQ += "<br/>";
                sSPXQ += sSPYJ;
                sSPXQ += "<br/></span><span style='text-align:right;display: block;'>";
                sSPXQ += sSPRQ;
                sSPXQ += "</span>";
                sData[i].SPXQ = sSPXQ;
            }
            return {
                "total": res.total,  //总条数  
                "rows": res.rows   //数据
            };
        }, onLoadSuccess: function (data) {//数据加载成功事件
            //设置默认值
        }
    });
}

//参数
function querySPParams(sSLBH) {  //配置参数  
    var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的  
        SLBH: sSLBH,
        action: "GetSPXX"
    };
    return temp;
}

////克隆Map 
var Map = function () {
    /** 存放键的数组(遍历用到) */
    this.keys = new Array();
    /** 存放数据 */
    this.data = new Object();
    /**  
    * 放入一个键值对  
    * @param {String} key  
    * @param {Object} value  
    */
    this.set = function (key, value) {
        if (this.data[key] == null) {
            this.keys.push(key);
        }
        this.data[key] = value;
    };

    /**  
    * 获取某键对应的值  
    * @param {String} key  
    * @return {Object} value  
    */
    this.get = function (key) {
        return this.data[key];
    };

    /**  
    * 删除一个键值对  
    * @param {String} key  
    */
    this.delete = function (key) {
        var index = this._getIndex(key);
        if (index != -1) {
            this.keys.splice(index, 1);
            this.data[key] = null;
        }
    };

    this._getIndex = function (key) {
        if (key == null || key == undefined) {
            return -1;
        }
        var _length = this.keys.length;
        for (var i = 0; i < _length; i++) {
            var entry = this.keys[i];
            if (entry == null || entry == undefined) {
                continue;
            }
            if (entry === key) {//equal 
                return i;
            }
        }
        return -1;
    };


    /**  
    * 遍历Map,执行处理函数  
    *   
    * @param {Function} 回调函数 function(key,value,index){..}  
    */
    this.forEach = function (fn) {
        if (typeof fn != 'function') {
            return;
        }
        var len = this.keys.length;
        for (var i = 0; i < len; i++) {
            var k = this.keys[i];
            fn(k, this.data[k], i);
        }
    };

    /**  
    * 获取键值数组(类似Java的entrySet())  
    * @return 键值对象{key,value}的数组  
    */
    this.entrys = function () {
        var len = this.keys.length;
        var entrys = new Array(len);
        for (var i = 0; i < len; i++) {
            entrys[i] = {
                key: this.keys[i],
                value: this.data[i]
            };
        }
        return entrys;
    };

    /**  
    * 判断Map是否为空  
    */
    this.isEmpty = function () {
        return this.keys.length == 0;
    };

    /**  
    * 获取键值对数量  
    */
    this.size = function () {
        return this.keys.length;
    };

    /**  
    * 重写toString   
    */
    this.toString = function () {
        var s = "{";
        for (var i = 0; i < this.keys.length; i++, s += ',') {
            var k = this.keys[i];
            s += k + "=" + this.data[k];
        }
        s += "}";
        return s;
    };
}

//克隆附件
function GetCloneFJ(ParamFJ) {
    if(ParamFJ != ""){
        var sFJInfo = eval("(" + ParamFJ + ")");    
        $.ajax({
            type: 'post',
            url: GREI.ApplicationPath + "Model/FJGL/RemoteHandle/AttachmentHandler.ashx?T=" + Math.random(),
            dataType: 'text',
            data: { action: "CopyAttach", ParentNode: sFJInfo.ParentNode, ParentType: sFJInfo.ParentType, YParentNode: sFJInfo.YParentNode, CIds: sFJInfo.CIds },
            success: function (oRet) {
            },
            error: function () { }
        });
    }
}