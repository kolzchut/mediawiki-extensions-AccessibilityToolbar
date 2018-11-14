( function ( mw, $ ) {
	'use strict';
	/**
	 * @class mw.accessibilityToolbar
	 * @singleton
	 */
	mw.accessibilityToolbar = {
	};

	$( document ).ready( $.RealAccessability( {
		rootElement: '#bodyWrapper',
		hideOnScroll: false
	} ) );
}( mediaWiki, $ ) );
