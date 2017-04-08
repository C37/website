
(function (window) {

    // quando todo o load de window
    window.addEventListener('load', function () {

        var checkboxs = document.querySelectorAll('div.button.checkbox');

        [].forEach.call(checkboxs, function (checkbox) {

            // os buttons do componente
            var buttons = checkbox.querySelectorAll('button'),
                oldValue = checkbox.dataset.selected;


            [].forEach.call(buttons, function (button) {

                // o load do componente
                if (checkbox.dataset.selected === button.dataset.value) {
                    // add ao button a class de selecionado
                    button.classList.add('selected');
                }

                // o evento click para cada button do componente
                button.onclick = function () {
                    // se este button não está selecionado e não está disabled
                    if ((!this.classList.contains('selected')) && (!this.classList.contains('disabled'))) {
                        // para todos os buttons deste meu componente
                        var buttons = this.parentNode.querySelectorAll('button');

                        // removo a class de seleção
                        [].forEach.call(buttons, function (button) {
                            button.classList.remove('selected');
                        });

                        // add ao button que estou a class de selecionado
                        this.classList.add('selected');
                        // informo ao componente o valor do button selecionado
                        this.parentNode.dataset.selected = this.dataset.value;
                    }
                };

            });

            // para o watch do 'EVENTO' de mudança
            setInterval(function () {
                // o valor inicial vs o valor do momento atual
                if (oldValue !== checkbox.dataset.selected) {
                    
                    oldValue = checkbox.dataset.selected;

                    // para os buttons do componente
                    [].forEach.call(buttons, function (button) {
                        // removo a class de seleção
                        button.classList.remove('selected');
                        // marco o selecionado
                        if (oldValue === button.dataset.value) {
                            // add ao button a class de selecionado
                            button.classList.add('selected');
                        }
                    });

                }

            }, 10);

        });

    });

})(window);