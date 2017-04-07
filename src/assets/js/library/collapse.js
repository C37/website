(function (window) {
    'use strict';

    function registerCollapse() {

        var collapses = document.querySelectorAll('.collapse');

        // console.log(tabs);

        collapses.forEach(function (collapse) {

            collapse.querySelectorAll('h4>a').forEach(function (item) {

                item.onclick = function (e) {

                    var target = '';

                    collapse.querySelectorAll('h4>a').forEach(function (item) {

                        if (item.classList.contains('selected')) {
                            target = item.rel;
                        }

                        item.classList.remove('selected');
                        document.getElementById(item.rel).classList.add('hide');
                    });

                    if (target !== this.rel) {
                        this.classList.add('selected');
                        document.getElementById(this.rel).classList.remove('hide');
                    }
                }

            });

        });

    }











    window.addEventListener('load', function () {

        registerCollapse();

    });


    window.addEventListener('click', function () {

    });

    window.addEventListener('keydown', function (e) {

    })

})(window);