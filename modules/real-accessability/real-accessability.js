/*
 * Real Accessability
 * Version: 1.0
 * Author: REALMEDIA
 * Website: https://realmedia.co.il
 * Dual licensed under the MIT and GPL licenses.
 */

(function($) {
	
	'use strict';

	$.RealAccessability = function( options ) {
		var $container = $('#real-accessability');
		var $toggler = $container.find( '#real-accessability-btn' );
		var $body = $('body');

	    var settings = $.extend( {
	        exclude: '#fb-root',
	        markup: 'h1, h2, h3, h4, h5, h6, span, div, p, a, input, textarea, li, i',	
	        hideOnScroll: true,
			fontSizeStepMax: 3,
			fontSizeStepMin: 0,
			fontSizeStepBy: 2
		}, options );
	    
		var effects = [
			'real-accessability-high-contrast',
			'real-accessability-grayscale',
			'real-accessability-invert'
		];
		
		var obj = {
			fontSize: 0,
			effect: null,
			linkHighlight: false,
			regularFont: false
		};
		
		var mustExclude = '#content, #bodyWrapper, #main-columns, #real-accessability, #real-accessability ul, #real-accessability li, #real-accessability a, #real-accessability-body, #real-accessability h3, #real-accessability i, #real-accessability div, #wpadminbar, #wpadminbar div, #wpadminbar a, #wpadminbar ul, #wpadminbar li, #wpadminbar span';
		settings.exclude = mustExclude + ', ' + settings.exclude;
		
		// Init
		var init = function() {	
			var cookie = getCookie('real-accessability');
			
			if(cookie !== '') {
				obj = JSON.parse(cookie);
				$(settings.markup).not(settings.exclude).each(function() {
					var fontSize = parseInt( $(this).css('font-size') );
					$(this).attr('data-raofz', fontSize);
				});
				
				if(obj.fontSize !== 0) {	
					$(settings.markup).not(settings.exclude).each(function() {
						var fontSize = parseInt( $(this).data('raofz') );
						$(this).css('font-size', fontSize+(settings.fontSizeStepBy*obj.fontSize));
					});

					if(obj.fontSize > 0 ) {
						$('#real-accessability-smallerFont').removeClass( 'disabled' );
					}
				}
				
				// For themes that touched the default <?php body_class(); ?> class
				if(!$body.hasClass(obj.effect) && obj.effect !== null) {
					$body.addClass(obj.effect);
					$('#'+obj.effect).addClass('active');
				}
				
				if(!$body.hasClass(obj.linkHighlight) && obj.linkHighlight === true) {
					$body.addClass('real-accessability-linkHighlight');
					$('#real-accessability-linkHighlight').addClass('active');
				}
				
				if(!$body.hasClass(obj.regularFont) && obj.regularFont === true) {
					$body.addClass('real-accessability-regularFont');
					$('#real-accessability-regularFont').addClass('active');
				}								
			}
			
			$toggler.on('click', openToolbar);
			$container.find('.panel-heading .close').on('click', openToolbar);
			$('#real-accessability-biggerFont').on('click', increaseFont);
			$('#real-accessability-smallerFont').on('click', decreaseFont);
			$('.real-accessability-effect').on('click', effectChange);
			$('#real-accessability-linkHighlight').on('click', linkHighlight);
			$('#real-accessability-reset').on('click', reset);
		};
	 
		// Get saved cookie option
		var getCookie = function(name) {
		    name = name + '=';
		    var arr = document.cookie.split(';');
		    
		    for(var i=0; i<arr.length; i++) {
		        var c = arr[i];
		        while (c.charAt(0) === ' ') {
		        	c = c.substring(1);
				}
		        if (c.indexOf(name) === 0) {
			        return c.substring(name.length,c.length);
			    }
		    }

		    return '';
		};
		
		// Open toolbar 
		function openToolbar( eventObject ) {
			var $parent = $(eventObject.currentTarget).parent();
			$('.real-accessability-body').animate({width:'toggle'});

			if( $parent.hasClass('open')) {
				$parent.removeClass('open');
			} else {

				$parent.addClass('open');
				if(getCookie('real-accessability') === '') {
					$(settings.markup).not(settings.exclude).each(function() {
						var fontSize = parseInt( $(this).css('font-size') );
						$(this).attr('data-raofz', fontSize);
					});
				}			
			}			
		}
		
		// Make font bigger
		function increaseFont() {
			if(obj.fontSize < settings.fontSizeStepMax) {
				showLoader(function() {
					obj.fontSize++;
					$(settings.markup).not(settings.exclude).each(function() {
						var fontSize = parseInt( $(this).data('raofz') );
						$(this).css('font-size', fontSize+(settings.fontSizeStepBy*obj.fontSize));
					});
					$( window ).trigger( 'resize' ); /* things might need to be recalculated */
					$('#real-accessability-smallerFont').removeClass( 'disabled' );
					if(obj.fontSize >= settings.fontSizeStepMax ) {
						$('#real-accessability-biggerFont').addClass( 'disabled' );
					}
				});
			}				
		}
		
		// Make font smaller
		function decreaseFont() {
			if(obj.fontSize > settings.fontSizeStepMin ) {
				showLoader(function() {
					obj.fontSize--;
					$(settings.markup).not(settings.exclude).each(function() {
						var fontSize = parseInt( $(this).data('raofz') );
						$(this).css('font-size', fontSize+(settings.fontSizeStepBy*obj.fontSize));
					});
					$( window ).trigger( 'resize' ); /* things might need to be recalculated */
					$('#real-accessability-biggerFont').removeClass( 'disabled' );

					if(obj.fontSize <= settings.fontSizeStepMin ) {
						$('#real-accessability-smallerFont').addClass( 'disabled' );
					}
				});
			}					
		}
		
		// Change effect
		function effectChange( eventObject) {
			var chosenEffect = $(eventObject.currentTarget).attr('id');
			obj.effect = null;
			
			showLoader(function() {					
				for(var i=0; i<effects.length; i++) {
					if(!$body.hasClass(chosenEffect) && chosenEffect === effects[i]) {
						$body.addClass(effects[i]);
						$('#'+effects[i]).addClass('active');
						obj.effect = effects[i];
					} else {
						$body.removeClass(effects[i]);
						$('#'+effects[i]).removeClass('active');
					}
				}
			});
		}
		
		// Highlight all the links
		function linkHighlight( eventObject ) {
			var $this = $(eventObject.currentTarget);
			
			showLoader(function() {
				if($body.hasClass('real-accessability-linkHighlight')) {
					$body.removeClass('real-accessability-linkHighlight');
					$this.removeClass('active');
					obj.linkHighlight = false;
				} else {
					$body.addClass('real-accessability-linkHighlight');
					$this.addClass('active');
					obj.linkHighlight = true;
				}	
			});
		}	

		
		// Reset all
		var reset = function() {
			showLoader(function() {
				$container.find('.real-accessability-actions a').removeClass('active');
				
				$(settings.markup).not(settings.exclude).each(function() {
					var fontSize = parseInt( $(this).data('raofz') );
					$(this).css('font-size', fontSize);
				});

				// Remove any class that starts with "real-accessability-"
				$body.removeClass( function( index, className ) {
					return (className.match (/(^|\s)real-accessability-\S+/g) || []).join(' ');
				});
				
				// Reset the object
				obj.fontSize = 0;
				obj.effect = null;
				obj.linkHighlight = false;
				obj.regularFont = false;

				$( window ).trigger( 'resize' ); /* things might need to be recalculated */
				$('#real-accessability-smallerFont').addClass( 'disabled' );
			});
		};
		
		// Disable clicking on toolbar links
		var disableClicking = function() {
			$container.find('.real-accessability-actions a').bind('click', function(e) {
				e.preventDefault();
			});
		};
		
		var showLoader = function(callback) {
				$('a#real-accessability-btn i.real-accessability-icon').css('display', 'none');
				$('a#real-accessability-btn i.real-accessability-loading').show();
				setTimeout(function() { 
					callback();
					$('a#real-accessability-btn i.real-accessability-loading').hide();
					$('a#real-accessability-btn i.real-accessability-icon').show();
				}, 300);
		};
		
		// Hide toolbar when scrolling
		var hideOnScroll = function() {
			if(settings.hideOnScroll) {
				$(window).scroll(function() {
					if($container.hasClass('open')) {
						$container.removeClass('open');
					}	
				});
			}				
		};
		
		// Save object in cookie named 'real-accessability' when user redirect page
		var saveOnRedirect = function() {
			$(window).on('beforeunload', function() {
				document.cookie = 'real-accessability=' + JSON.stringify(obj) + '; path=/';
			});
		};
		
		init();
		disableClicking();
		hideOnScroll();
		saveOnRedirect();

	};

})(jQuery);
