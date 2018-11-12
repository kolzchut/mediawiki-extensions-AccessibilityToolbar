( function ( mw, $ ) {
	'use strict';
	/**
	 * @class mw.accessibilityToolbar
	 * @singleton
	 */
	mw.accessibilityToolbar = {
	};

	$( document ).ready( function() {
		$.RealAccessability( {
			rootElement: '#bodyWrapper',
			hideOnScroll: false
		} );
	} );
}( mediaWiki, $ ) );
