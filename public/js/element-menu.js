(function() {

    $(document).ready(function() {

        // menu drop down
        $('.mn-dp-dwn').click(function(){
            if ($(this).find('.mn').is(":visible")) {

                $(this).removeClass('prs')
                $(this).find('.mn').hide()

            } else {
                $(this).find('.mn').show()
                $(this).addClass('prs')
            }
        })

        $(document).mouseup(function(e) {
            if (($(e.target).parent(".mn-dp-dwn").length==0) &&
                ($(e.target).parent().parent(".mn").length==0)) {

                $(this).find('.mn').hide()
                $(this).find('.mn').parent().removeClass('prs')

            }
        });

        // image in mn-dp-dwn not hover
        $('.mn-dp-dwn').find('> i').css('opacity', 1)
        // find icon
        $('.mn-dp-dwn').find('.mn > .tm').mouseenter(function() {
            var cll = $(this).find('a > i')[0].className

            $(this).find('a > i').removeClass(cll)
            cll = cll.replace('bl', 'wht')
            $(this).find('a > i').addClass(cll)
        })
        $('.mn-dp-dwn').find('.mn > .tm').mouseleave(function() {
            var cll = $(this).find('a > i')[0].className

            $(this).find('a > i').removeClass(cll)
            cll = cll.replace('wht', 'bl')
            $(this).find('a > i').addClass(cll)
        })
        // menu drop down


        // button & link = for icon not opacity
        $('button').find('> i').css('opacity', 1)

    });

}).call(this)
