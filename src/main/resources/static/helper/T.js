(function (global) {
    var _version = '1.0.0',
        _setting = {
            openTag: '<#',          /*逻辑代码的开始标签*/
            closeTag: '#>',         /*逻辑代码的结束标签*/
            maskOpenTag: '<!-',     /*注释的开始标签*/
            maskCloseTag: '-!>'     /*注释的结束标签*/
        },
        _templateCache = {},
        _escapeHTML = function (str) {
            if (typeof str == 'string') {
                var reg = /&(?!#?\w+;)|<|>|"|'|\//g,
                    rules = { '&': '&#38;', '<': '&#60;', '>': '&#62;', '"': '&#34;', "'": '&#39;', '/': '&#47;' };

                return str.replace(reg, function (m) {
                    return rules[m];
                });
            }
            return str;
        },
        _getTitle = function (str) {
            str = "<span>" + str + "</span>";
            var tag = $(str);
            tag = tag.children();
            if (tag.html() == null) return str;
            while (tag.children().html() != null) {
                tag = tag.children();
            }
            return tag.html();
        },
        _compile = function (source, key) {
            if (typeof key != 'undefined' && typeof _templateCache[key] == 'function') {
                return _templateCache[key];
            }
            var code = (function () {/*剔除注释代码*/
                var arr = (source || '').split(_setting.maskOpenTag);
                arrayEach(arr, function (i, o) {
                    var _arr = o.split(_setting.maskCloseTag);
                    this[i] = _arr.length == 1 ?
                        (i == 0 ? _arr[0] : _setting.maskOpenTag + _arr[0]) : _arr[1];
                });
                return arr.join('');
            })();

            return _templateCache[key] = (function () {
                var codeArr = code.split(_setting.openTag),
                    funArr = [
                        'var $T = arguments[0];\n',
                        'var $data = this || { };\n',
                        'var $escapeHTML = $T.escapeHTML;\n',
                        'var $getTitle = $T.getTitle;\n',
                        'var $htmlArr = [];\n',
                        'var $write = function() { Array.prototype.push.apply($htmlArr, arguments); };\n'
                    ];

                arrayEach(codeArr, function (i, o) {
                    var arr = o.split(_setting.closeTag);
                    if (arr.length == 1) {
                        funArr.push(html(arr[0]));
                    } else {
                        funArr.push(logic(arr[0]), html(arr[1]));
                    }
                });

                funArr.push('return $htmlArr.join("");');

                try {
                    var fun = new Function(funArr.join(''));
                } catch (e) {
                    var fun = new Function('return "Template Error !"');
                }

                return function () {
                    try {
                        return Function.prototype.call.apply(fun, [arguments[0], _t]);
                    } catch (e) {
                        return e.name + ' : ' + e.message;
                    }
                };
            })();

            function arrayEach(arr, fun) {
                if (Object.prototype.toString.call(arr) == '[object Array]') {
                    if (typeof fun == 'function') {
                        for (var i = 0, len = arr.length; i < len; i++) {
                            Function.prototype.call.apply(fun, [arr, i, arr[i]]);
                        }
                    }
                }
            }

            function html(code) {
                code = code
                    .replace(/"/g, '\\"')
                    .replace(/\r/g, '\\r')
                    .replace(/\n/g, '\\n');
                return '$write("' + code + '");\n';
            }

            function logic(code) {
                code = code.replace(/^\s+/g, '');
                if (code.indexOf('===') === 0) {
                    return '$write($getTitle(' + code.substring(3) + '));\n';
                } else if (code.indexOf('==') === 0) {
                    return '$write(' + code.substring(2) + ');\n';
                } else if (code.indexOf('=') === 0) {
                    return '$write($escapeHTML(' + code.substring(1) + '));\n';
                } else {
                    return code + '\n';
                }
            }
        },
        _t = {
            version: _version,
            setting: _setting,
            templateCache: _templateCache,
            getTitle: _getTitle,
            escapeHTML: _escapeHTML,
            compile: _compile
        };

    global.T = global.T || {};
    for (var it in _t) { global.T[it] = _t[it]; }
})(this);