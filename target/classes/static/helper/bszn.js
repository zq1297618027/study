var zdData;
function loadFiles() {
    var zTree;
    var demoIframe;
    var treeNodes;
    var url = "../../Model/BSZN/BSZN.aspx?Action=GetData";

    $.ajax({
        url: url,
        cache: false,
        error: function (e) {
            alert("服务器忙或操作过于频繁！");
        },
        success: function (data) {
           
            treeNodes = eval('(' + data + ')');
            var strVar = "";
            for (var i in treeNodes) {
                if (treeNodes[i].open == true) {
                    treeNodes[i].url = "\"" + treeNodes[i].url + "\"";
                } else if (treeNodes[i].open == false) {
                    treeNodes[i].url = "\"" + "html/" + treeNodes[i].url + "\"";
                    strVar += "	<li><a class='glyphicon glyphicon-book'>" + " "+treeNodes[i].title + "</a></li>\n";
                }
            }
            $("#zLL").html(strVar);
            ZLDOC();
        }
    });       

}

function ZLDOC() {
    var zLDiv = $("#zLL");
    var zLDivs = zLDiv.children("li");
    var n = 0;
    var tDoc, ext, sDoc;
    var thisURL = document.URL;
    zLDivs.each(function () {
        var $this = $(this);
        $this.click(function () {
            tDoc = "../../Doc/" + $.trim($this.children("a").html()) + ".htm";
            $("#docSrc").attr("src", tDoc);
            $(this).siblings().css({ "background-color": "#fff" }).children().css({ "color": "#428bca"});
            $(this).css({ "background-color": "#5bc0de"}).children().css({ "color": "#fff"});
        });
        n++;
    });
    open_doc_win($.trim(zLDivs.children("a").eq(0).html()));
}
//打开对应的doc
function open_doc_win(tDoc) {
    tDoc = "../../Doc/" + tDoc + ".htm";
    $("#docSrc").attr("src", tDoc);
}

//加载字典列表
function loadZDLists() {
    var strList;
    var url = "../../Model/BSZN/BSZN.ashx?Action=GetZDData";

    $.ajax({
        url: url,
        cache: false,
        error: function (e) {
            alert("服务器忙或操作过于频繁！");
        },
        success: function (data) {

            strList = eval('(' + data + ')');
            var strVar = "";
            if (strList.success != "false") {
                zdData = eval(strList.data);
                for (var i in zdData) {
                    strVar += "	<li><a class='glyphicon glyphicon-book'>" + " " + zdData[i].BT + "</a></li>\n";
                }
            } else {
                strVar = strList.data;
            }

            if (strVar.indexOf("<li>") > -1) {
                $("#zLL").html(strVar);
                ZLData();
            } else {
                $(".zAList.row").html("<h1 class='text-center text-info text-error'>" + strVar + "</h1>");
            }
            checkLayout();
        }
    });

}

//绑定字典列表点击动画
function ZLData() {
    var zLDiv = $("#zLL");
    var zLDivs = zLDiv.children("li");
    var n = 0;
    var stitle;
    zLDivs.each(function () {
        var $this = $(this);
        $this.click(function () {
            stitle = $.trim($this.children("a").html());
            open_list_win(stitle);
            $(this).siblings().css({ "background-color": "#fff" }).children().css({ "color": "#428bca" });
            $(this).css({ "background-color": "#5bc0de" }).children().css({ "color": "#fff" });
        });
        n++;
    });
    open_list_win($.trim(zLDivs.children("a").eq(0).html()));
}

//打开字典标题对应的内容
function open_list_win(title) {
    for (var i = 0; i < zdData.length; i++) {
        if (zdData[i].BT ==title) {
            $("#ZDNR").html(zdData[i].NR);
        }
    }
        
}

//检查页面布局
function checkLayout() {
    //var p_h = parseInt($(document.body).parent().parent().height()) - 40;
    var p_h = parseInt($(window).height()) - 40;
    
    //console.log($(".zLL").length);
    if ($(".zLL").length > 0) {
        $(".zAList .zLList,.zAList .zRList").height(p_h);
    } else {
        $(".text-error").css({ "line-height": p_h + "px" });
    }

    $(window).resize(function () {
        p_h = parseInt($(window).height()) - 40;
        if ($(".zLL").length > 0) {
            $(".zAList .zLList,.zAList .zRList").height(p_h);
        } else {
            $(".text-error").css({ "line-height": p_h + "px" });
        }
    });

}

//字符串逆转
function strturn(str) {
    if (str != "") {
        var str1 = "";
        for (var i = str.length - 1; i >= 0; i--) {
            str1 += str.charAt(i);
        }
        return (str1);
    }
}

//调整页面居中
function adjustCenter(obj, childobj) {
    // 是childobj居中。。。  
    var $childobj = obj.find(childobj);
    //获取可视窗口的高度  
    var clientHeight = $(document.body).parent().height();
    var clientWidth = $(document.body).parent().width();
    if (clientWidth >= window.screen.width) {
        clientWidth = window.screen.width;
    }
    //得到dialog的高度  
    var childHeight = $childobj.height() + 50;
    var childWidth = $childobj.width();
    //计算出距离顶部的高度  
    var m_top = Math.abs((clientHeight - childHeight) / 2);
    $childobj.css({ 'margin': m_top + 'px auto ' + m_top + 'px auto' });

}
