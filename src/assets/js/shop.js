(function (window) {
    'use strict';

    var _validationAddressSend = false;


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
        // para o botao de assinatura de cad



        // para o carregar da pagina de bag
        if (document.URL.indexOf('shop') > 0 && document.URL.indexOf('bag') > 0) {

            shop.bag.list(function (error, products) {

                // se tenho itens salvos na sacola
                if (products && Array.isArray(products) && products.length > 0) {

                    // os produtos
                    products.forEach(function (product) {

                        var trProduct = document.createElement('tr');

                        var tdImg = document.createElement('td'),
                            tdDescription = document.createElement('td'),
                            tdQuantity = document.createElement('td'),
                            tdRemove = document.createElement('td'),
                            tdValue = document.createElement('td'),
                            tdTotalValue = document.createElement('td');

                        var imgProduct = document.createElement('i'),
                            spanDescription = document.createElement('span'),
                            inputQuantity = document.createElement('input'),
                            imgRemove = document.createElement('i'),
                            spanValue = document.createElement('span'),
                            spanTotalValue = document.createElement('span');


                        imgProduct.classList.add('icon-nav-cad');
                        tdImg.setAttribute('style', 'padding-left: 5px');
                        tdImg.appendChild(imgProduct);

                        spanDescription.textContent = product.name;
                        tdDescription.appendChild(spanDescription);

                        imgRemove.classList.add('icon-remove');
                        imgRemove.dataset.uuid = product.uuid;
                        tdRemove.setAttribute('style', 'padding-left:3px;padding-right: 1px;')
                        tdRemove.appendChild(imgRemove);

                        imgRemove.onclick = function () {

                            var uuid = this.dataset.uuid;

                            this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);

                            c37.library.database.operation.remove('bag', uuid, function (error) {
                                if (calculeTotalAmount() === 0) {

                                    // escondo a mensagem de sacola vazia
                                    document.getElementById('div-bag-empty').classList.remove('hide');

                                    // escondo a tabela
                                    document.getElementById('table-bag-products').classList.add('hide');
                                    document.getElementById('link-bag-redirect').classList.add('hide');

                                }
                            })

                        }


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
                        trProduct.appendChild(tdRemove);
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
        // para o carregar da pagina de bag



        // para o carregar da pagina de checkout
        if (document.URL.indexOf('shop') > 0 && document.URL.indexOf('checkout') > 0) {


            // para o botao de continue em checkout - products
            document.getElementById('button-checkout-products').onclick = function () {
                document.getElementById('collapse-checkout').setSelected('collapse-send');
            }
            // para o botao de continue em checkout - products

            // para o botao de continue em checkout - address send
            document.getElementById('button-checkout-address-send').onclick = function () {

                // removendo os requireds
                document.getElementById('text-user-documment').classList.remove('required');
                document.getElementById('text-user-phone-code').classList.remove('required');
                document.getElementById('text-user-phone-number').classList.remove('required');
                document.getElementById('text-address-street').classList.remove('required');
                document.getElementById('text-address-district').classList.remove('required');
                document.getElementById('text-address-zipcode').classList.remove('required');
                document.getElementById('text-address-city').classList.remove('required');
                document.getElementById('option-address-state').classList.remove('required');
                // removendo os requireds

                var validation = [];

                if (document.getElementById('text-user-documment').value === '') {
                    document.getElementById('text-user-documment').classList.add('required');
                    validation.push('text-user-documment');
                }

                if (document.getElementById('text-user-phone-code').value === '') {
                    document.getElementById('text-user-phone-code').classList.add('required');
                    validation.push('text-user-phone-code');
                }

                if (document.getElementById('text-user-phone-number').value === '') {
                    document.getElementById('text-user-phone-number').classList.add('required');
                    validation.push('text-user-phone-number');
                }

                if (document.getElementById('text-address-street').value === '') {
                    document.getElementById('text-address-street').classList.add('required');
                    validation.push('text-address-street');
                }

                if (document.getElementById('text-address-district').value === '') {
                    document.getElementById('text-address-district').classList.add('required');
                    validation.push('text-address-district');
                }

                if (document.getElementById('text-address-zipcode').value === '') {
                    document.getElementById('text-address-zipcode').classList.add('required');
                    validation.push('text-address-zipcode');
                }

                if (document.getElementById('text-address-city').value === '') {
                    document.getElementById('text-address-city').classList.add('required');
                    validation.push('text-address-city');
                }

                if (document.getElementById('option-address-state').dataset.selected === '') {
                    document.getElementById('option-address-state').classList.add('required');
                    validation.push('option-address-state');
                }

                _validationAddressSend = (validation.length === 0);

                // se estiver tudo verificado
                if (_validationAddressSend) {
                    // vamos para a aba de pagamento
                    document.getElementById('collapse-checkout').setSelected('collapse-payment');
                }

            }
            // para o botao de continue em checkout - address send

            // para o botao de continue em checkout - payment
            document.getElementById('button-checkout-payment').onclick = function () {

                // atualizando a verificacao 
                document.getElementById('button-checkout-address-send').click();

                // esta atualmente validada?
                if (_validationAddressSend) {

                    // removendo os requireds
                    document.getElementById('text-user-credit-card-name').classList.remove('required');
                    document.getElementById('text-user-credit-card-number').classList.remove('required');
                    document.getElementById('text-user-credit-card-code').classList.remove('required');
                    document.getElementById('option-user-credit-card-month').classList.remove('required');
                    document.getElementById('option-user-credit-card-year').classList.remove('required');
                    // removendo os requireds

                    var validation = [];

                    if (document.getElementById('text-user-credit-card-name').value === '') {
                        document.getElementById('text-user-credit-card-name').classList.add('required');
                        validation.push('text-user-credit-card-name');
                    }
                    if (document.getElementById('text-user-credit-card-number').value === '') {
                        document.getElementById('text-user-credit-card-number').classList.add('required');
                        validation.push('text-user-credit-card-number');
                    }
                    if (document.getElementById('text-user-credit-card-code').value === '') {
                        document.getElementById('text-user-credit-card-code').classList.add('required');
                        validation.push('text-user-credit-card-code');
                    }
                    if (document.getElementById('option-user-credit-card-month').dataset.selected === '') {
                        document.getElementById('option-user-credit-card-month').classList.add('required');
                        validation.push('option-user-credit-card-month');
                    }
                    if (document.getElementById('option-user-credit-card-year').dataset.selected === '') {
                        document.getElementById('option-user-credit-card-year').classList.add('required');
                        validation.push('option-user-credit-card-year');
                    }


                    if (validation.length === 0) {

                        var document = {};

                        var address = {

                        };





                    }


                } else {
                    // se nao estiver, votamos para o campo a ser preenchido
                    document.getElementById('collapse-checkout').setSelected('collapse-send');
                }

            }
            // para o botao de continue em checkout - payment


            // preenchendo os produtos selecionados para a compra
            shop.bag.list(function (error, products) {

                // se tenho itens salvos na sacola
                if (products && Array.isArray(products) && products.length > 0) {

                    // os produtos
                    products.forEach(function (product) {

                        var trProduct = document.createElement('tr');

                        var tdImg = document.createElement('td'),
                            tdDescription = document.createElement('td'),
                            tdQuantity = document.createElement('td'),
                            tdValue = document.createElement('td'),
                            tdTotalValue = document.createElement('td');

                        var imgProduct = document.createElement('i'),
                            spanDescription = document.createElement('span'),
                            spantQuantity = document.createElement('span'),
                            spanValue = document.createElement('span'),
                            spanTotalValue = document.createElement('span');


                        imgProduct.classList.add('icon-nav-cad');
                        tdImg.setAttribute('style', 'padding-left: 5px');
                        tdImg.appendChild(imgProduct);


                        spanDescription.textContent = product.name;
                        tdDescription.appendChild(spanDescription);


                        spantQuantity.textContent = product.quantity;
                        tdQuantity.appendChild(spantQuantity);


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

                        document.getElementById('table-checkout-products').querySelector('tbody').appendChild(trProduct);

                    });

                    calculeTotalAmount();


                    document.getElementById('collapse-checkout').classList.remove('hide');

                } else {
                    // se nao, retorno para a a sacola
                    window.location.href = "/shop/bag.html";
                }

            });

        }
        // para o carregar da pagina de checkout

    };


    // para o calculo to valor total da sacola
    function calculeTotalAmount() {

        var totalAmount = 0;

        document.querySelectorAll('.total-value-product').forEach(function (item) {

            // http://stackoverflow.com/questions/10649064/how-to-use-regex-for-currency
            var value = item.textContent.replace(/[^\d\.]/g, '');

            totalAmount += c37.library.utility.math.parseFloat(value, 2);
        });

        // atualizando o valor total para todos os itens
        document.getElementById('strong-total-amount').textContent = 'R$ ' + c37.library.utility.math.parseNumber(totalAmount, 2);

        return totalAmount;

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