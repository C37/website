(function($) {

    $.fn.tag = function() {

        return this.each(function() {
            var $this = $(this)

            // tag and click == input focus
            $this.tag = $('<ul class="tg">')
                            .click(function() {
                                $(this).find('input[type="text"]').focus()
                            })
            // hide original object
            $this.hide()

            // for input value
            $this.input_value = $('<input>')
                                    .attr('type', 'hidden')
                                    .attr('name', $this.attr('name'))
            // append in tag
            $this.tag.append($this.input_value)

            // for input word
            $this.input_word = $('<input>')
                                    .attr('type', 'text')
                                    .keydown(function(e) { // tecla pressionada
                                        if (e.which == 13) { // enter key
                                            // stop event cascated
                                            e.preventDefault()
                                            // add this for make tag
                                            tag_add($this, $(this).val())
                                        } else if (e.which == 8) { // backspace
                                            $(this).width($(this).width() - 5)
                                            if ($(this).val() == '') {
                                                tag_remove($this, null)
                                            }
                                        } else { // another keys
                                            $(this).width($(this).width() + 9)
                                        }
                                    })
                                    .blur(function(e) { // ao sair do campo
                                        // stop event cascated
                                        e.preventDefault()
                                        // add this for make tag
                                        tag_add($this, $(this).val())
                                    })
            // append in tag
            $this.tag.append($this.input_word)

            // for word in dom
            if ($this.val() != '') {
                // for cada word
                for(var i=0; i < $this.val().split(' ').length; i++) {
                    tag_add($this, $this.val().split(' ')[i])
                }
            }

            // include in dom
            $this.after($this.tag)

            // remove original object
            $this.remove()
        })
    }

    function tag_add($obj, word) {
        // trim in word
        word = $.trim(word)

        // verify value?
        if ((word != '') && (word != undefined) && (tag_exists($obj, word) == null)) {

            var item_remove = $('<span>')
                                    .append('\xd7')
                                    .click(function(e) {
                                        tag_remove($obj, this)
                                    }),
                item = $('<li>')
                            .addClass('tg-tm')
                            .append(word)
                            .append(item_remove)

            // append in tag
            $obj.tag.append(item)

            // append in input for new value
            $obj.input_value[0].value += ($obj.input_value[0].value == '') ? word : ' ' + word
        }

        input_word_reset($obj)
    }

    function input_word_reset($obj) {
        if ($obj.input_word.val() != '') {
            $obj.input_word.focus()
        }
        $obj.input_word.val('') // clear word in edit
        $obj.input_word.width(10) // reset size
    }

    function tag_exists($obj, word) {
        // for all tags
        for(var i=0; i < $obj.tag.find('li').length; i++) {
            if ($obj.tag.find('li')[i].innerText.replace('\xd7', '') === word) {
                return true
            }
        }
        return null;
    }

    function tag_remove($obj, item) {
        // find && clear word
        var word = item ? $(item).parent().text() : $obj.tag.find('li').last().text()
        word = word.replace('\xd7', '')

        // update value in input hidden
        $obj.input_value[0].value = $obj.input_value[0].value.replace(' ' + word, '')
        $obj.input_value[0].value = $obj.input_value[0].value.replace(word, '')

        if (item) {
            $(item).parent().remove()
        } else {
            $obj.tag.find('li').last().remove()
            input_word_reset($obj)
        }
    }

})(jQuery);