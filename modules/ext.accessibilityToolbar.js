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
			rootElement: '#bodyWrapper',
			hideOnScroll: false
		} );
	} );
}() );
