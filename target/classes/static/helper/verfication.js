// 一些控制全局变量
var isMove = false; // 鼠标是否拖动验证码
var x = 0; // 鼠标点击时滑块x轴坐标

var slide_block = $('.slide_block');
var green_block = $('.green_block');
var slider = $('.slider');
var slider_text = $('.slider_text');
var maxDistance = slide_block.width() - slider.width(); // 滑块最长滑动距离
//console.log("滑块slide_block.width()距离：" + slide_block.width());
//console.log("滑块slider.width()/2距离：" + slider.width()*2);
//console.log("滑块最长滑动距离：" + maxDistance);
// 鼠标点击下时记录下水平x轴位置
slider.mousedown(function (e) {
    isMove = true;
    x = e.pageX - parseInt(slider.css('left'), 10);
    //console.log("当前鼠标x轴坐标：" + e.pageX);
    //console.log("当前滑块偏离滑条区左侧距离：" + slider.css('left'));
    //console.log("x：" + x);
});
slider_text.mousedown(function (e) {
    isMove = true;
    x = e.pageX - parseInt(slider_text.css('left'), 10);
});

// 鼠标滑动时滑块跟着滑动，绿块宽度增加
$(document).mousemove(function (e) {
    var move_x = e.pageX - x; // 计算鼠标滑动的距离
    //console.log("e.pageX：" + e.pageX);
    //console.log("x：" + x);
    //console.log("move_x：" + move_x);
    if (isMove) {
        if (move_x > 0 && move_x <= maxDistance) {
            slider.css('left', move_x);
            green_block.css('width', move_x);
        } else if (move_x > maxDistance) {
            if (slide_block.width() > 320) {
                slider.css('left', 90 + '%');
                green_block.css('width', 90 + '%');
            } else if (slide_block.width() < 320 && slide_block.width() > 200) {
                slider.css('left', 83 + '%');
                green_block.css('width', 83 + '%');
            }

            sliderOK();
        } else if (move_x < 0) {
            slider.css('left', 0);
            green_block.css('width', 0);
        }
    }
}).mouseup(function (e) {
    isMove = false;
    var release_x = e.pageX - x;
    if (release_x < maxDistance) {
        slider.animate({
            'left': 0
        }, 450);
        green_block.animate({
            'width': 0
        }, 450);
    }
});

// 验证成功清除鼠标绑定事件
var sliderOK = function () {
    slider.removeClass('slider_bg').addClass('slider_ok_bg glyphicon glyphicon-ok');
    // 显示调用接口中样式
    // 调用接口后台验证

    slider_text.find('span').text('验证通过');
    slider_text.css('color', 'white');
    slider_text.css('text-align', 'center');
    $(document).unbind('mousemove');
    $(document).unbind('mouseup');
}
