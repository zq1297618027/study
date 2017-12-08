/*
*筛选一个数组
*
* fun：返回一个bool值用于确定是否要选中该元素，接收两个参数：i（该元素在数组中的索引），it（该元素）
* count：要选中元素的数量，如果该参数不是数字则选中所有符合条件的元素
*/
Array.prototype.Select = function (fun, count) {
    if (typeof fun == 'function') {
        var arr = [], coun = parseInt(count);
        for (var i = 0, L = this.length; i < L; i++) {
            if (!isNaN(coun) && coun == arr.length) {
                break;
            }
            if (fun(i, this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    }
    return this;
};

/*
*对Array.join方法的扩展，用于内部元素比较复杂的数组
*
* tag：join时的间隔字符串
* fun：返回对数组的每个元素组处理后的结果，接收两个参数：i（该元素在数组中的索引），it（该元素）
*/
Array.prototype.Join = function (tag, fun) {
    if (Object.prototype.toString.call(this) == '[object Array]') {
        if (typeof fun == 'function') {
            var arr = [];
            for (var i = 0, L = this.length; i < L; i++) {
                arr.push(fun(i, this[i]) || '');
            }
            return arr.join(tag || ',');
        }
        return Array.prototype.join.call(this, tag || ',');
    }
    return this;
};

/*
*根据原数组创建一个新的数组
*
* fun：返回一个值作为新数组的对应索引位置的值,接收两个参数：i（该元素在数组中的索引），it（该元素）
* fune：返回一个bool值确定是否要将将对应的索引的新元素添加到新数组中去
*/
Array.prototype.New = function (fun, fune) {
    var arr = [];
    if (typeof fun == 'function') {
        for (var i = 0, L = this.length; i < L; i++) {
            if (!(typeof fune == 'function') || Function.prototype.call.apply(fune, [null, i, this[i]])) {
                arr.push(Function.prototype.call.apply(fun, [null, i, this[i]]));
            }
        }
    }
    return arr;
};

/*
*查找某字符串在数组中出现的位置，可用于内部元素比较复杂的数组
* str: 要查找的字符串
* fun: 返回一个值与 str 对比,接收两个参数：i（该元素在数组中的索引），it（该元素）
*/
Array.prototype.IndexOf = function (str, fun) {
    if (typeof fun == 'function') {
        for (var i = 0, L = this.length; i < L; i++) {
            if (fun(i, this[i]) == str) {
                return i;
            }
        }
        return -1;
    }
    return arguments.callee.call(this, str, function (i, o) {
        return o;
    });
};

/*
*去掉数组中重复的项
*
*fun：返回该元素或对元素做处理后的结果（根据该结果去掉重复的），接收两个参数：i（该元素在数组中的索引），it（该元素）
*/
Array.prototype._uniq = function (fun) {
    if (Object.prototype.toString.call(this) == '[object Array]') {
        var obj = {}, arr = [];
        for (var i = 0, L = this.length; i < L; i++) {
            var nit = typeof fun == 'function' ? fun(i, this[i]) : this[i];
            if (typeof obj[nit] == 'undefined') {
                obj[nit] = this[i];
            }
        }
        for (var it in obj) {
            arr.push(obj[it]);
        }
        return arr;
    }
    return this;
};

/*
*执行指定次数的 fun 动作
*/
Number.prototype.Times = function (fun) {
    if (Object.prototype.toString.call(this) == '[object Number]' && typeof fun == 'function') {
        for (var i = 0, len = parseInt(this); i < len; i++) {
            Function.prototype.call.apply(fun, [this, i, this]);
        }
    }
};

//去掉字符串左边的空白字符
String.prototype._ltrim = function () {
    return String.prototype.replace.call(this, /^\s+/g, '');
};

//去掉字符串右边的空白字符
String.prototype._rtrim = function () {
    return String.prototype.replace.call(this, /\s+$/g, '');
};

//去掉字符串左右两边的空白字符
String.prototype._trim = function () {
    return String.prototype.replace.call(this, /^\s+|\s+$/g, '');
};

/*
*延迟执行某个方法
*
* 第一个参数是需要延迟执行的时间，
* 第二个参数是回调函数（接收一个参数），
* 后面是当前方法需要的参数
*/
Function.prototype._delay = function () {
    var _this = this;
    if (typeof _this == 'function') {
        var _arrArgs = Array.apply(null, arguments),
            _ms = Object.prototype.toString.call(arguments[0]) == '[object Number]' ? arguments[0] : 0,
            _call = Object.prototype.toString.call(arguments[1]) == '[object Function]' ? arguments[1] : function () { };
        setTimeout(function () {
            _arrArgs.splice(0, 2, null);
            Function.prototype.call.apply(_call, [null, Function.prototype.call.apply(_this, _arrArgs)]);
        }, _ms);
    }
};