/*
	Future Imperfect by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$menu = $('#menu'),
			$sidebar = $('#sidebar'),
			$main = $('#main');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// IE<=9: Reverse order of main and sidebar.
			if (skel.vars.IEVersion <= 9)
				$main.insertAfter($sidebar);

		// Menu.
			$menu
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-menu-visible'
				});

		// Search (header).
			var $search = $('#search'),
				$search_input = $search.find('input');

			$body
				.on('click', '[href="#search"]', function(event) {

					event.preventDefault();

					// Not visible?
						if (!$search.hasClass('visible')) {

							// Reset form.
								$search[0].reset();

							// Show.
								$search.addClass('visible');

							// Focus input.
								$search_input.focus();

						}

				});

			$search_input
				.on('keydown', function(event) {

					if (event.keyCode == 27)
						$search_input.blur();

				})
				.on('blur', function() {
					window.setTimeout(function() {
						$search.removeClass('visible');
					}, 100);
				});

		// Intro.
			var $intro = $('#intro');

			// Move to main on <=large, back to sidebar on >large.
				skel
					.on('+large', function() {
						$intro.prependTo($main);
					})
					.on('-large', function() {
						$intro.prependTo($sidebar);
					});

	});

	// Custom 
	$(document).ready(function(){

		

			$(window).scroll(function() {
			if ($(document).scrollTop() > 200) {
			skel
				.on('-medium !small', function() {
					$("break").prev().css( "display", "none" );
					$("break").css( "height", "0" );
				});
			// alert(foot);
				
				} else {
			skel
				.on('-medium !small', function() {
					$("break").prev().css( "display", "block" );
					$("break").css( "height", "12px" );
				});

				} 

			});

					$("p.published").next().addClass("published");


					$("p.txin").next().addClass("published");
					$("p.txin").next().addClass("liti");
					$("p.txin").next().addClass("txin");
					// single page
					$("p.wn").next().css( "line-height", "2em" );

					var url = window.location.href;
					var arguments = url.split('//')[1].split('/')[1];
					if(arguments=='en'){
					$(".lg,.lg > p").html('LANGUAGE : TELUGU');
					$(".lg").attr("href","/te");
					$("body").css( "font-family", "'Raleway', Helvetica, sans-serif" );
					// alert('english');
					}
					else if(arguments=='te'){
					$(".lg,.lg > p").html('LANGUAGE : ENGLISH');
					$(".lg").attr("href","/en");
					$("ul.bl li a").css( "font-family", "'Mandali'" );
					// alert('telugu');
					}
					else if(arguments=='epaper'){
					$(".lg").attr("href","/en");
					$("ul.bl li a").css( "font-family", "'Mandali'" );
					}

					var curr = $('div > #pep:first-child').attr('src');
					$('#pap').attr("src",curr);

					$("div > #pep").click(function(){
						var cur = $(this).attr('src');
						$('#pap').attr("src",cur);
					});


	});

})(jQuery);