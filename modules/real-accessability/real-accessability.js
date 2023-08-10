/*
 * Real Accessability
 * Version: 1.0
 * Author: REALMEDIA
 * Website: https://realmedia.co.il
 * Dual licensed under the MIT and GPL licenses.
 */

( function () {
	'use strict';

	$.RealAccessability = function ( options ) {
		var settings = $.extend( {
				rootElement: 'body',
				exclude: '#fb-root',
				markup: 'h1, h2, h3, h4, h5, h6, span, div, p, a, input, textarea, li, i',
				hideOnScroll: true,
				fontSizeStepMax: 3,
				fontSizeStepMin: 0,
				fontSizeStepBy: 2
			}, options ),
			$container = $( '#real-accessability' ),
			$toggler = $container.find( '#real-accessability-btn' ),
			$icons = $toggler.children(),
			$rootElement = $( settings.rootElement ),
			effects = [
				'real-accessability-high-contrast',
				'real-accessability-grayscale',
				'real-accessability-invert'
			],

			obj = {
				fontSize: 0,
				effect: null,
				linkHighlight: false,
				regularFont: false
			},

			mustExclude = '#content, #bodyWrapper, #main-columns, #real-accessability, #real-accessability ul, #real-accessability li, #real-accessability a, #real-accessability-body, #real-accessability h3, #real-accessability span, #real-accessability div, #wpadminbar, #wpadminbar div, #wpadminbar a, #wpadminbar ul, #wpadminbar li, #wpadminbar span';

		settings.exclude = mustExclude + ', ' + settings.exclude;

		function toggleAriaExpanded( $element ) {
			$element.attr( 'aria-expanded', function ( i, attr ) {
				return attr !== 'true';
			} );
		}

		// Get saved cookie option
		function getCookie( name ) {
			name = name + '=';
			var arr = document.cookie.split( ';' );

			for ( var i = 0; i < arr.length; i++ ) {
				var c = arr[ i ];
				while ( c.charAt( 0 ) === ' ' ) {
					c = c.substring( 1 );
				}
				if ( c.indexOf( name ) === 0 ) {
					return c.substring( name.length, c.length );
				}
			}

			return '';
		}

		// Open toolbar
		function openToolbar() {
			toggleAriaExpanded( $toggler );

			if ( $container.hasClass( 'open' ) ) {
				$container.removeClass( 'open' );
			} else {
				$container.addClass( 'open' );
				if ( getCookie( 'real-accessability' ) === '' ) {
					$( settings.markup ).not( settings.exclude ).each( function () {
						var fontSize = parseInt( $( this ).css( 'font-size' ) );
						$( this ).attr( 'data-raofz', fontSize );
					} );
				}
			}
		}

		function showLoader( callback ) {
			$icons.toggle(); // Toggle both icons;
			setTimeout( function () {
				callback();
				$icons.toggle();
			}, 300 );
		}

		// Make font bigger
		function increaseFont() {
			if ( obj.fontSize < settings.fontSizeStepMax ) {
				showLoader( function () {
					obj.fontSize++;
					$( settings.markup ).not( settings.exclude ).each( function () {
						var fontSize = parseInt( $( this ).data( 'raofz' ) );
						$( this ).css( 'font-size', fontSize + ( settings.fontSizeStepBy * obj.fontSize ) + 'px' );
					} );
					$( window ).trigger( 'resize' ); /* things might need to be recalculated */
					$( '#real-accessability-smallerFont' ).removeClass( 'disabled' );
					if ( obj.fontSize >= settings.fontSizeStepMax ) {
						$( '#real-accessability-biggerFont' ).addClass( 'disabled' );
					}
				} );
			}
		}

		// Make font smaller
		function decreaseFont() {
			if ( obj.fontSize > settings.fontSizeStepMin ) {
				showLoader( function () {
					obj.fontSize--;
					$( settings.markup ).not( settings.exclude ).each( function () {
						var fontSize = parseInt( $( this ).data( 'raofz' ) );
						$( this ).css( 'font-size', fontSize + ( settings.fontSizeStepBy * obj.fontSize )  + 'px' );
					} );
					$( window ).trigger( 'resize' ); /* things might need to be recalculated */
					$( '#real-accessability-biggerFont' ).removeClass( 'disabled' );

					if ( obj.fontSize <= settings.fontSizeStepMin ) {
						$( '#real-accessability-smallerFont' ).addClass( 'disabled' );
					}
				} );
			}
		}

		// Change effect
		function effectChange( eventObject ) {
			var chosenEffect = $( eventObject.currentTarget ).attr( 'id' );
			obj.effect = null;

			showLoader( function () {
				for ( var i = 0; i < effects.length; i++ ) {
					if ( !$rootElement.hasClass( chosenEffect ) && chosenEffect === effects[ i ] ) {
						// The following classes are used here:
						// * real-accessability-high-contrast,
						// * real-accessability-grayscale,
						// * real-accessability-invert
						$rootElement.addClass( effects[ i ] );
						$( '#' + effects[ i ] ).addClass( 'active' );
						obj.effect = effects[ i ];
					} else {
						// The following classes are used here:
						// * real-accessability-high-contrast,
						// * real-accessability-grayscale,
						// * real-accessability-invert
						$rootElement.removeClass( effects[ i ] );
						$( '#' + effects[ i ] ).removeClass( 'active' );
					}
				}
			} );
		}

		// Highlight all the links
		function linkHighlight( eventObject ) {
			var $this = $( eventObject.currentTarget );

			showLoader( function () {
				if ( $rootElement.hasClass( 'real-accessability-linkHighlight' ) ) {
					$rootElement.removeClass( 'real-accessability-linkHighlight' );
					$this.removeClass( 'active' );
					obj.linkHighlight = false;
				} else {
					$rootElement.addClass( 'real-accessability-linkHighlight' );
					$this.addClass( 'active' );
					obj.linkHighlight = true;
				}
			} );
		}

		// Reset all
		var reset = function () {
				showLoader( function () {
					$( '.real-accessability-actions' ).children().removeClass( 'active disabled' );

					$( settings.markup ).not( settings.exclude ).each( function () {
						var fontSize = parseInt( $( this ).data( 'raofz' ) );
						$( this ).css( 'font-size', fontSize + 'px' );
					} );

					// Remove any class that starts with "real-accessability-"
					// The following classes are used here:
					// * real-accessability-high-contrast,
					// * real-accessability-grayscale,
					// * real-accessability-invert
					$rootElement.removeClass( function ( index, className ) {
						return ( className.match( /(^|\s)real-accessability-\S+/g ) || [] ).join( ' ' );
					} );

					// Reset the object
					obj.fontSize = 0;
					obj.effect = null;
					obj.linkHighlight = false;
					obj.regularFont = false;

					$( window ).trigger( 'resize' ); /* things might need to be recalculated */
					$( '#real-accessability-smallerFont' ).addClass( 'disabled' );
				} );
			},

			// Disable clicking on toolbar links
			disableClicking = function () {
				$( '.real-accessability-actions' ).children().on( 'click', function ( e ) {
					e.preventDefault();
				} );
			},

			// Hide toolbar when scrolling
			hideOnScroll = function () {
				if ( settings.hideOnScroll ) {
					$( window ).on( 'scroll', function () {
						if ( $container.hasClass( 'open' ) ) {
							$container.removeClass( 'open' );
						}
					} );
				}
			},

			// Save object in cookie named 'real-accessability' when user redirect page
			saveOnRedirect = function () {
				$( window ).on( 'beforeunload', function () {
					document.cookie = 'real-accessability=' + JSON.stringify( obj ) + '; path=/';
				} );
			};

		// Init
		function init() {
			disableClicking();
			hideOnScroll();
			saveOnRedirect();

			$container.css( 'display', 'block' ); // Hidden inline by default
			$toggler.find( '.real-accessability-icon' ).css( 'display', 'inline-block' );
			$toggler.find( '.real-accessability-loading' ).toggle();

			var cookie = getCookie( 'real-accessability' );
			if ( cookie !== '' ) {
				obj = JSON.parse( cookie );
				$rootElement.find( settings.markup ).not( settings.exclude ).each( function () {
					var fontSize = parseInt( $( this ).css( 'font-size' ) );
					$( this ).attr( 'data-raofz', fontSize );
				} );

				if ( obj.fontSize !== 0 ) {
					$( settings.markup ).not( settings.exclude ).each( function () {
						var fontSize = parseInt( $( this ).data( 'raofz' ) );
						$( this ).css( 'font-size', fontSize + ( settings.fontSizeStepBy * obj.fontSize ) + 'px' );
					} );

					if ( obj.fontSize > 0 ) {
						$( '#real-accessability-smallerFont' ).removeClass( 'disabled' );
					}
				}

				// For themes that touched the default <?php body_class(); ?> class
				if ( !$rootElement.hasClass( obj.effect ) && obj.effect !== null ) {
					// The following classes are used here:
					// * real-accessability-high-contrast,
					// * real-accessability-grayscale,
					// * real-accessability-invert
					$rootElement.addClass( obj.effect );
					$( '#' + obj.effect ).addClass( 'active' );
				}

				if ( !$rootElement.hasClass( obj.linkHighlight ) && obj.linkHighlight === true ) {
					$rootElement.addClass( 'real-accessability-linkHighlight' );
					$( '#real-accessability-linkHighlight' ).addClass( 'active' );
				}

				if ( !$rootElement.hasClass( obj.regularFont ) && obj.regularFont === true ) {
					$rootElement.addClass( 'real-accessability-regularFont' );
					$( '#real-accessability-regularFont' ).addClass( 'active' );
				}
			}

			$toggler.on( 'click', openToolbar );
			$container.find( '.panel-heading .close' ).on( 'click', openToolbar );
			$( '#real-accessability-biggerFont' ).on( 'click', increaseFont );
			$( '#real-accessability-smallerFont' ).on( 'click', decreaseFont );
			$( '.real-accessability-effect' ).on( 'click', effectChange );
			$( '#real-accessability-linkHighlight' ).on( 'click', linkHighlight );
			$( '#real-accessability-reset' ).on( 'click', reset );
		}

		init();

	};

}() );
