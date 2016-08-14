	/**
	 * @class mw.accessibilityToolbar
	 * @singleton
	 */
	mw.accessibilityToolbar = {
	};

	jQuery( document ).ready(function() {
		jQuery.RealAccessability({
			hideOnScroll: false
		});
	});
