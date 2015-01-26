(function() {
    // make resolution of navigator
    function resolution() {
        var device = ''

        if ($(window).width() >= 1200) {
            device = 'desktop +++'
        } else if ($(window).width() >= 768 && $(window).width() <= 1199) {
            device = 'paisagem tablet + retrato desktop'
        } else if ($(window).width() <= 767) {
            device = '--- mobile + retrato tablet'
        }

        $(".rsln").html("<small>device: " + device + " width: " + $(window).width() + " height: " + $(window).height() + "<small>")
    }

    // dom carregado ...
    $(document).ready(function() {

        // make resolution of navigator
        resolution()


        // search in header
        $('.srh > input').focus(function() {
            $(this).animate({ width: "300px"}, 100)
        })

        $('.srh > input').blur(function() {
            $(this).animate({ width: "220px"}, 100)
        })
        // search in header


        // format date
        $(".dt-cln").text(function(){ // calendar
            if (($(this).text() != "") && (moment($(this).text()).isValid())) {
                return moment($(this).text()).calendar()
            }
        })
        // format date


        // foccus in page
        $('input[name="name_user_email"]').focus()

        // foccus in page


        // init of all components
        $('select').select()
        $('.tag').tag()
        $('.grp-tb').grp_tb()

        $('.sld').eislideshow({
            animation			: 'center',
            autoplay			: true,
            slideshow_interval	: 3000,
            thumbMaxWidth       : 300,
            titlesFactor		: 0
        });
        $('.mn-scr > ul').iconmenu()
    //$('.tooltip-bottom').tooltip({
    //    placement: "bottom"
        // init of all components

    });

    // quando resize
    $(window).resize(function() {
        resolution()
    })

}).call(this)