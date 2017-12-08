(function () {
    var __form__ = {
        formSubmit: function (obj) {
            var o = (function (o) {
                o.form = o.form ? o.form : window.document.forms[0];
                o.url = o.url ? o.url : '';
                o.type = o.type ? o.type : 'get';
                o.target = o.target ? o.target : '_self';
                o.encType = o.encType ? o.encType : 'application/x-www-form-urlencoded';

                return o;
            })(obj);

            try {
                if (typeof o.onSubmit == 'function') {
                    if (!o.onSubmit()) {
                        return;
                    }
                }
                o.form.setAttribute('method', o.type);
                o.form.setAttribute('action', o.url);
                o.form.setAttribute('target', o.target);
                o.form.setAttribute('enctype', o.encType);
                o.form.submit();
            }
            catch (e) {

            }
        },
        dataSubmit: function (obj) {
            var o = (function (o) {
                o.url = o.url ? o.url : '';
                o.type = o.type ? o.type : 'get';
                o.target = o.target ? o.target : '_self';
                o.data = o.data ? o.data : {};

                return o;
            })(obj);

            try {
                var f = document.createElement('form');
                for (var it in o.data) {
                    var i = document.createElement('input');
                    i.setAttribute('type', 'hidden');
                    i.setAttribute('name', it);
                    i.setAttribute('value', o.data[it]);
                    f.appendChild(i);
                }
                document.body.appendChild(f);

                __form__.formSubmit({
                    form: f,
                    url: o.url,
                    type: o.type,
                    target: o.target,
                    onSubmit: o.onSubmit
                });

                document.body.removeChild(f);
                delete f;
            }
            catch (e) {

            }
        }
    };

    window.form = __form__;
})();