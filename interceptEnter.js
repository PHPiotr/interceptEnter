(function($) {

	$.interceptEnter = function(options) {

		var settings = $.extend({}, $.interceptEnter.defaults, options);

		$(document).on('focus', settings.element, function() {

			var that	 = $(this);
			var that_value	 = that.val();
			var clone_class	 = settings.clone_class;

			if (that.is('.' + clone_class)) {
				return;
			}

			var clone = $(that.clone()).insertAfter(that);

			// Differentiate clone from its prototype
			clone.addClass(clone_class).focus();

			// Place cursor at the end of the string
			clone.val('');
			clone.val(that_value);

			// Focus on clone, so...
			that.hide();

			clone.blur(function() {

				that.val(clone.val());
				clone.remove();
				that.show();	

			}).keydown(function(e) {

				// Keyup seems to be too late for intercepting form submission
				if (e.keyCode === 13) {
					if (!settings.canSubmitOnEnter.call(this)) {
						// Submission prevented by canSubmitOnEnter() returning "false"
						$('form').submit(function() {
                                                        return false;
                                                });
						return false;
					}
				}

			}).keyup(function() {

				// Don't loose original value!
				that.val(clone.val());
			});
		});
	};

	$.interceptEnter.defaults = {
		element: 'input[type="text"]',	
		clone_class: 'clone',
		canSubmitOnEnter: function() {}
	};

}(jQuery));