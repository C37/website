(function ($) {

	$.markdownEditor = {
		buttons: {
			'h1' : {'name': 'H1', 'icon':'', callback: function (caret) {caret.prependToLeadingLine('# ');}},
			'h2' : {'name': 'H2', 'icon':'', callback: function (caret) {caret.prependToLeadingLine('## ');}},
			'h3' : {'name': 'H3', 'icon':'', callback: function (caret) {caret.prependToLeadingLine('### ');}},

            'link' : {'name': 'Link', 'icon':'editor-icon-link', callback: function(caret) {caret.wrap('['+caret.text+'](', ')');}},
            'image' : {'name': 'Imagem', 'icon':'icon-picture', callback: function(caret) {caret.wrap('!['+caret.text+'](', ')');}},

            'bold'  : {'name': 'Negrito', 'icon':'editor-icon-bold', callback: function (caret) {caret.wrap('**', '**');}},
			'italic': {'name': 'Italico', 'icon':'editor-icon-italic', callback: function (caret) {caret.wrap('_', '_');}},
			'code'  : {'name': 'Código', 'icon':'editor-icon-code', callback: function (caret) {caret.wrap('`', '`');}},

            'unordered_list': {'name': 'Lista não ordenada', 'icon':'editor-icon-list-ul', callback: function (caret) {caret.prependToLeadingLine('* ');}},
            'ordered_list': {'name': 'Lista ordenada', 'icon':'editor-icon-list-ol', callback: function (caret) {caret.prependToLeadingLine('1. ');}},
            'quote' : {'name': 'Citação', 'icon':'editor-icon-quote', callback: function (caret) {caret.prependToLeadingLine('> ');}},
			'rule' : {'name': 'Quebra de página', 'icon':'editor-icon-rule', callback: function (caret) {caret.wrap('', '\n ***');} },

			'help': {'name': 'Ajuda', 'icon':'editor-icon-help', callback: function () { window.open('http://daringfireball.net/projects/markdown/', '_blank');}}
		},
		toolbars: {
			'default': [['h1','h2','h3'], ['link', 'image'], ['bold','italic', 'code'], ['unordered_list', 'ordered_list', 'quote', 'rule'], ['help'] ]
		}
	};

	$.fn.markdownEditor = function (opts) {
		return $(this).each(function () {
			var $toolbarLoc = opts.toolbarLoc.addClass('me-toolbar-wrapper')
				, toolbar = opts.toolbar
				, $this = $(this).addClass('me-editor')
				, ui = new $.markdownEditor.ui($toolbarLoc, $this)
				, loop
				, that = this;

			$this.on('keydown', function(e) {
				var code = e.keyCode ? e.keyCode : e.which;

				clearTimeout(loop);
				loop = setTimeout(function () {
					$this.preview();
				}, 250);

				if(code == 9) {
					$this.caret().replace("    ", true);
					e.stopPropagation();
					return false;
				}
			});

			ui.rebuildToolbar(toolbar);
		});
	}

	$.markdownEditor.ui = function ($bar, $o) {
		this.$bar = $bar;
		this.$textarea = $o;

		return this;
	}

	$.markdownEditor.ui.prototype.rebuildToolbar = function (toolbar) {
		var layout = $.markdownEditor.toolbars[toolbar]
			, i = layout.length
			, bar = $('<div></div>').prop('class', 'btn-toolbar');

		for (var i = 0; i < layout.length; i++){
			var group = layout[i];
			var out = $("<div></div>").addClass('btn-group');

			for (var j = 0; j < group.length; j++){
			    var key = group[j];
				this.makeButton(key, $.markdownEditor.buttons[key]).appendTo(out);
			}
			out.appendTo(bar);
		}

		this.$bar.html(bar);
	}

	$.markdownEditor.ui.prototype.makeButton = function(key, obj) {
        var button = $("<a></a>").addClass('me-'+key).addClass('btn').addClass('btn-primary').addClass('btn-small').attr('alt', obj.name).click(this.clickHandler(obj.callback));
        button.addClass(obj.btn_class);
        if (obj.icon == '') {
		    button.html(obj.name)
		} else {
		    var icon = $("<i></i>").addClass(obj.icon);
		    button.append(icon);
            button.attr('rel', 'tooltip');
            button.attr('title', obj.name);
            button.tooltip({"placement": "bottom"})
        }
        return button

	}

	$.markdownEditor.ui.prototype.clickHandler = function(callback) {
		var that = this;
		return function (e) { callback.apply(null, [that.$textarea.caret(), that.$textarea]); };
	}

	$.markdownEditor.layout = function (){
	  var source = $('#source');
	  var preview = $('#preview');
	  source.hide();
	  preview.addClass('span12').removeClass('span6');
	}

    $.markdownEditor.ui.adjust = function(){
	    $('#editor').height($(window).height()-160);
	};

	jQuery.event.add(window, "load", $.markdownEditor.ui.adjust);
    jQuery.event.add(window, "resize", $.markdownEditor.ui.adjust);
})(jQuery);
