(function($) {

    $.fn.select = function() {
        return this.each(function() {
            var $this = $(this)

            // hide original object
            $this.hide()

            var select = $('<div>') // para select
                            .addClass('mn-dp-dwn')
                            .append($('<span>').addClass('dpy').append($this.find('option.dft').html())) // default item
                            .append($('<span>').addClass('ds')) // drop symbol
                            .append($('<input>').attr('name', $this.attr('name')).attr('type', 'hidden').val('')), // input value = ''
                menu = $('<div>') // para menu
                            .addClass('mn')
                            .addClass('rgt')
                            .append($('<div>').addClass('hdr') // para header
                                .append($this.find('option.ttl').html())
                                .append($('<i>').addClass('cn-cmp-cl-bk').addClass('rgt')))

            // para itens
            $this.find('option').each(function(i, option) {
                // se não default and não title
                if ((!$(option).hasClass('dft')) && (!$(option).hasClass('ttl'))) {

                    // html of item
                    var item = $('<div>')
                        .addClass('tm')
                        .append($(option).html())
                        .append($('<input>').attr('type', 'hidden').val($(option).val()))

                    // selected this item ?
                    if ($(option).attr('selected')) {
                        select.find('span[class="dpy"]').html($(option).html())
                        select.find('input[type="hidden"]').val($(option).val())
                        // add selected class
                        item.addClass('slc')
                    }

                    // events of item
                    item.on('click', function() {
                        // remove all selected class
                        $(this).parent().parent().find('div.tm').removeClass('slc')

                        // verify to value
                        var item_value = ($(this).find('input[type="hidden"]').val() == undefined &&
                            $(this).find('input[type="hidden"]').val() == '') ? $(this).html() : $(this).find('input[type="hidden"]').val()

                        $(this).parent().parent().find('span[class="dpy"]').html($(this).html())
                        $(this).parent().parent().find('input[type="hidden"]').val(item_value)

                        // add selected class
                        $(this).addClass('slc')

                        // trigger click em menu
                        $(this).parent().parent('.mn-dp-dwn').click()
                    })

                    // incluindo itens no menu
                    menu.append(item)

                }
            })

            // include menu in select
            select.append(menu)

            // events of select
            select.on('click', function() {
                if ($(this).find('.mn').is(":visible")) {
                    $(this).removeClass('prs')
                    $(this).find('.mn').hide()

                } else {
                    $(this).find('.mn').show()
                    $(this).addClass('prs')
                }
            })

            // include in dom
            $this.after(select)

            // remove original object
            $this.remove()
        })
    }

})(jQuery);