(function (root) {
    'use strict';

    // quando todo o load de window
    window.addEventListener('load', function () {

        var optionsGroup = document.querySelectorAll('div.option-group');

        [].forEach.call(optionsGroup, function (optionGroup) {

            // e do tipo de selecao
            var isSelected = optionGroup.dataset.hasOwnProperty("selected");


            // para mostrar o menu
            optionGroup.onclick = function (e) {
                e.stopPropagation();

                this.querySelector(".menu").style.display = "block";
            };

            // para o set do valor
            optionGroup.setSelected = setSelected;

            // os itens do componente
            var itens = optionGroup.querySelectorAll('li');

            // para cada item de list
            [].forEach.call(itens, function (item) {

                if (isSelected) {
                    // no load do componente verifico se ele esta selecionado
                    if (optionGroup.dataset.selected === item.dataset.value) {
                        // add ao item a class de selecionado
                        item.classList.add('selected');
                    }
                }

                // o evento click para cada list do componente
                item.onclick = function (e) {
                    // se este button não está selecionado e não está disabled
                    if ((!this.classList.contains('selected')) && (!this.classList.contains('disabled'))) {

                        e.stopPropagation();

                        // para todos os buttons deste meu componente
                        var itens = this.parentNode.querySelectorAll('li');

                        // removo a class de seleção
                        [].forEach.call(itens, function (item) {
                            item.classList.remove('selected');
                        });

                        if (isSelected) {
                            // add ao button que estou a class de selecionado
                            this.classList.add('selected');

                            // informo ao componente o valor do button selecionado
                            // acho que esta duplicado e nao funciona
                            // this.parentNode.dataset.selected = this.dataset.value;

                            // vou montar a selecao do iten
                            var textContent = (this.querySelector('a') || this.querySelector('span')) ? (this.querySelector('a') || this.querySelector('span')).textContent : null,
                                imgContent = this.querySelector('img') ? this.querySelector('img').getAttribute('src') : null;

                                // debugger

                            // neste momento sem display
                            if (this.parentNode.parentNode.parentNode.parentNode.querySelector('strong')) {
                                this.parentNode.parentNode.parentNode.parentNode.querySelector('strong').textContent = textContent;
                            }
                            if (this.parentNode.parentNode.parentNode.parentNode.querySelector('img')) {
                                this.parentNode.parentNode.parentNode.parentNode.querySelector('img').setAttribute('src', imgContent);
                            }


                            // informo ao componente o valor do button selecionado
                            this.parentNode.parentNode.parentNode.parentNode.dataset.selected = this.dataset.value;
                        }

                        // debugger

                        // escondo o menu com os itens
                        this.parentNode.parentNode.parentNode.style.display = "none";


                        // para o evento do item escolhido
                        // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
                        var event = new CustomEvent('selected', {
                            'detail': {
                                'value': this.dataset.value,
                                'item': this
                            }
                        });

                        optionGroup.dispatchEvent(event);

                    }
                };

            });


        });

    });


    window.addEventListener('click', function () {
        closeMenus();
    });

    window.addEventListener('keydown', function (e) {

        // ESCAPE key pressed
        if (e.keyCode == 27) {
            closeMenus();
        }
    })

    function closeMenus() {

        // debugger

        var menus = document.querySelectorAll('div.option-group > .menu');

        // para cada item de list
        [].forEach.call(menus, function (menu) {

            // escondo o menu com os itens
            menu.style.display = "none";

        });

    }
 
    function setSelected(value) {

        var optionGroup = this;

        // os itens do componente
        var itens = optionGroup.querySelectorAll('li');

        // para cada item de list
        [].forEach.call(itens, function (item) {

            // clear quarquer selecionado
            item.classList.remove('selected');

            // no load do componente verifico se ele esta selecionado
            if (value === item.dataset.value) {
                // add ao list a class de selecionado
                item.classList.add('selected');

                // vou montar a selecao do iten
                var textContent = (optionGroup.querySelector('a') || optionGroup.querySelector('span')).textContent,
                    imgContent = item.querySelector('img').getAttribute('src');

                // neste momento sem display
                // optionGroup.parentNode.parentNode.parentNode.parentNode.querySelector('strong').textContent = textContent;
                optionGroup.querySelector('img').setAttribute('src', imgContent);

                // informo ao componente o valor do button selecionado
                optionGroup.dataset.selected = value;

            }

        });

    }


})(typeof exports === 'undefined' ? window : exports);