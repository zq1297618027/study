var back_state, next_state, all_state, normal_state, ajax_state;
back_state = "back"; //上一步提交判断类别名称
next_state = "next"; //下一步提交判断类别名称
all_state = "all";
normal_state = "normalGo";//正常跳转
ajax_state = "ajaxGo"; //异步请求跳转
/*流程原始逻辑请勿修改 ------------------------------------------------------------------begin*/
//绑定流程步骤条，绑定相关流程逻辑
function initFlow() {
    $("#btnBack,#btnTJ").prop("disabled",true);
    //传入rgb类型的颜色值
    var count=$(".flow .flowListBox .flowList").length;
    fixWidth(count);
    var qr_text = "确认"; //确认按钮文本
    var qx_text = "取消"; //取消按钮文本
    setFlowData("qr_text", qr_text, false);
    setFlowData("qx_text", qx_text, false);
    checkColor("");
    ReFlowHeight();
    checkBtn();
    removeFlowData('data');
    setFlowData('findex', 1, false);
    setFlowData('fcount', count, false);
}
//页面重新加载的时候计算iframe高度
$(window).resize(function () {
    ReFlowHeight();
});
//重新加载界面计算相关高度
function ReFlowHeight() {
    var bodyH = $(document.body).parent().height() - 170;
    $("#iList").height(bodyH);
}
//页面跳转行为
function methodBtn(index, method, end, goType) {
    /*
    *@parameter bool goType  判断是通过modal按钮进行跳转
    */
    var fFor;
    var url;
    if (!end) {
        if (method == back_state) {
            if (index == 1) {
                fFor = ".for" + String.fromCharCode(index + 65);
            } else {
                fFor = ".for" + String.fromCharCode(index + 64);
            }
            $(fFor).removeClass("for-cur");
            url = "../Model/"+$(".for" + String.fromCharCode(index + 63)).children("strong").attr("id") + '?flowType=' + $("#iptFlowType").val() + '&new=' + Math.random();
            window.iframeSelf.location.replace(url);
            checkColor("default");
        } else if (method == next_state) {
            $("#btnTJ").prop("disabled",true);
            fFor = ".for" + String.fromCharCode(index + 65);
            url = GREI.ApplicationPath + "Model/" + $(fFor).children("strong").attr("id") + '?flowType=' + $("#iptFlowType").val() + '&new=' + Math.random();
            window.iframeSelf.location.replace(url);
            $(fFor).addClass("for-cur");
            checkColor("");
           
        }
    } else if (end) {
        //timer(5);
    }

}

//给流程绑定颜色和移除样式
function checkColor(color) {
    if (color != "default") {
        $(".flowList.for-cur").css({ "border": "2px solid rgb(50, 138, 201)","text-align": "right" });
        $(".flowList.for-cur,.flowListBox .for-cur em").css({ "background-color": "rgb(50, 138, 201)" });
        $(".flowListBox .for-cur em").css({ "border": "0px none #000","box-shadow": "0 0 5px 2px rgba(50, 138, 201, 0.56)" });
        $(".flowListBox .for-cur em").removeClass("glyphicon-time").addClass("glyphicon-ok");
        $(".flowListBox .for-cur strong,.successs h3").css({ "text-align": "right", "color": "rgb(50, 138, 201)" });
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
function checkBtn() {
    $("#btnTJ").click(function () {
        //将上一页面的返回传给下一个页面
        iframeSelf.window.onFlowBtnClick("next");
    });
    $("#btnBack").click(function () {
        iframeSelf.window.onFlowBtnClick("back"); 
    });
}

//确认流程是否到达第一步或者最后一步
function checkFlowBtn(index,count){
    if (index != 1) {
        if ($("#btnTJ").html() != "下一步") {
            $("#btnTJ").html("下一步");
            $("#btnBack").html("上一步");
        }
        $("#btnBack").prop("disabled",false);
    } else if (index == 1) {
        $("#btnTJ").html("我同意");
        $("#btnBack").html("我不同意");
        $("#btnBack").prop("disabled",true);
        removeFlowData('data');
    }
    if (index >= count){
        $("#btnBack,#btnTJ").addClass("disabled hidden").prop('disabled', true);

        var tempData = ['findex', 'fcount', 'flowType', 'qr_text', 'qx_text'];
        removeFlowData(tempData);

    }
}

/*流程原始逻辑请勿修改 ------------------------------------------------------------------end*/


//流程子页面可以调用此方法控制上下步按钮状态
function setFlowBtnState(type,state) {
/*
*@parameter string type 判断是绑定什么，可以接受next（对应下一步按钮）和back（对应上一步按钮），all两个按钮都控制
*@parameter bool state 是放开还是禁用按钮，true即放开，false即禁用。
*/
    if($("#btnTJ").length<=0){
        showmodal({
            flag: "warning",
            title: "提示信息",
            content: "请在流程相关页面调用该方法！"
        }); 
        return ;   
    }else if(typeof(state)!="boolean"){
        showmodal({
            flag: "warning",
            title: "提示信息",
            content: "设置按钮状态的参数只能为boolean类型！"
        }); 
         return ;
     } else if (type != next_state && type != back_state && type != all_state) {
        showmodal({
            flag: "warning",
            title: "提示信息",
            content: "目前只支持控制上下步按钮状态控制，参数传递错误！"
        });  
         return ;           
    }

    if($("#btnTJ").length>0){
        if (type == all_state) {
            if (state) {
                $("#btnBack,#btnTJ").prop("disabled", false);
            } else {

                $("#btnBack,#btnTJ").prop("disabled", true);
            }
        } else if (type == back_state) {
            if(state){
                $("#btnBack").prop("disabled",false);
            }else{

                $("#btnBack").prop("disabled",true);
            }
        } else if (type == next_state) {
            if(state){
                $("#btnTJ").prop("disabled",false);
            }else{

                $("#btnTJ").prop("disabled",true);
            }        
        }
        
    }
}

//流程子页面可以调用此方法设置相关弹窗事件
function showFlowModal(type, title, content, isAlert) {
/*
*@parameter string type 判断需要使用的弹窗情况，可以接受三种参数形式，
                        “error”结合content实参，进行相关错误提示
                        “confirm”结合content实参和afterFlowModal()绑定确认按钮事件，进行相关确认提示
*@parameter string title 写入需要错误提示和确认提示标题，默认文本是“提示信息”
*@parameter string content 写入需要错误提示和确认提示内容，默认文本是type类型
*@parameter string isAlert 是否是警告弹窗，这个是协助“confirm”弹窗的，辅助参数，设置为true，则只有一个确定按钮，并且执行对应的回调事件
*/

    if(title==""){
        title="提示信息";
    }
    if(content==""){
        content=type;
    }
    if(type=="error"){
        showmodal({
            flag: "info",
            title: title,
            content: content,
            fontSize: 18,
            hideClick: 'static',
            isMain:true
        });
    } else if (type == "confirm") {
        isAlert = isAlert || false;
        showmodal({
            flag: "info",
            title: title,
            content: content,
            Qclose: !isAlert,
            hideClick: 'static',
            callbackB: true,
            fontSize: 18,
            isMain: true,
            BcloseText: getFlowData("qr_text", false),
            QcloseText: getFlowData("qx_text", false),
            callbackBF: function () {
                //dosomething
                var tempData = iframeSelf.window.afterFlowModal();
                isAlert = isAlert || ""
                if (typeof (tempData) != "boolean") {
                    return true;
                } else {
                    return tempData;
                }
            
            }
        });
    }

}


//流程子页面可以调用此方法关闭弹窗事件
function closeFlowModal(modalIndex) {
/*
*@parameter int modalIndex 需要关闭弹窗的modalIndex，默认为01
*/
    if (modalIndex == "") {
        modalIndex = 1;
    }
    $("#showModal0" + modalIndex + " .modal-dialog div:nth-child(1) #Tclose").click();
}
//流程子页面可以调用此方法设置相关参数
function setFlowData(key,data,json) {
/*
*@parameter string key 存数据的名称
*@parameter string data 存的数据内容，如果是取数据，该项可以为空
*@parameter bool json 存的数据类型，如果为true，则传入的数据是json类型，
                      函数会做对应数据存和取处理
*/
    if(key!=""&&data!=""){
        if(json){       
            data=JSON.stringify(data);
        }
        window.localStorage.setItem(key, data);
        return true;
    }else{
            showmodal({
            flag: "info",
            title: "警告",
            content: "setFlowData参数传递错误",
            hideClick:'static'
        });
        return false;      
    }
    
    
}

//流程子页面可以调用此方法读取相关参数
function getFlowData(key, json) {
/*
*@parameter string key 读数据的名称
*@parameter bool json 存的数据类型，如果为true，则传入的数据是json类型，
函数会做对应数据存和取处理
*/
    var savaCheck = typeof (window.localStorage.getItem(key)) != "string";
        if (key != "" && !savaCheck) {
            if (json) {
                var data = window.localStorage.getItem(key);
                savaCheck = JSON.parse(data);
            } else {
                savaCheck = window.localStorage.getItem(key);
            }
        } else {
            showmodal({
                flag: "info",
                title: "警告",
                content: "getFlowData参数传递错误",
                hideClick: 'static'
            });
        }
    return savaCheck;
}

//流程子页面可以调用此方法删除相关参数
function removeFlowData(keys) {
/*
*@parameter Array or string key 已经存在的key值名称数组集合,或者单个key值名称
*/
    if (keys.length != "") {
        if (typeof (keys) == "string") {
            var savaCheck = typeof (window.localStorage.getItem(keys)) != "string";
            if (!savaCheck) {
                //console.log("removeKey" + keys);
                window.localStorage.removeItem(keys);
            }

        } else if (typeof (keys) == "object") {
            for (var i = 0; i < keys.length; i++) {
                var savaCheck = typeof (window.localStorage.getItem(keys[i])) != "string";
                if (!savaCheck) {
                    //console.log("removeKey" + keys[i]);
                    window.localStorage.removeItem(keys[i]);
                }
            }
        }

    } else {
        showmodal({
            flag: "info",
            title: "警告",
            content: "removeFlowData参数传递错误",
            hideClick: 'static'
        });
    }
}




//流程子页面可以调用此方法保证按钮事件正常执行
function flowGo(type) {
/*
*@parameter string type 判断是下一步事件还是上一步事件，可以接受两种参数形式，
 “normalGo”正常前进，“otherGo”存在两种情况的备选前进跳转，“back”后退
 */
    var f_index = getFlowData('findex', false);

    var _this=$(".flow .flowListBox .for-cur").length;
    f_index = (f_index>_this)?f_index:_this;
    var f_count = getFlowData('fcount', false);
    if (type == next_state) {
        methodBtn(f_index++, type, false,"");
        setFlowData('findex', f_index, false);
        checkFlowBtn(f_index,f_count);

    } else if (type == normal_state) {
        methodBtn(f_index++, next_state, false, false);
        setFlowData('findex', f_index, false);
        checkFlowBtn(f_index, f_count);

    } else if (type == ajax_state) {
        methodBtn(f_index++, next_state, false, true);
        setFlowData('findex', f_index, false);
        checkFlowBtn(f_index, f_count);

    } else if (type == back_state) {
        methodBtn(f_index--, type, false, "");
        setFlowData('findex', f_index, false);
        checkFlowBtn(f_index,f_count);

    } else {
        showmodal({
            flag: "info",
            title: "警告",
            content: "flowGo参数传递错误",
            hideClick:'static'
        });
    }
}


//流程子页面可以调用此方法修改上下步按钮的文本内容
function changeFlowBtn(type,text) {
/*
*@parameter string type 判断是下一步按钮还是上一步按钮，可以接受两种参数形式，
                        “next”前进，“back”后退
*@parameter string text 需要修改的按钮文本内容
*/
        if(text!=""){
            if (type == next_state) {
               $("#btnTJ").html(text);

           } else if (type == back_state) {
                $("#btnBack").html(text);
            }
        }else{
             showmodal({
                flag: "info",
                title: "警告",
                content: "changeFlowBtn参数传递错误",
                hideClick:'static'
            });
        }
}

//流程子页面可以调用此方法判读父级页面网址是否包含某段文本内容
function checkHref(type,text) {
/*
*@parameter string type 如果为"parent"则判断当前主要流程框架地址中是否包含某段文本
                        如果为"parents"则判断当前主要流程框架的父级地址中是否包含某段文本
                        如果为"iframe"则判断当前子步骤地址中是否包含某段文本
                        默认为"parents"
*@parameter string text 提供需要判断的文本内容
目前主要应用场景判断当前主流程页面的父级是main页面还是default页面，欢迎后期扩充
*/
    
    var tempStr;
    if(type=="parent"){
        tempStr =window.location.href;
    }else if(type=="parents"){
        tempStr =parent.location.href;    
    }else if(type=="iframe"){
        tempStr =iframeSelf.location.href;    
    }else if(type==""){
        tempStr =parent.location.href;    
    }else{
        showmodal({
            flag: "info",
            title: "警告",
            content: "checkParent参数传递错误",
            hideClick:'static'
        });   
    }
    //console.log(tempStr);
    if(tempStr.indexOf(text)>-1){
        return true;
    }else{
        return false;
    }
}



/*子页面必须要写的方法*/
/*
onFlowBtnClick(type)
*@parameter string type 判断是下一步按钮还是上一步按钮，可以接受两种参数形式，
                        “next”流程下一步按钮会自动绑定的事件，
					    “back” 流程上一步按钮会自动绑定的事件

*/
/*子页面可以选择写的方法*/
/*
afterFlowModal()
 结合window.parent.showFlowmodal("confirm","提示标题", "提示内容");  确认弹窗 有取消键
 或者 结合window.parent.showFlowmodal("confirm","提示标题", "提示内容",true);  警告弹窗  没有取消键
 流程弹窗需要confirm时点击确认的回调函数，请注意一定要写返回值，
 返回值为true or false，为true的时候，点击确定事件执行之后，就关闭模态窗，
 为false的时候，即存在异步回调函数的时候，点击确定事件执行之后，不会关闭模态窗。


 如果页面存在多个showFlowmodal 需要有回调事件   请在afterFlowModal()中自行判断 
*/