(function (root) {
    'use strict';

    // var _messageQueue = [];

    // https://github.com/eleith/emailjs
    // var emailjs = require("emailjs");



    function initialize(config, callback) {


    };

    function add(attrs) {

        var messageType = attrs.type,
            messageText = attrs.text,
            messagei18n = attrs.i18n,
            messageDetail = attrs.detail || '';

        if (attrs.type === 'success') {
            messageType = 'success';
        } else if (attrs.type === 'info') {
            messageType = 'info'
        } else if (attrs.type === 'warn') {
            messageType = 'warn'
        } else if (attrs.type === 'danger') {
            messageType = 'danger'
        } else if (attrs.type === 'error') {
            messageType = 'error'
        } else {

            c37.library.message.operation.add({
                type: 'danger',
                text: 'Message Type Undefined',
                // i18n: '[html]performance.gcode.text'
            });

            return;

            // throw new Error('message undefined');
        }


        var divMessage = document.createElement('div'),
            divHeader = document.createElement('div'),
            strongTitle = document.createElement('strong'),
            iconAction = document.createElement('i'),
            divContent = document.createElement('div'),
            pText = document.createElement('p'),
            iconSend;

            // https://github.com/electron/electron/blob/master/docs-translations/pt-BR/tutorial/online-offline-events.md
        if (messageType === 'error' && navigator.onLine) {
            iconSend = document.createElement('img');
        }


        divMessage.classList.add('message');
        divMessage.classList.add((messageType === 'error') ? 'danger' : messageType);
        divMessage.style.opacity = 0;

        divMessage.setAttribute('style', 'position: relative; display: table;top: 9px; width:440px; margin: 0 auto; z-index:9999;');

        divHeader.classList.add('header');

        strongTitle.textContent = i18n.t('message.' + ((messageType === 'error') ? 'danger' : messageType) + '.header.text');
        strongTitle.dataset.i18n = 'message.' + ((messageType === 'error') ? 'danger' : messageType) + '.header.text';

        iconAction.classList.add('icon-cancel');
        iconAction.classList.add('action');
        iconAction.onclick = function () {

            if (!this.classList.contains('disabled')) {

                this.classList.add('disabled')


                fade(this.parentNode.parentNode);

                var self = this;

                setTimeout(function () {
                    // http://stackoverflow.com/questions/3387427/remove-element-by-id
                    if (self.parentNode.parentNode.parentElement && self.parentElement.parentElement) {
                        self.parentNode.parentNode.parentElement.removeChild(self.parentElement.parentElement);
                    }
                }, 350);

            }

        };


        if (iconSend) {

            // iconSend.classList.add('icon-cancel');
            iconSend.classList.add('action');
            iconSend.classList.add('hint');
            iconSend.src = 'img/icon/cloud-send.svg';
            iconSend.height = '16';
            iconSend.width = '16';

            iconSend.dataset.i18n = '[data-hint-title]message.header.action.cloud-send.hint.title;[data-hint-text]message.header.action.cloud-send.hint.text';
            // iconSend.dataset.hintTitle = 'message.header.action.cloud-send.hint.title';
            // iconSend.dataset.hintText = 'message.header.action.cloud-send.hint.text';


            // iconSend.style.background = 'url("") no-repeat center/100%;height:20px';
            iconSend.onclick = function () {

                if (!this.classList.contains('disabled')) {

                    iconSend.classList.add('disabled')
                    iconAction.classList.add('disabled')

                    iconSend.setAttribute('style', 'cursor:default !important;opacity:0.5 !important');
                    iconAction.setAttribute('style', 'cursor:default !important;opacity:0.5 !important');

                    // iconSend.style.opacity = "0.5";
                    // iconSend.setAttribute('style', '');


                    var self = this;

                    var server = emailjs.server.connect({
                        host: "email-smtp.us-east-1.amazonaws.com",
                        user: "AKIAJPVJFC5IGNNB5MSA",
                        password: "AsZikalpkbKk+THgmSkjcciiftjCun3/rmr1frsSW8Hb",
                        port: 587,
                        tls: true
                    });


                    server.send({
                        // text: ,
                        from: "C37 - CNC <pi@c37.co>",
                        to: "ciro.maciel@c37.co",
                        subject: "c37-controller-desktop - error - " + new Date().toUTCString(),
                        attachment: [{
                            // https://github.com/eleith/emailjs/issues/150
                            data:  '<html><body><h2>C37 - Controller</h2><div>' + JSON.stringify(messageDetail, undefined, 2) + ' </div> </body> </html>',
                            alternative: true
                        }]
                    }, function (err, message) {
                        // console.log(err || message);

                        Hint.hideTip();
                        fade(self.parentNode.parentNode);


                        setTimeout(function () {
                            // http://stackoverflow.com/questions/3387427/remove-element-by-id
                            self.parentNode.parentNode.parentElement.removeChild(self.parentElement.parentElement);
                        }, 350);

                    });

                }

            };

        }




        divContent.classList.add('content');

        // debugger

        // https://github.com/i18next/i18next/issues/126
        if (messagei18n && messagei18n.length > 1) {
            pText.innerHTML = i18n.t(messagei18n.replace('[html]', ''));
            pText.dataset.i18n = messagei18n;
        } else {
            pText.innerHTML = messageText;
        }


        divHeader.appendChild(strongTitle);
        divHeader.appendChild(iconAction);


        if (iconSend) {
            divHeader.appendChild(iconSend);
        }



        divContent.appendChild(pText);

        divMessage.appendChild(divHeader);
        divMessage.appendChild(divContent);


        document.body.appendChild(divMessage);



        if (iconSend) {

            i18n.translateObject(iconSend.parentElement);

            Hint.to(iconSend);

        }



        unfade(divMessage);


    };


    var message = {
        manager: {
            initialize: initialize
        },
        operation: {
            add: add
        }
    };






    function unfade(element) {
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
    }

    function fade(element) {
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



    // colocando plane dentro dos namespaces C37
    root.c37 = root.c37 || {};
    root.c37.library = root.c37.library || {};
    root.c37.library.message = message;
    // colocando plane dentro dos namespaces C37

})(typeof exports === 'undefined' ? window : exports);