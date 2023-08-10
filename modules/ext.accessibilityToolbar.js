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

	document.querySelector( '.accessibility .dropdown-menu' )
		.addEventListener( 'click', function ( event ) {
			if ( !event.target.classList.contains( 'close' ) ) {
				event.stopPropagation();
			}
		} );
}() );
