(function($) {

    // component group tab
    $.fn.grp_tb = function() {

        // para cada component
        this.each(function(index, component) {

            // jquery for component
            component = $(component)

            // hide all content
            component.find('.cnt > div').hide()

            // find selected and show
            component.find('.cnt > ' + component.find('.tb > ul > li > a.slc').attr('href')).show()

            // events
            component.find('.tb > ul > li > a').on('click', function(){

                // find + hide atual content
                component.find('.cnt > ' + component.find('.tb > ul > li > a.slc').attr('href')).hide()
                // find + deselected atual tab selected
                component.find('.tb > ul > li > a.slc').removeClass('slc')

                // this content show
                component.find('.cnt > ' + $(this).attr('href')).fadeIn()
                // this tab selected
                $(this).addClass('slc')

            })

        })
        // para cada component

        return this;

    };
    // component group tab

}(jQuery));