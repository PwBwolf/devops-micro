//JAVASCRIPT DOCUMENT //
(function() {

	var wndw_W = $(window).width();
	var wndw_H = $(window).height();
	
	/* ////// TRANSITION END PLACEMENT ////// */
		function pickTransitionEvent(){
			var t;
			var elmt = document.createElement('fackelement');
			var transitions = {
				'transitions':'transitionEnd',
				  'OTransition':'oTransitionEnd',
				  'msTransition':'MSTransitionEnd',
				  'MozTransition':'transitionend',
				  'WebkitTransition':'webkitTransitionEnd'
			}
			for( t in transitions){
				if(elmt.style[t] !== undefined){
					return transitions[t];
				}
			}
		}
		transitionEnd = pickTransitionEvent();
	/* ////////////////////////////////////// */
	
	
	/* ////// BIND EVENTS & ADD-EVENT-LISTENERS ////// */
		function bindEvent(el, eventName, eventHandler) {
		  if (el.addEventListener){
			el.addEventListener(eventName, eventHandler, false); 
		  } else if (el.attachEvent){
			el.attachEvent('on'+eventName, eventHandler);
		  }
		}
	/* /////////////////////////////////////////////// */
		
		
	
		/// ======================================== ///
		/// ====  DOCUMENT ON LOADED FUNCTIONS  ==== ///

		bindEvent(document, 'DOMContentLoaded', function(){	
			
			
			
		/// ====  PAGE PARALLAX FUNCTIONS  ==== ///	
			//$('#left_Intro').parallax("-80px", 0.2);
			//$('#droidlogo').parallax("50%", 0.27);
			//alert($('#droidlogo').attr('class'));
			//$('#tempCntnt').parallax("50%", 0.2);
			//$('#Home_Bx').parallax("50%", 1.55);
			$('.ntwrkLogoBig').parallax("50%", 1.12);

		/// ====  MENU & SHOPPING CART FREEZE  ==== ///

			
		
			//alert($('#droidlogo').next().attr('id'));
			
			/// ====  LOGIN AND SIGN-UP MODULES  ==== ///
			/*
			var usrInput = document.getElementById('brand');
			var usrInputBx = usrInput.querySelectorAll('.usr_Input_clsd');
			
			
			for(var q = 0; q < usrInputBx.length; q++){

					usrInputBx[q].onclick = function(e){
						var targetClass = e.target.className;
						var targetId = e.target.id;
						var target = e.target;
						
						var othrBxs = $('#brand div:not([id*="'+targetId+'"])');	
												
						if(targetClass == 'usr_Input_open'){
							target.className = target.className.replace('usr_Input_open', 'usr_Input_clsd');
							
						} else {
							target.className = 'usr_Input_open';
							$(othrBxs).switchClass('usr_Input_open', 'usr_Input_clsd');
						}
												
					};
			}
			*/
			
		/// ====  ==============================  ==== ///
			
			var navbar = document.getElementById('navBar');
			var brand = document.getElementById('brand');
			var navTop = navbar.offsetTop;
			var navLogo = brand.querySelector('img');
			//var crtTop = parseInt(shpgcrt.offsetTop + 60);
			//var crtNline = shpgcrt.offsetTop;
			//console.log(navLogo.length);
			var navdocked = false; 
			
			//var crtdocked = false; 
			
				$(dl).attr('style', 'display:none');
				$(dl_img).appendTo($(dl));
				
				$(hmBtn).attr('style', 'display:none');
				$('div[id="menuItems"]').prepend($(hmBtn)).prepend($(dl))	;
						
			window.onscroll = function () {
				
				if (!navdocked && (navbar.offsetTop - ascrollTop() < 0)) {
					navbar.style.top = 0; 
					navbar.style.position = 'fixed';
					navbar.style.color = 'black';
					navbar.className = 'docked';
					navLogo.style.position = 'fixed';
					navLogo.className = 'imgdocked';
					//$(dl).show('slow');
					$(hmBtn).show('slow');
				navdocked = true;
				} else if (navdocked && ascrollTop() <= navTop) {
					navbar.style.position = 'absolute';
					navLogo.style.position = 'absolute';
					navbar.style.top = navTop + 'px';
					navbar.style.color = '#3e194d';
					navbar.className = navbar.className.replace('docked', '');
					navLogo.className = navLogo.className.replace('imgdocked', '');
					navLogo.style.position = 'absolute';
					//$(dl).hide('slow');
					$(hmBtn).hide('slow');
				navdocked = false;
				}
				
				/*
				if (!crtdocked && (shpgcrt.offsetTop - ascrollTop() < -60)) {
					shpgcrt.style.position = 'fixed';
					shpgcrt.style.top = '-60px';
				crtdocked = true;
				} else if (crtdocked && ascrollTop() <= crtTop) {
					shpgcrt.style.position = 'absolute';
					shpgcrt.style.top = crtNline + 'px';
				crtdocked = false;
				}
				*/
			}

		});
	
		/// =========  DOCUMENT LOADED END  ======== ///
		/// ======================================== ///
		
		
		function ascrollTop() {
			return document.body.scrollTop || document.documentElement.scrollTop;
			//alert('when');		
		} 
		
		
		
		
})();