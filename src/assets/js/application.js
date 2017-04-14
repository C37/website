(function (window) {
    'use strict';


    window.addEventListener('load', function () {
        window.c37.application.website.initialize(config, function (status) {
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

        console.error(error);

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
        },
        database: {
            name: 'C37-WEBSITE',
            debug: true,
            version: 1,
            stores: {
                settings: {
                    uuid: {
                        'type': 'string',
                        'index': true
                    },
                    value: {
                        'type': 'string',
                        'index': false
                    }
                },
                // https://bitbucket.org/C37/cam/src/7830f68e72d77fc88cb9ac1d42ad7effcc481d1d/src/js/application.js?at=v3&fileviewer=file-view-default#application.js-12
                session: {
                    email: {
                        'type': 'string',
                        'index': true
                    },
                    "signed-in": {
                        'type': 'datetime',
                        'index': false
                    }
                },
                user: {
                    uuid: {
                        'type': 'string',
                        'index': true
                    },
                    email: {
                        'type': 'string',
                        'index': true
                    }
                },
                bag:{
                    uuid: {
                        'type': 'string',
                        'index': true
                    },
                    name: {
                        'type': 'string',
                        'index': true
                    },
                    value: {
                        'type': 'number',
                        'index': false
                    },
                    quantity: {
                        'type': 'number',
                        'index': false
                    }
                },
                order: {
                    uuid: {
                        'type': 'string',
                        'index': true
                    }
                }
            }
        }
    };


    var website = {
        initialize: function (config, callback) {
            c37.library.database.manager.initialize(config.database, function (error) {
                if (!error) {

                    window.i18n.init(config.i18n, function (err, t) {
                        i18n.translateObject(document);
                        document.getElementsByTagName('html')[0].setAttribute('lang', i18n.lng());
                    });


                    window.c37.application.website.user.initialize(config);
                    window.c37.application.website.shop.initialize(config);


                    return callback ? callback(true) : true;

                }
                throw new Error('Application - Initialize - Failed to Initialize the Local Database \n http://website.c37.co/docs/errors.html#' + 'application-initialize');
            });
        }
    };

    window.c37.library.utility.object.namespace(window, 'c37.application.website', website);


})(window);