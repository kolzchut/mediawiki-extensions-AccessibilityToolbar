	/**
	 * @class mw.accessibilityToolbar
	 * @singleton
	 */
	mw.accessibilityToolbar = {
	};

	jQuery( document ).ready(function() {
		jQuery.RealAccessability({
			rootElement: '.mw-body',
			hideOnScroll: false
		});
	});
