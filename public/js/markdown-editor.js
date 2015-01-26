(function ($) {

	$.markdownEditor = {
		buttons: {
			'h1' : {'name': 'h1', 'icon':'', callback: function (caret) {caret.prependToLeadingLine('# ');}},
			'h2' : {'name': 'h2', 'icon':'', callback: function (caret) {caret.prependToLeadingLine('## ');}},
			'h3' : {'name': 'h3', 'icon':'', callback: function (caret) {caret.prependToLeadingLine('### ');}},

            'link' : {'name': 'Link', 'icon':'cn-dtr-lnk-bl', callback: function(caret) {caret.wrap('['+caret.text+'](', ')');}},
            'image' : {'name': 'Imagem', 'icon':'cn-dtr-mg-bl', callback: function(caret) {caret.wrap('!['+caret.text+'](', ')');}},

            'bold'  : {'name': 'Negrito', 'icon':'cn-dtr-bld-bl', callback: function (caret) {caret.wrap('**', '**');}},
			'italic': {'name': 'Italico', 'icon':'cn-dtr-tlc-bl', callback: function (caret) {caret.wrap('_', '_');}},
			'code'  : {'name': 'Código', 'icon':'cn-dtr-cd-bl', callback: function (caret) {caret.wrap('`', '`');}},

            'unordered_list': {'name': 'Lista não ordenada', 'icon':'cn-dtr-url-bl', callback: function (caret) {caret.prependToLeadingLine('* ');}},
            'ordered_list': {'name': 'Lista ordenada', 'icon':'cn-dtr-rdl-bl', callback: function (caret) {caret.prependToLeadingLine('1. ');}},
            'quote' : {'name': 'Citação', 'icon':'cn-dtr-qut-bl', callback: function (caret) {caret.prependToLeadingLine('> ');}},
			'rule' : {'name': 'Quebra de página', 'icon':'cn-dtr-rl-bl', callback: function (caret) {caret.wrap('', '\n ***');} },

			'help': {'name': 'Ajuda', 'icon':'cn-dtr-hlp-bl', callback: function () { window.open('http://daringfireball.net/projects/markdown/', '_blank');}}
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
                , bar = $('<div style="margin-top: 11px"></div>')

		for (var i = 0; i < layout.length; i++){
			var group = layout[i];
			var out = $("<div></div>").addClass('btn-grp');

			for (var j = 0; j < group.length; j++){
			    var key = group[j];
				this.makeButton(key, $.markdownEditor.buttons[key]).appendTo(out);
			}
			out.appendTo(bar);
		}

		this.$bar.html(bar);
	}

	$.markdownEditor.ui.prototype.makeButton = function(key, obj) {
        var button = $("<a></a>").addClass('me-'+key).addClass('btn').attr('alt', obj.name).click(this.clickHandler(obj.callback));
        button.addClass(obj.btn_class);
        if (obj.icon == '') {
		    button.html(obj.name)
		} else {
		    var icon = $("<i></i>").addClass(obj.icon);
		    button.append(icon);
            button.attr('rel', 'tooltip');
            button.attr('title', obj.name);
            //button.tooltip({"placement": "bottom"}) lilo003
        }
        return button;

	}

	$.markdownEditor.ui.prototype.clickHandler = function(callback) {
		var that = this;
		return function (e) { callback.apply(null, [that.$textarea.caret(), that.$textarea]); };
	}

	$.markdownEditor.layout = function (){
	  //var source = $('#source');
	  var preview = $('#preview');
	  //source.hide();
	  preview.addClass('span12').removeClass('span6');
	}

    $.markdownEditor.ui.adjust = function(){
	    $('#editor').height($(window).height()-160);
	};

	jQuery.event.add(window, "load", $.markdownEditor.ui.adjust);
    jQuery.event.add(window, "resize", $.markdownEditor.ui.adjust);
})(jQuery);
