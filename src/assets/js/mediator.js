// https://github.com/cheton/cnc/blob/master/src/app/controllers/Grbl/Grbl.js
(function (controller, utility) {
    'use strict';

    var store = {};




    // http://www.dofactory.com/javascript/mediator-design-pattern
    // https://addyosmani.com/resources/essentialjsdesignpatterns/book/#mediatorpatternjavascript
    // https://carldanley.com/js-mediator-pattern
    // https://www.safaribooksonline.com/library/view/learning-javascript-design/9781449334840/ch09s06.html


    utility.object.namespace(controller, "mediator");


    controller.mediator = utility.object.event.create();

    controller.mediator.getStatus = (path) => {




    };

    // http://redux.js.org/
    // https://egghead.io/lessons/javascript-redux-react-todo-list-example-adding-a-todo




    // controller.mediator.listen("hi", function (xx) {
    //     console.log(xx);
    // })


    // controller.mediator.notify("hi", {
    //     duru: "edgar"
    // });


    // console.log(controller)






})(c37.application.controller, c37.library.utility);