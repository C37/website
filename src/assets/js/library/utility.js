// 2015.05.15 - novas funcões aprimorando Array
(function (window) {

    (function () {

        // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function (searchString, position) {
                position = position || 0;
                return this.indexOf(searchString, position) === position;
            };
        }

        // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
        if (!String.prototype.endsWith) {
            String.prototype.endsWith = function (searchString, position) {
                var subjectString = this.toString();
                if (position === undefined || position > subjectString.length) {
                    position = subjectString.length;
                }
                position -= searchString.length;
                var lastIndex = subjectString.indexOf(searchString, position);
                return lastIndex !== -1 && lastIndex === position;
            };
        }

        // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/includes
        if (!String.prototype.contains) {
            String.prototype.contains = function () {
                'use strict';
                return String.prototype.indexOf.apply(this, arguments) !== -1;
            };
        }

    })();

    var string = {
        format: function (str, args) {
            return str.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        },
        contains: function () {
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        },
        hashCode: function (str) {
            // http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
            var hash = 0,
                i, chr, len;
            if (str.length === 0)
                return hash;
            for (i = 0, len = str.length; i < len; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }
    };


    var math = {
        uuid: function (length, radix) {
            // http://www.ietf.org/rfc/rfc4122.txt
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
                uuid = [],
                i;
            radix = radix || chars.length;

            if (length) {
                for (i = 0; i < length; i++)
                    uuid[i] = chars[0 | Math.random() * radix];
            } else {
                var r;

                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('').toLowerCase();
        },
        parseFloat: function (float, decimal) {
            return Number(parseFloat(float).toFixed(decimal));
        },
        parseNumber: function (float, decimal) {
            return parseFloat(float).toFixed(decimal);
        },
        // Converts from degrees to radians.
        radians: function (degrees) {
            return degrees * (Math.PI / 180);
        },
        // Converts from radians to degrees.
        degrees: function (radians) {
            return radians * (180 / Math.PI);
        }
    };


    var cryptography = {
        // http://www.myersdaily.org/joseph/javascript/md5.js
        md5: (function () {

            function md5cycle(x, k) {
                var a = x[0],
                    b = x[1],
                    c = x[2],
                    d = x[3];

                a = ff(a, b, c, d, k[0], 7, -680876936);
                d = ff(d, a, b, c, k[1], 12, -389564586);
                c = ff(c, d, a, b, k[2], 17, 606105819);
                b = ff(b, c, d, a, k[3], 22, -1044525330);
                a = ff(a, b, c, d, k[4], 7, -176418897);
                d = ff(d, a, b, c, k[5], 12, 1200080426);
                c = ff(c, d, a, b, k[6], 17, -1473231341);
                b = ff(b, c, d, a, k[7], 22, -45705983);
                a = ff(a, b, c, d, k[8], 7, 1770035416);
                d = ff(d, a, b, c, k[9], 12, -1958414417);
                c = ff(c, d, a, b, k[10], 17, -42063);
                b = ff(b, c, d, a, k[11], 22, -1990404162);
                a = ff(a, b, c, d, k[12], 7, 1804603682);
                d = ff(d, a, b, c, k[13], 12, -40341101);
                c = ff(c, d, a, b, k[14], 17, -1502002290);
                b = ff(b, c, d, a, k[15], 22, 1236535329);

                a = gg(a, b, c, d, k[1], 5, -165796510);
                d = gg(d, a, b, c, k[6], 9, -1069501632);
                c = gg(c, d, a, b, k[11], 14, 643717713);
                b = gg(b, c, d, a, k[0], 20, -373897302);
                a = gg(a, b, c, d, k[5], 5, -701558691);
                d = gg(d, a, b, c, k[10], 9, 38016083);
                c = gg(c, d, a, b, k[15], 14, -660478335);
                b = gg(b, c, d, a, k[4], 20, -405537848);
                a = gg(a, b, c, d, k[9], 5, 568446438);
                d = gg(d, a, b, c, k[14], 9, -1019803690);
                c = gg(c, d, a, b, k[3], 14, -187363961);
                b = gg(b, c, d, a, k[8], 20, 1163531501);
                a = gg(a, b, c, d, k[13], 5, -1444681467);
                d = gg(d, a, b, c, k[2], 9, -51403784);
                c = gg(c, d, a, b, k[7], 14, 1735328473);
                b = gg(b, c, d, a, k[12], 20, -1926607734);

                a = hh(a, b, c, d, k[5], 4, -378558);
                d = hh(d, a, b, c, k[8], 11, -2022574463);
                c = hh(c, d, a, b, k[11], 16, 1839030562);
                b = hh(b, c, d, a, k[14], 23, -35309556);
                a = hh(a, b, c, d, k[1], 4, -1530992060);
                d = hh(d, a, b, c, k[4], 11, 1272893353);
                c = hh(c, d, a, b, k[7], 16, -155497632);
                b = hh(b, c, d, a, k[10], 23, -1094730640);
                a = hh(a, b, c, d, k[13], 4, 681279174);
                d = hh(d, a, b, c, k[0], 11, -358537222);
                c = hh(c, d, a, b, k[3], 16, -722521979);
                b = hh(b, c, d, a, k[6], 23, 76029189);
                a = hh(a, b, c, d, k[9], 4, -640364487);
                d = hh(d, a, b, c, k[12], 11, -421815835);
                c = hh(c, d, a, b, k[15], 16, 530742520);
                b = hh(b, c, d, a, k[2], 23, -995338651);

                a = ii(a, b, c, d, k[0], 6, -198630844);
                d = ii(d, a, b, c, k[7], 10, 1126891415);
                c = ii(c, d, a, b, k[14], 15, -1416354905);
                b = ii(b, c, d, a, k[5], 21, -57434055);
                a = ii(a, b, c, d, k[12], 6, 1700485571);
                d = ii(d, a, b, c, k[3], 10, -1894986606);
                c = ii(c, d, a, b, k[10], 15, -1051523);
                b = ii(b, c, d, a, k[1], 21, -2054922799);
                a = ii(a, b, c, d, k[8], 6, 1873313359);
                d = ii(d, a, b, c, k[15], 10, -30611744);
                c = ii(c, d, a, b, k[6], 15, -1560198380);
                b = ii(b, c, d, a, k[13], 21, 1309151649);
                a = ii(a, b, c, d, k[4], 6, -145523070);
                d = ii(d, a, b, c, k[11], 10, -1120210379);
                c = ii(c, d, a, b, k[2], 15, 718787259);
                b = ii(b, c, d, a, k[9], 21, -343485551);

                x[0] = add32(a, x[0]);
                x[1] = add32(b, x[1]);
                x[2] = add32(c, x[2]);
                x[3] = add32(d, x[3]);

            }

            function cmn(q, a, b, x, s, t) {
                a = add32(add32(a, q), add32(x, t));
                return add32((a << s) | (a >>> (32 - s)), b);
            }

            function ff(a, b, c, d, x, s, t) {
                return cmn((b & c) | ((~b) & d), a, b, x, s, t);
            }

            function gg(a, b, c, d, x, s, t) {
                return cmn((b & d) | (c & (~d)), a, b, x, s, t);
            }

            function hh(a, b, c, d, x, s, t) {
                return cmn(b ^ c ^ d, a, b, x, s, t);
            }

            function ii(a, b, c, d, x, s, t) {
                return cmn(c ^ (b | (~d)), a, b, x, s, t);
            }

            function md51(s) {
                txt = '';
                var n = s.length,
                    state = [1732584193, -271733879, -1732584194, 271733878],
                    i;
                for (i = 64; i <= s.length; i += 64) {
                    md5cycle(state, md5blk(s.substring(i - 64, i)));
                }
                s = s.substring(i - 64);
                var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (i = 0; i < s.length; i++)
                    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
                tail[i >> 2] |= 0x80 << ((i % 4) << 3);
                if (i > 55) {
                    md5cycle(state, tail);
                    for (i = 0; i < 16; i++)
                        tail[i] = 0;
                }
                tail[14] = n * 8;
                md5cycle(state, tail);
                return state;
            }

            /* there needs to be support for Unicode here,
             * unless we pretend that we can redefine the MD-5
             * algorithm for multi-byte characters (perhaps
             * by adding every four 16-bit characters and
             * shortening the sum to 32 bits). Otherwise
             * I suggest performing MD-5 as if every character
             * was two bytes--e.g., 0040 0025 = @%--but then
             * how will an ordinary MD-5 sum be matched?
             * There is no way to standardize text to something
             * like UTF-8 before transformation; speed cost is
             * utterly prohibitive. The JavaScript standard
             * itself needs to look at this: it should start
             * providing access to strings as preformed UTF-8
             * 8-bit unsigned value arrays.
             */
            function md5blk(s) { /* I figured global was faster.   */
                var md5blks = [],
                    i; /* Andy King said do it this way. */
                for (i = 0; i < 64; i += 4) {
                    md5blks[i >> 2] = s.charCodeAt(i) +
                        (s.charCodeAt(i + 1) << 8) +
                        (s.charCodeAt(i + 2) << 16) +
                        (s.charCodeAt(i + 3) << 24);
                }
                return md5blks;
            }

            var hex_chr = '0123456789abcdef'.split('');

            function rhex(n) {
                var s = '',
                    j = 0;
                for (; j < 4; j++)
                    s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] +
                    hex_chr[(n >> (j * 8)) & 0x0F];
                return s;
            }

            function hex(x) {
                for (var i = 0; i < x.length; i++)
                    x[i] = rhex(x[i]);
                return x.join('');
            }

            return function md5(s) {
                return hex(md51(s));
            };


            /* this function is much faster,
             so if possible we use it. Some IEs
             are the only ones I know of that
             need the idiotic second function,
             generated by an if clause.  */

            function add32(a, b) {
                return (a + b) & 0xFFFFFFFF;
            }

            if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
                function add32(x, y) {
                    var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                    return (msw << 16) | (lsw & 0xFFFF);
                }
            }


        })()
    }


    var object = {
        inherits: function (f, p) {
            //f.prototype = p.prototype;
            // O OBJETO INSTANCIADO!!!
            f.prototype = new p();
            f.constructor = f;
            return f;
        },
        /*
         * Copy the enumerable properties of p to o, and return o
         * If o and p have a property by the same name, o's property is overwritten
         * This function does not handle getters and setters or copy attributes
         */
        extend: function (o, p) {
            for (var prop in p) { // For all props in p.
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
                // 2014.08.08 11:00 - lilo - alteração para funcionar com propriedas e função "not own (prototype chain)" do objeto
                var desc = Object.getOwnPropertyDescriptor(p, prop);
                if (desc) {
                    Object.defineProperty(o, prop, desc); // add the property to o.
                } else {
                    o[prop] = p[prop];
                }
            }
            return this;
            // 2014.11.27 2047 - lilo - method chaining
            // return o;
        },
        // http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
        clone: function (obj) {
            if (null === obj || "object" !== typeof obj)
                return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = obj[attr];
            }
            return copy;
        },
        /*
         * Copy the enumerable properties of p to o, and return o
         * If o and p have a property by the same name, o's property is left alone
         * This function does not handle getters and setters or copy attributes
         */
        merge: function (o, p) {
            for (var prop in p) { // For all props in p
                if (o.hasOwnProperty[prop])
                    continue; // Except those already in o
                o[prop] = p[prop]; // add the property to o
            }
            return o;
        },
        event: (function () {

            // http://www.dofactory.com/javascript/mediator-design-pattern
            // https://addyosmani.com/resources/essentialjsdesignpatterns/book/#mediatorpatternjavascript
            // https://carldanley.com/js-mediator-pattern
            // https://www.safaribooksonline.com/library/view/learning-javascript-design/9781449334840/ch09s06.html

            function Event() {
                this.listeners = {};
            }

            /**
             * register listen events
             * 
             * @param {string} event name of event
             * @returns {function} handler function of event
             */
            Event.prototype.listen = function (event, handler) {
                (this.listeners[event] = this.listeners[event] || []).push(handler);
            };

            Event.prototype.notify = function (event, data) {
                if (this.listeners[event] !== undefined) {
                    for (var handler in this.listeners[event]) {
                        this.listeners[event][handler].call(this, data);
                    }
                }
            };

            Event.prototype.unListen = function (event, handler) {
                if (this.listeners[event] !== undefined) {
                    var index = this.listeners[event].indexOf(handler);
                    if (index !== -1) {
                        this.listeners[event].splice(index, 1);
                    }
                }
            };

            Event.create = function () {
                return new Event();
            };

            return Event;

        })(),
        // https://addyosmani.com/blog/essential-js-namespacing/
        // http://ejohn.org/blog/javascript-method-overloading/
        // SUBSTITUIDA POR METHODOS COM OVERLOADING
        // namespace: function (obj, namespace) {
        //     var parts = namespace.split('.'),
        //         parent = obj,
        //         pl, i;

        //     // if (parts[0] == "myApp") {
        //     //     parts = parts.slice(1);
        //     // }

        //     pl = parts.length;
        //     for (i = 0; i < pl; i++) {
        //         //create a property if it doesnt exist
        //         if (typeof parent[parts[i]] == 'undefined') {
        //             parent[parts[i]] = {};
        //         }

        //         parent = parent[parts[i]];
        //     }

        //     return parent;
        // }
    };

    addMethod(object, "namespace", function (obj, namespace) {
        var parts = namespace.split('.'),
            parent = obj,
            pl, i;

        // if (parts[0] == "myApp") {
        //     parts = parts.slice(1);
        // }

        pl = parts.length;
        for (i = 0; i < pl; i++) {
            //create a property if it doesnt exist
            if (typeof parent[parts[i]] == 'undefined') {
                parent[parts[i]] = {};
            }

            parent = parent[parts[i]];
        }

        return parent;
    });

    addMethod(object, "namespace", function (obj, namespace, attrs) {

        // debugger;

        var parts = namespace.split('.'),
            parent = obj,
            pl, i;

        // if (parts[0] == "myApp") {
        //     parts = parts.slice(1);
        // }

        pl = parts.length;
        for (i = 0; i < pl; i++) {
            //create a property if it doesnt exist
            if (typeof parent[parts[i]] == 'undefined') {
                if (i === (pl - 1)) {
                    parent[parts[i]] = attrs;
                } else {
                    parent[parts[i]] = {};
                }
            }

            parent = parent[parts[i]];
        }

        return parent;
    });

    // http://ejohn.org/blog/javascript-method-overloading/
    // addMethod - By John Resig (MIT Licensed)
    function addMethod(object, name, fn) {
        var old = object[name];
        object[name] = function () {
            if (fn.length == arguments.length)
                return fn.apply(this, arguments);
            else if (typeof old == 'function')
                return old.apply(this, arguments);
        };
    }


    var conversion = {
        // http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
        toType: function (obj) {
            return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        },
        toJson: function (obj) {
            return '';
        },
        toObject: function (obj) {
            return {};
        },
        toArray: function (obj) {
            var array = [];
            // iterate backwards ensuring that length is an UInt32
            for (var i = obj.length >>> 0; i--;) {
                array[i] = obj[i];
            }
            return array;
        }
    };


    (function () {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
        // http://underscorejs.org/#countBy
        if (!Array.prototype.count) {

            Array.prototype.count = function (fun /*, thisArg*/ ) {

                'use strict';

                if (this === void 0 || this === null) {
                    throw new TypeError();
                }

                var t = Object(this);
                var len = t.length >>> 0;
                //                if (typeof fun !== 'function') {
                //                    throw new TypeError();
                //                }

                var res = [];
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    if (i in t) {
                        var val = t[i];

                        // NOTE: Technically this should Object.defineProperty at
                        //       the next index, as push can be affected by
                        //       properties on Object.prototype and Array.prototype.
                        //       But that method's new, and collisions should be
                        //       rare, so use the more-compatible alternative.
                        if (fun.call(thisArg, val, i, t)) {
                            res.push(val);
                        }
                    }
                }

                return res.length;
            };

        }

        if (!Array.prototype.contains) {

            Array.prototype.contains = function (fun /*, thisArg*/ ) {

                'use strict';

                if (this === void 0 || this === null) {
                    throw new TypeError();
                }

                var t = Object(this);
                var len = t.length >>> 0;
                //                if (typeof fun !== 'function') {
                //                    throw new TypeError();
                //                }

                var res = [];
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    if (i in t) {
                        var val = t[i];

                        // NOTE: Technically this should Object.defineProperty at
                        //       the next index, as push can be affected by
                        //       properties on Object.prototype and Array.prototype.
                        //       But that method's new, and collisions should be
                        //       rare, so use the more-compatible alternative.
                        if (fun.call(thisArg, val, i, t)) {
                            res.push(val);
                        }
                    }
                }

                return res.length > 0;
            };

        }

        if (!Array.prototype.first) {
            Array.prototype.first = function () {
                return this[0];
            };
        }

        if (!Array.prototype.last) {
            Array.prototype.last = function () {
                return this[this.length - 1];
            };
        }

    })();

    var array = {
        find: function (array, item) {
            return array[array.indexOf(item)];
        },
        split: function (a, n) {
            var len = a.length,
                out = [],
                i = 0;
            while (i < len) {
                var size = Math.ceil((len - i) / n--);
                out.push(a.slice(i, i + size));
                i += size;
            }
            return out;
        },
        diff: function (a, b) {

            var onlyInA = a.filter(function (current) {
                return b.filter(function (current_b) {
                    return (current_b.snap.x === current.snap.x) && (current_b.snap.y === current.snap.y);
                }).length === 0;
            });

            var onlyInB = b.filter(function (current) {
                return a.filter(function (current_a) {
                    return (current_a.snap.x === current.snap.x) && (current_a.snap.y === current.snap.y);
                }).length === 0;
            });

            return onlyInA.concat(onlyInB);
        }
    };

    // do livro - Segredos do Ninja JavaScript - John Resig - pag. 264
    var thread = {
        id: 0,
        threads: [],
        add: function (handler) {
            this.threads.push(handler);
        },
        start: function () {
            if (this.id)
                return;

            (function runNext() {
                if (thread.threads.length > 0) {
                    for (var i = 0; i < thread.threads.length; i++) {
                        if (thread.threads[i]() === false) {
                            thread.threads.splice(i, 1);
                            i--;
                        }
                    }
                }
            })();
        },
        stop: function () {
            clearTimeout(this.id);
            this.id = 0;
        }
    };

    // https://github.com/ArthurClemens/Javascript-Undo-Manager
    var file = {
        history: (function () {

            // EVENTOS = podem ser de dois tipos: 
            // - ações = não possuem undo, ex: zoom + center, novo arquivo
            // - comandos = possuem undo e redo, ex: criar, deletar ou alterar um objeto
            var events = [],
                index = 0;

            function add(event) {

                // salvo o horario do evento para mostrar 
                event.createAt = new Date().toISOString();

                // verifico se não estou add para um evento após um execute
                if (index !== 0) {

                    // ordeno os eventos em ordem decrescente
                    events = list();

                    // excluo do inicio até o index
                    events.splice(0, index);

                    // quando ao add um novo evento 'limpo' o index
                    index = 0;
                }

                // de tempos em tempos remove a lista para liberar memória
                if (events.length === 200) {

                    events = list();

                    events.splice(100, 199);

                }


                // add na pilha 'array' o novo evento
                return events.push(event);
            }

            function execute(to, callback) {

                // declaro está variavel auxiliar
                // ordeno os eventos em ordem decrescente
                var sortEvents = list();

                // para onde vou
                to = parseInt(to);
                // onde estou
                index = parseInt(index);


                // onde estou é maior do que para onde vou
                if (index > to) {

                    //retira

                    // inicio na posição que estou
                    // vou até to
                    // retirando
                    for (var i = index; i >= to; i--) {

                        // ações são prioritárias
                        if (sortEvents[i].action) {
                            sortEvents[i].action();
                        } else {
                            sortEvents[i].redo.action();
                            sortEvents[i].redo.command();
                        }

                    }



                }

                // onde estou é menor do que para onde vou
                if (index < to) {

                    // adiciona

                    // inicio na posição que estou
                    // vou até to
                    // adicionando
                    for (var i = index; i <= to; i++) {

                        // ações são prioritárias
                        if (sortEvents[i].action) {
                            sortEvents[i].action();
                        } else {
                            sortEvents[i].undo.action();
                            // o ultimo undo (desfazer) não é executado
                            if (i !== to) {
                                sortEvents[i].undo.command();
                            }
                        }


                    }

                }

                // marco o novo index
                index = to;

                return callback(true);

            }

            function list() {
                return events.sort(function (a, b) {
                    return a.createAt < b.createAt ? 1 : a.createAt > b.createAt ? -1 : 0;
                });
            }

            function clear() {
                return events = [];
            }

            return {
                add: add,
                list: list,
                clear: clear,
                execute: execute
            };

        })()
    };

    var interface = {
        unfade: function (element) {
                var op = 0.1; // initial opacity
                element.style.display = 'block';
                var timer = setInterval(function () {
                    if (op >= 1) {
                        clearInterval(timer);
                    }
                    element.style.opacity = op;
                    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op += op * 0.1;
                }, 10);
            },
            fade: function (element) {
                var op = 1; // initial opacity
                var timer = setInterval(function () {
                    if (op <= 0.1) {
                        clearInterval(timer);
                        element.style.display = 'none';
                    }
                    element.style.opacity = op;
                    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op -= op * 0.1;
                }, 20);
            }
    }



    // http://stackoverflow.com/questions/12487352/how-do-i-pause-and-resume-a-timer
    //    var clock = {
    //        totalSeconds: 0,
    //        start: function () {
    //            var self = this;
    //
    //            this.interval = setInterval(function () {
    //                self.totalSeconds += 1;
    //
    //                $("#hour").text(Math.floor(self.totalSeconds / 3600));
    //                $("#min").text(Math.floor(self.totalSeconds / 60 % 60));
    //                $("#sec").text(parseInt(self.totalSeconds % 60));
    //            }, 1000);
    //            
    //        },
    //        pause: function () {
    //            clearInterval(this.interval);
    //            delete this.interval;
    //        },
    //        resume: function () {
    //            if (!this.interval)
    //                this.start();
    //        }
    //    };

    //    clock.start();

    // http://stackoverflow.com/questions/951021/what-do-i-do-if-i-want-a-javascript-version-of-sleep
    function sleepFor(ms) {
        var now = new Date().getTime();
        while (new Date().getTime() < now + ms) { /* do nothing */ }
    }



    // http://ccoenraets.github.io/es6-tutorial-data/promisify/
    // http://stackoverflow.com/questions/28921127/how-to-wait-for-a-javascript-promise-to-resolve-before-resuming-function
    let request = obj => {
        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();
            xhr.open(obj.method || "GET", obj.url);
            if (obj.headers) {
                Object.keys(obj.headers).forEach(key => {
                    xhr.setRequestHeader(key, obj.headers[key]);
                });
            }
            xhr.onload = () => {

                // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
                resolve({
                    code: xhr.status,
                    text: xhr.response || xhr.responseText
                });

                // if (xhr.status >= 200 && xhr.status < 300) {
                //     resolve(xhr.response);
                // } else {
                //     reject(xhr.statusText);
                // }
            };

            xhr.onerror = () => reject(xhr.statusText);
            xhr.send(obj.body);
        });
    };



    var info = {
        browser: {
            name: function (agent) {

                // function getBrowserName() {
                //     // http://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript
                //     if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
                //         _browserName = 'Opera';
                //     } else if (navigator.userAgent.indexOf("Chrome") != -1) {
                //         _browserName = 'Chrome';
                //     } else if (navigator.userAgent.indexOf("Safari") != -1) {
                //         _browserName = 'Safari';
                //     } else if (navigator.userAgent.indexOf("Firefox") != -1) {
                //         _browserName = 'Firefox';
                //     } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) //IF IE > 10
                //     {
                //         _browserName = 'Internet Explorer';
                //     } else {
                //         _browserName = 'not detected';
                //     }
                // }



            }
        },
        os: {
            name: function (agent) {


                // function getOsName() {
                //     // http://www.javascripter.net/faq/operatin.htm
                //     var osName = "not detected";
                //     if (navigator.appVersion.indexOf("Win") != -1) osName = "Windows";
                //     if (navigator.appVersion.indexOf("Mac") != -1) osName = "MacOS";
                //     if (navigator.appVersion.indexOf("X11") != -1) osName = "UNIX";
                //     if (navigator.appVersion.indexOf("Linux") != -1) osName = "Linux";

                //     _osName = osName
                // }


            }
        },
        processor: {

        }
    };


    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
    // para evitar o Method OPTIONS estou enviando o post como text/plain
    // xmlhttp.setRequestHeader("content-type", "application/json");
    // http://ccoenraets.github.io/es6-tutorial-data/promisify/
    var net = {
        request: request,
        info: {
            data: null,
            load: function () {

                net.request({
                    url: "https://freegeoip.net/json/"
                }).then(data => {
                    if (data.code === 200) {
                        net.info.data = JSON.parse(data.text);
                        // console.log(net.info.data)
                    }
                });

            }
        }
    };


    // https://developer.mozilla.org/pt-BR/docs/Web/Events/DOMContentLoaded
    document.addEventListener("DOMContentLoaded", function (event) {
        net.info.load();
    });


    var utility = {
        math: math,
        cryptography: cryptography,
        array: array,
        thread: thread,
        string: string,
        object: object,
        conversion: conversion,
        file: file,
        interface: interface,
        net: net,
        info: info
    };


    // colocando plane dentro dos namespaces C37
    utility.object.namespace(window, 'c37.library.utility')

    window.c37.library.utility = utility;
    // colocando plane dentro dos namespaces C37

})(window);