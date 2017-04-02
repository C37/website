(function (window) {
    'use strict';


    window.addEventListener('load', function(){
        window.c37.application.account.initialize(config, function (status) {
            if (status) {

                // https:gist.github.com/lilo003/206a255c83cede34169c
                // document.querySelectorAll("*").forEach(function (element) {
                //     element.style.outline = "1px solid #" + (~~(Math.random() * (1 << 24))).toString(16);
                // });

                return true;
            }
            throw new Error('application initialize - error');
        });
    });

    window.onerror = function (message, source, lineno, colno, error) {

        console.log(error);

    };





    // http://i18next.github.io/i18next/pages/doc_init.html
    var config = {
        i18n: {
            debug: true,
            load: 'current',
            cookieName: "i18n",
            fallbackLng: 'pt-BR',
            useLocalStorage: false,
            localStorageExpirationTime: 3 * 24 * 60 * 60 * 1000
        }
    };


    var account = {
        initialize: function (config, callback) {

            window.i18n.init(config.i18n, function (err, t) {
                i18n.translateObject(document);
                document.getElementsByTagName('html')[0].setAttribute('lang', i18n.lng());
            });


            window.c37.application.account.user.initialize(config);


            return callback ? callback(true) : true;
        }
    };

    window.c37.library.utility.object.namespace(window, 'c37.application.account', account);


})(window);

