(function (window) {
    'use strict';


    function events() {

        // verificando se temos usuario logado
        c37.library.database.operation.list('profile', function (error, data) {

            if (data && Array.isArray(data) && data.length > 0) {

                document.querySelectorAll('.button-signin').forEach(function (button) {
                    button.classList.add('hide');
                });

                document.querySelectorAll('.button-account').forEach(function (button) {
                    button.querySelector('a>span').textContent = `${data[0]["first-name"]} ${data[0]["last-name"]}`;
                    button.classList.remove('hide');
                });

            }

        });

        document.querySelectorAll('.button-signin').forEach(function (button) {
            // addEventListener - para manter a heranca dos eventos
            button.addEventListener('click', function () {
                user.auth.show();
            });
        });

        // para tab de user-auth
        document.getElementById('tab-user-auth').addEventListener('active', function (e) {

            if (e.detail.type === 'signin') {
                document.getElementById('text-user-signin').classList.remove('hide');
                document.getElementById('text-user-signup').classList.add('hide');

                document.getElementById('button-user-auth-signin').classList.remove('hide');
                document.getElementById('button-user-auth-signup').classList.add('hide');

                document.getElementById('text-user-signin-email').focus();
            }
            if (e.detail.type === 'signup') {
                document.getElementById('text-user-signin').classList.add('hide');
                document.getElementById('text-user-signup').classList.remove('hide');

                document.getElementById('button-user-auth-signin').classList.add('hide');
                document.getElementById('button-user-auth-signup').classList.remove('hide');

                document.getElementById('text-user-signup-first-name').focus();
            }

            document.getElementById('text-user-signin-email').classList.remove('required');
            document.getElementById('text-user-signin-password').classList.remove('required');

            document.getElementById('text-user-signup-first-name').classList.remove('required');
            document.getElementById('text-user-signup-last-name').classList.remove('required');
            document.getElementById('text-user-signup-email').classList.remove('required');
            document.getElementById('text-user-signup-password').classList.remove('required');

            // para o tamanho do dialog
            dialog.hide();
            dialog.show();

        });
        // para tab de user-auth

        // para button signin de user-auth
        document.getElementById('button-user-auth-signin').onclick = function () {

            var validationComplete = true;

            document.getElementById('text-user-signin-email').classList.remove('required');
            document.getElementById('text-user-signin-password').classList.remove('required');

            if (document.getElementById('text-user-signin-email').value === '') {
                document.getElementById('text-user-signin-email').classList.add('required');
                validationComplete = false;
            }
            if (document.getElementById('text-user-signin-password').value === '') {
                document.getElementById('text-user-signin-password').classList.add('required');
                validationComplete = false;
            }

            if (validationComplete) {

                // https://github.com/settings/security
                var signin = {
                    'email': document.getElementById('text-user-signin-email').value,
                    'password': document.getElementById('text-user-signin-password').value,
                    'session': {
                        'ip': c37.library.utility.net.info.data.ip,
                        'location': c37.library.utility.net.info.data.city + ', ' + c37.library.utility.net.info.data.region_name + ', ' + c37.library.utility.net.info.data.country_name,
                        'signed-in': new Date().toUTCString(),
                        'agent': navigator.userAgent
                    }
                };

                document.getElementById('img-user-auth-loader').classList.remove('hide');
                document.getElementById('button-user-auth-signin').classList.add('disabled');

                c37.library.utility.net.request({
                    method: "POST",
                    url: "https://us-central1-c37-account.cloudfunctions.net/auth",
                    body: JSON.stringify(signin)
                }).then(data => {

                    document.getElementById('img-user-auth-loader').classList.add('hide');
                    document.getElementById('button-user-auth-signin').classList.remove('disabled');

                    // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie ???
                    if (data.code === 200) {

                        // console.log(JSON.parse(data.message))
                        var data = JSON.parse(data.message);

                        var session = {
                            uuid: data.uuid,
                            email: signin.email,
                            "signed-in": signin.session["signed-in"]
                        };

                        c37.library.database.operation.add('session', session.email, session, function (error) {
                            if (!error) {

                                var profile = {
                                    uuid: data.uuid,
                                    email: signin.email,
                                    "first-name": data["first-name"],
                                    "last-name": data["last-name"]
                                };

                                c37.library.database.operation.add('profile', profile.email, profile, function (error) {
                                    if (!error) {

                                        document.querySelectorAll('.button-signin').forEach(function (button) {
                                            button.classList.add('hide');
                                        });

                                        document.querySelectorAll('.button-account').forEach(function (button) {
                                            button.querySelector('a').textContent = `${data["first-name"]} ${data["last-name"]}`;
                                            button.classList.remove('hide');
                                        });

                                        dialog.hide();

                                    } else {
                                        throw new Error('Session - Save - Failed to Save Session into Local Database');
                                    }
                                });

                            } else {
                                throw new Error('Session - Save - Failed to Save Session into Local Database');
                            }
                        });

                    }

                });

            }

        };
        // para button signin de user-auth

        // para button signup de user-auth
        document.getElementById('button-user-auth-signup').onclick = function () {

            var validationComplete = true;

            document.getElementById('text-user-signup-first-name').classList.remove('required');
            document.getElementById('text-user-signup-last-name').classList.remove('required');
            document.getElementById('text-user-signup-email').classList.remove('required');
            document.getElementById('text-user-signup-password').classList.remove('required');

            if (document.getElementById('text-user-signup-first-name').value === '') {
                document.getElementById('text-user-signup-first-name').classList.add('required');
                validationComplete = false;
            }
            if (document.getElementById('text-user-signup-last-name').value === '') {
                document.getElementById('text-user-signup-last-name').classList.add('required');
                validationComplete = false;

            }
            if (document.getElementById('text-user-signup-email').value === '') {
                document.getElementById('text-user-signup-email').classList.add('required');
                validationComplete = false;
            }
            if (document.getElementById('text-user-signup-password').value === '') {
                document.getElementById('text-user-signup-password').classList.add('required');
                validationComplete = false;
            }

            if (validationComplete) {

                var user = {
                    'first-name': document.getElementById('text-user-signup-first-name').value,
                    'last-name': document.getElementById('text-user-signup-last-name').value,
                    'email': document.getElementById('text-user-signup-email').value,
                    'password': document.getElementById('text-user-signup-password').value,
                    'i18n': window.navigator.language
                };

                document.getElementById('img-user-auth-loader').classList.remove('hide');
                document.getElementById('button-user-auth-signup').classList.add('disabled');

                c37.library.utility.net.request({
                    method: "POST",
                    json: false,
                    url: "https://us-central1-c37-account.cloudfunctions.net/user",
                    body: JSON.stringify(user)
                }).then(data => {

                    document.getElementById('img-user-auth-loader').classList.add('hide');
                    document.getElementById('button-user-auth-signin').classList.remove('disabled');

                    if (data.code === 201) {

                        document.getElementById('tab-user-auth').setActive('signin');

                        document.getElementById('text-user-signin-email').value = document.getElementById('text-user-signup-email').value;
                        document.getElementById('text-user-signin-password').value = document.getElementById('text-user-signup-password').value;

                        document.getElementById('text-user-signup-first-name').value = '';
                        document.getElementById('text-user-signup-last-name').value = '';
                        document.getElementById('text-user-signup-email').value = '';
                        document.getElementById('text-user-signup-password').value = '';

                        c37.library.message.operation.add({
                            type: 'success',
                            text: 'Enviamos um e-mail para o endereço informado para confirmar seu cadastro.'
                        });

                    }

                });

            }

        };
        // para button signup de user-auth


    }

    var dialog = {
        show: function () {

            document.getElementById('dialog-user-auth').showModal();

            document.getElementById('text-user-signin-email').focus();

            document.getElementById('button-user-auth-close').onclick = function () {

                document.getElementById('dialog-user-auth').close();

            }

        },
        hide: function () {

            document.getElementById('dialog-user-auth').close();


        }
    }


    var user = {
        initialize: function (config) {

            events();


        },
        auth: {
            show: dialog.show,
            hide: dialog.hide
        }
    };


            window.c37.library.utility.object.namespace(window, 'c37.application.website.user', user);


        })(window);