	/**
	 * @class mw.accessibilityToolbar
	 * @singleton
	 */
	mw.accessibilityToolbar = {
	};

	jQuery( document ).ready(function() {
		jQuery.RealAccessability({
			rootElement: '#bodyWrapper',
			hideOnScroll: false
		});
	});
