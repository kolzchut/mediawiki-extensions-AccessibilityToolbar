( function () {
	'use strict';
	/**
	 * @class mw.accessibilityToolbar
	 * @singleton
	 */
	mw.accessibilityToolbar = {
	};

	$( function () {
		$.RealAccessability( {
			rootElement: '#content',
			hideOnScroll: false
		} );
	} );
}() );
