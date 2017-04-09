(function (window) {
    'use strict';

    function events() {

        // para o botao de assinatura de cad
        if (document.URL.indexOf('cad') > 0) {
            document.getElementById('button-cad-subscribe').onclick = function () {

                var product = {
                    // uuid: c37.library.utility.math.uuid(16, 16),
                    uuid: '182f2ded6d07ec4b',
                    name: '	Assinatura C37 - CAD',
                    value: 1.09,
                    quantity: 1
                };

                shop.bag.add(product, function () {
                    window.location.href = "/shop/bag.html";
                });

            };
        }

        // para o carregar da pagina de bag
        if (document.URL.indexOf('shop') > 0 && document.URL.indexOf('bag') > 0) {

            shop.bag.list(function (error, products) {

                // se tenho itens salvos na sacola
                if (products && Array.isArray(products) && products.length > 0) {

                    products.forEach(function (product) {


                        var trProduct = document.createElement('tr');

                        var tdImg = document.createElement('td'),
                            tdDescription = document.createElement('td'),
                            tdQuantity = document.createElement('td'),
                            tdValue = document.createElement('td'),
                            tdTotalValue = document.createElement('td');

                        var imgProduct = document.createElement('i'),
                            spanDescription = document.createElement('span'),
                            inputQuantity = document.createElement('input'),
                            spanValue = document.createElement('span'),
                            spanTotalValue = document.createElement('span');


                        imgProduct.classList.add('icon-nav-cad');
                        tdImg.setAttribute('style', 'padding-left: 5px');
                        tdImg.appendChild(imgProduct);

                        spanDescription.textContent = product.name;
                        tdDescription.appendChild(spanDescription);

                        inputQuantity.type = "number";
                        inputQuantity.value = product.quantity;
                        inputQuantity.min = '1';
                        inputQuantity.increment = '1';
                        inputQuantity.setAttribute('style', 'padding:0;margin:0px!important;');
                        tdQuantity.setAttribute('style', 'width:40px;');
                        tdQuantity.appendChild(inputQuantity);

                        inputQuantity.onclick = inputQuantity.onchange = function () {

                            // atualizando a quantidade no produto
                            product.quantity = this.value;

                            // realizando os calculos para os valores
                            var actualTotalValue = product.value * product.quantity;

                            // atualizando o valor total para o item 
                            spanTotalValue.textContent = 'R$ ' + c37.library.utility.math.parseNumber(actualTotalValue, 2);

                            // atualizando o valor total para todos os itens
                            document.getElementById('strong-total-amount').textContent = 'R$ ' + c37.library.utility.math.parseNumber(actualTotalValue, 2);

                            // atualizando o valor da quantidade do determinado item no banco de dados
                            c37.library.database.operation.add('bag', product.uuid, product);

                            calculeTotalAmount();

                        }



                        spanValue.textContent = 'R$ ' + c37.library.utility.math.parseNumber(product.value, 2);
                        tdValue.classList.add('text-right');
                        tdValue.setAttribute('style', 'width:110px');
                        tdValue.appendChild(spanValue);


                        spanTotalValue.textContent = 'R$ ' + c37.library.utility.math.parseNumber(product.value * product.quantity, 2);
                        tdTotalValue.classList.add('text-right');
                        tdTotalValue.classList.add('total-value-product');
                        tdTotalValue.setAttribute('style', 'width:110px');
                        tdTotalValue.appendChild(spanTotalValue);


                        trProduct.appendChild(tdImg);
                        trProduct.appendChild(tdDescription);
                        trProduct.appendChild(tdQuantity);
                        trProduct.appendChild(tdValue);
                        trProduct.appendChild(tdTotalValue);

                        document.getElementById('table-bag-products').querySelector('tbody').appendChild(trProduct);

                    });

                    calculeTotalAmount();

                    // escondo o loader
                    document.getElementById('div-bag-verify').classList.add('hide');

                    // mostro a tabela
                    document.getElementById('table-bag-products').classList.remove('hide');
                    document.getElementById('link-bag-redirect').classList.remove('hide');

                } else {
                    // escondo o loader
                    document.getElementById('div-bag-verify').classList.add('hide');

                    // escondo a mensagem de sacola vazia
                    document.getElementById('div-bag-empty').classList.remove('hide');
                }

            });

        }

    };


    function calculeTotalAmount() {

        var totalAmount = 0;

        document.querySelectorAll('.total-value-product').forEach(function (item) {

            // http://stackoverflow.com/questions/10649064/how-to-use-regex-for-currency
            var value = item.textContent.replace(/[^\d\.]/g,'');

            totalAmount += c37.library.utility.math.parseFloat(value, 2);
        });

        // atualizando o valor total para todos os itens
        document.getElementById('strong-total-amount').textContent = 'R$ ' + c37.library.utility.math.parseNumber(totalAmount, 2);


    }



    // http://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
    function htmlToElement(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
    }


    var shop = {
        initialize: function (config) {

            events();

        },
        bag: {
            add: function (product, callback) {

                c37.library.database.operation.get('bag', product.uuid, function (error, doc) {
                    if (!error && !doc) {
                        var item = {
                            uuid: product.uuid,
                            name: product.name,
                            value: product.value,
                            quantity: product.quantity
                        }

                        c37.library.database.operation.add('bag', item.uuid, item, function (error) {
                            if (!error) {
                                return callback(true);
                            }
                            throw new Error('Application - Shop - Bag - Failed to Save in the Local Database');
                        });
                    }
                    return callback(true);
                });

            },
            get: function (uuid) {

                return _products[uuid];

            },
            remove: function (uuid) {

                return delete _products[uuid];

            },
            list: function (callback) {

                c37.library.database.operation.list('bag', function (error, data) {
                    return callback(error, data);
                });

            }
        }
    };




    window.c37.library.utility.object.namespace(window, 'c37.application.website.shop', shop);


})(window);