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

	var element = document.querySelector( '.accessibility .dropdown-menu' );
	if ( element ) {
		element.addEventListener( 'click', function ( event ) {
			if ( !event.target.classList.contains( 'close' ) ) {
				event.stopPropagation();
			}
		} );
	}
}() );
