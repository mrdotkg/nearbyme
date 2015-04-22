/**
 * ytmenu.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var YTMenu = (function() {

	function init() {
		[].slice.call( document.querySelectorAll( '.dr-menu' ) ).forEach( function( el, i ) {

			var search = el.querySelector( '.kyo-button' );
			var trigger = el.querySelector( 'div.dr-trigger' ),
				icon = trigger.querySelector( 'span.dr-icon-menu' ),
				open = false;

			trigger.addEventListener( 'click', function( event ) {
				if( !open ) {
					el.className += ' dr-menu-open';
					open = true;
					$("#search").focus();
				}
			}, false );

			icon.addEventListener( 'click', function( event ) {
				if( open ) {
					event.stopPropagation();
					open = false;
					el.className = el.className.replace(/\bdr-menu-open\b/,'');
					return false;
				}
			}, false );

			//On clicking the Search Button
			search.addEventListener( 'click',  function( event ) {
				if( open ) {
					event.stopPropagation();
					open = false;
					el.className = el.className.replace(/\bdr-menu-open\b/,'');
					console.log($("#search").val());
					if($("#search").val()!=''){
						$(".dr-label").html($("#search").val()+'.nearby.me');
						type_array=$("#search").val();
						initialize();
					}
					return false;
				}
			}, false );

			//On Pressing Enter
			document.getElementById('search').onkeypress = function(e){
				if (!e) e = window.event;
				var keyCode = e.keyCode || e.which;
				if (keyCode == '13'){
					if( open ) {
						event.stopPropagation();
						open = false;
						el.className = el.className.replace(/\bdr-menu-open\b/,'');
						console.log($("#search").val());
						if($("#search").val()!=''){
							$(".dr-label").html($("#search").val()+'.nearby.me');
							type_array=$("#search").val();
							initialize();
						}
						return false;
					}
				}
			}


			});
	}

	init();

})();