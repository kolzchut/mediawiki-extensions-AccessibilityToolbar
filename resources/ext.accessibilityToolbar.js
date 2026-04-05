'use strict';

/**
 * @class mw.accessibilityToolbar
 * @singleton
 */
mw.accessibilityToolbar = ( function () {
	const COOKIE_NAME = 'accessibilityToolbar';
	const EFFECT_PREFIX = 'a11y-toolbar-';
	const FONT_STEP_MAX = 3;
	const FONT_STEP_MIN = 0;
	const FONT_STEP_BY = 2;
	const MARKUP_SELECTOR = 'h1, h2, h3, h4, h5, h6, span, div, p, a, input, textarea, li, i';
	// Exclude layout containers and the toolbar itself from font-size manipulation
	const EXCLUDE_SELECTOR = '#content, #bodyWrapper';

	let state = { fontSize: 0, effect: null, linkHighlight: false };
	let container, actionsContainer, toggler, loadingIcon, mainIcon, rootElement;
	let originalFontSizesCaptured = false;

	function captureOriginalFontSizes() {
		if ( originalFontSizesCaptured ) {
			return;
		}
		getMarkupElements().forEach( ( el ) => {
			el.dataset.a11yOfz = parseInt( getComputedStyle( el ).fontSize );
		} );
		originalFontSizesCaptured = true;
	}

	function getMarkupElements() {
		return Array.from( document.querySelectorAll( MARKUP_SELECTOR ) ).filter(
			( el ) => !el.matches( EXCLUDE_SELECTOR ) &&
				!el.closest( '.a11y-toolbar' ) &&
				!el.closest( '.a11y-toolbar-menu' )
		);
	}

	function showLoader( callback ) {
		if ( loadingIcon ) {
			loadingIcon.style.display = 'inline-block';
		}
		if ( mainIcon ) {
			mainIcon.style.display = 'none';
		}
		setTimeout( () => {
			callback();
			if ( loadingIcon ) {
				loadingIcon.style.display = 'none';
			}
			if ( mainIcon ) {
				mainIcon.style.display = 'inline-block';
			}
		}, 300 );
	}

	function openToolbar( event ) {
		event.preventDefault();
		const isOpen = container.classList.contains( 'open' );
		toggler.setAttribute( 'aria-expanded', String( !isOpen ) );
		container.classList.toggle( 'open', !isOpen );
	}

	function persistState() {
		const saved = {};
		if ( state.fontSize !== 0 ) {
			saved.fontSize = state.fontSize;
		}
		if ( state.effect ) {
			saved.effect = state.effect;
		}
		if ( state.linkHighlight ) {
			saved.linkHighlight = state.linkHighlight;
		}
		if ( Object.keys( saved ).length === 0 ) {
			mw.cookie.set( COOKIE_NAME, null );
		} else {
			mw.cookie.set( COOKIE_NAME, JSON.stringify( saved ), { path: '/' } );
		}
	}

	function increaseFont() {
		if ( state.fontSize < FONT_STEP_MAX ) {
			captureOriginalFontSizes();
			showLoader( () => {
				state.fontSize++;
				getMarkupElements().forEach( ( el ) => {
					el.style.fontSize = ( parseInt( el.dataset.a11yOfz ) + FONT_STEP_BY * state.fontSize ) + 'px';
				} );
				window.dispatchEvent( new Event( 'resize' ) );
				actionsContainer.querySelector( '[data-action="smaller_font"]' ).classList.remove( 'disabled' );
				if ( state.fontSize >= FONT_STEP_MAX ) {
					actionsContainer.querySelector( '[data-action="bigger_font"]' ).classList.add( 'disabled' );
				}
				persistState();
			} );
		}
	}

	function decreaseFont() {
		if ( state.fontSize > FONT_STEP_MIN ) {
			captureOriginalFontSizes();
			showLoader( () => {
				state.fontSize--;
				getMarkupElements().forEach( ( el ) => {
					el.style.fontSize = ( parseInt( el.dataset.a11yOfz ) + FONT_STEP_BY * state.fontSize ) + 'px';
				} );
				window.dispatchEvent( new Event( 'resize' ) );
				actionsContainer.querySelector( '[data-action="bigger_font"]' ).classList.remove( 'disabled' );
				if ( state.fontSize <= FONT_STEP_MIN ) {
					actionsContainer.querySelector( '[data-action="smaller_font"]' ).classList.add( 'disabled' );
				}
				persistState();
			} );
		}
	}

	function effectChange( el ) {
		const effect = el.dataset.effect;
		const isActive = rootElement && rootElement.classList.contains( EFFECT_PREFIX + effect );
		showLoader( () => {
			// The following classes are used here:
			// * a11y-toolbar-high-contrast
			// * a11y-toolbar-grayscale
			// * a11y-toolbar-invert
			Array.from( actionsContainer.querySelectorAll( '[data-effect]' ) ).forEach( ( btn ) => {
				if ( rootElement ) {
					rootElement.classList.remove( EFFECT_PREFIX + btn.dataset.effect );
				}
				btn.classList.remove( 'active' );
			} );
			if ( !isActive && rootElement ) {
				rootElement.classList.add( EFFECT_PREFIX + effect );
				el.classList.add( 'active' );
				state.effect = effect;
			} else {
				state.effect = null;
			}
			persistState();
		} );
	}

	function toggleLinkHighlight( el ) {
		showLoader( () => {
			// The following class is used here: a11y-toolbar-link-highlight
			const active = rootElement ?
				rootElement.classList.toggle( 'a11y-toolbar-link-highlight' ) :
				false;
			el.classList.toggle( 'active', active );
			state.linkHighlight = active;
			persistState();
		} );
	}

	function reset() {
		captureOriginalFontSizes();
		showLoader( () => {
			Array.from( actionsContainer.querySelectorAll( 'button' ) )
				.forEach( ( btn ) => btn.classList.remove( 'active', 'disabled' ) );
			getMarkupElements().forEach( ( el ) => {
				el.style.fontSize = parseInt( el.dataset.a11yOfz ) + 'px';
			} );
			// Remove all a11y-toolbar-* effect classes
			if ( rootElement ) {
				Array.from( rootElement.classList )
					.filter( ( cls ) => cls.startsWith( 'a11y-toolbar-' ) )
					.forEach( ( cls ) => rootElement.classList.remove( cls ) );
			}
			state = { fontSize: 0, effect: null, linkHighlight: false };
			mw.cookie.set( COOKIE_NAME, null );
			window.dispatchEvent( new Event( 'resize' ) );
			actionsContainer.querySelector( '[data-action="smaller_font"]' ).classList.add( 'disabled' );
		} );
	}

	function dispatch( event ) {
		event.preventDefault();
		const el = event.currentTarget;
		const action = el.dataset.action;
		if ( action === 'bigger_font' ) {
			increaseFont();
		} else if ( action === 'smaller_font' ) {
			decreaseFont();
		} else if ( action === 'link_highlight' ) {
			toggleLinkHighlight( el );
		} else if ( action === 'reset' ) {
			reset();
		} else if ( el.dataset.effect ) {
			effectChange( el );
		}
	}

	function restoreFromCookie() {
		const cookieVal = mw.cookie.get( COOKIE_NAME );
		if ( !cookieVal ) {
			return;
		}
		const DEFAULTS = { fontSize: 0, effect: null, linkHighlight: false };
		state = Object.assign( DEFAULTS, JSON.parse( cookieVal ) );
		// a11yOfz captured lazily; capture now if restoring a non-zero font state
		if ( state.fontSize !== 0 ) {
			captureOriginalFontSizes();
			getMarkupElements().forEach( ( el ) => {
				el.style.fontSize = ( parseInt( el.dataset.a11yOfz ) + FONT_STEP_BY * state.fontSize ) + 'px';
			} );
			if ( state.fontSize > 0 ) {
				actionsContainer.querySelector( '[data-action="smaller_font"]' ).classList.remove( 'disabled' );
			}
		}
		if ( state.effect && rootElement ) {
			// The following classes are used here:
			// * a11y-toolbar-high-contrast
			// * a11y-toolbar-grayscale
			// * a11y-toolbar-invert
			rootElement.classList.add( EFFECT_PREFIX + state.effect );
			const effectBtn = actionsContainer.querySelector( `[data-effect="${ state.effect }"]` );
			if ( effectBtn ) {
				effectBtn.classList.add( 'active' );
			}
		}
		if ( state.linkHighlight && rootElement ) {
			// The following class is used here: a11y-toolbar-link-highlight
			rootElement.classList.add( 'a11y-toolbar-link-highlight' );
			actionsContainer.querySelector( '[data-action="link_highlight"]' ).classList.add( 'active' );
		}
	}

	function initCommon() {
		rootElement = document.querySelector( '#content' ) || document.querySelector( '#bodyContent' );

		Array.from( actionsContainer.querySelectorAll( 'button' ) ).forEach( ( btn ) => {
			btn.addEventListener( 'click', dispatch );
		} );

		restoreFromCookie();
	}

	function init() {
		// Prefer a .a11y-toolbar that is NOT inside a Bootstrap dropdown-menu
		// (the one inside a dropdown is hidden and managed by Bootstrap; the one
		// rendered by SkinAfterBottomScripts is the standalone widget we control)
		const allToolbars = Array.from( document.querySelectorAll( '.a11y-toolbar' ) );
		container = allToolbars.find( ( el ) => !el.closest( '.dropdown-menu' ) ) || null;

		if ( container ) {
			// Standalone mode: floating fixed widget with our own toggle button
			toggler = container.querySelector( '.a11y-toolbar-btn' );
			if ( !toggler ) {
				return;
			}
			loadingIcon = toggler.querySelector( '.a11y-toolbar-loading' );
			mainIcon = toggler.querySelector( '.a11y-toolbar-icon' );
			actionsContainer = container.querySelector( '.a11y-toolbar-actions' );

			container.style.display = 'block';
			if ( mainIcon ) {
				mainIcon.style.display = 'inline-block';
			}

			toggler.addEventListener( 'click', openToolbar );
			const closeBtn = container.querySelector( '.panel-heading .close' );
			if ( closeBtn ) {
				closeBtn.addEventListener( 'click', openToolbar );
			}
		} else {
			// Embedded mode: panel inside a host UI (e.g. Cassandra Bootstrap dropdown)
			// No toggle button — the host UI handles open/close.
			actionsContainer = document.querySelector( '.a11y-toolbar-actions' );
			if ( !actionsContainer ) {
				return;
			}
		}

		initCommon();
	}

	// Stop dropdown-menu clicks from bubbling up and closing the panel
	const dropdownMenu = document.querySelector( '.accessibility .dropdown-menu' );
	if ( dropdownMenu ) {
		dropdownMenu.addEventListener( 'click', ( event ) => {
			if ( !event.target.classList.contains( 'close' ) ) {
				event.stopPropagation();
			}
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}

	return {};
}() );
