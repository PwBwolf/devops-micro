/// Javascript Document
(function(){
	'use strict';
	//var app;
	//var controllers = {};


/* ////// BIND EVENTS & ADD-EVENT-LISTENERS ////// */
	function bindEvent(el, eventName, eventHandler) {
	  if (el.addEventListener){
		el.addEventListener(eventName, eventHandler, false); 
	  } else if (el.attachEvent){
		el.attachEvent('on'+eventName, eventHandler);
	  }
	}
/* /////////////////////////////////////////////// */


	//var guide = $('#guide');
	//alert(guide.length);
	/// ======================================== ///
	/// ====  DOCUMENT ON LOADED FUNCTIONS  ==== ///

	bindEvent(document, 'DOMContentLoaded', function(){	
		
		var guide = document.getElementById('guide');
		//var guide = $('#pnlCntnr');
		//alert( $(guide).attr('class') );
		//alert(guide.getAttribute('class'));
		//alert(guide.getAttribute('class'));
		
			
	});
	

	/// ======================================== ///

/*
*
* /// OPTION ONE FOR BINDING DATA ///
*
*
	function myController($scope){
		$scope.isPopupVisible = false;

		$scope.showPopup = function(){
			$scope.isPopupVisible = true;
			//$scope.selectedEmail = email;
		
		}	
	
		$scope.closePopup = function(){
			$scope.isPopupVisible = false;
		}
			
		$scope.emails=[
			{ from: 'Danny', subject: 'for your eye\'s only', date: 'March 17' },
			{ from: 'David', subject: 'for your eye\'s only', date: 'June 18' },
			{ from: 'Shirley', subject: 'for your eye\'s only', date: 'March 19' }
		];
	}
	*/


/*
*
* /// OPTION TWO FOR BINDING DATA ///
*
*/

	/**
	 *  Module
	 *
	 * Description
	 */
	
	// CLOSED TO USE CONFIG APP.JS //
	angular.module('app', ['ngRoute', 'ngAnimate'])
	
	/**
	 *
	 * myApp Configuration
	 *
	 */
	
	.config(function ($routeProvider){
		$routeProvider
			.when('/', 
				{ controller: 'myController',
				  templateUrl: 'vws/mainPg.html'
				})
		    /*
		    .when('/view-2',
		    				{
		    					controller: 'myController',
		    					templateUrl: 'vws/view-2.html'
		    				})*/
		    
			.otherwise(
				{
					redirectTo: '/view-1'
				});
	})
	
	.factory('myFactory', function(){
		var emails = [
				{ from: 'Danny', subject: 'for your eye\'s only', date: 'March 17' },
				{ from: 'David', subject: 'for your eye\'s only', date: 'April 18' },
				{ from: 'Dorothy', subject: 'for your eye\'s only', date: 'March 19' }
			];
			
		var factory = {};
		
		factory.getEmails = function(){
			return emails;
		};
		factory.postEmails = function(email){
			
		};
		return factory;
	})
	
	.factory('usrPrefsFctry', function(){
		var usrData = [
			{ usrname: 'Avril', usremail: 'avl@mail.com', usrmessage: 'The name and text for the current user is here. this is Avril user one.' },
			{ usrname: 'Shelly', usremail: 'shly23@mail.com', usrmessage: 'The name and text for the current user is here. this is user one.' },
			{ usrname: 'Avril', usremail: 'avl@mail.com', usrmessage: 'The name and text for the current user is here. this is user one.' },
			{ usrname: 'Avril', usremail: 'avl@mail.com', usrmessage: 'The name and text for the current user is here. this is user one.' }
			
		];
		
		var usrPrfrdChnls = [
			{ chnl: "img/chnl_imgs/Channels1.jpg" }, { chnl: "img/chnl_imgs/Channels2.jpg" }, { chnl: "img/chnl_imgs/Channels3.jpg" },
			{ chnl: "img/chnl_imgs/Channels4.jpg" }, { chnl: "img/chnl_imgs/Channels5.jpg" }, { chnl: "img/chnl_imgs/Channels6.jpg" },
			{ chnl: "img/chnl_imgs/Channels7.jpg" }, { chnl: "img/chnl_imgs/Channels8.jpg" }, { chnl: "img/chnl_imgs/Channels9.jpg" },
			{ chnl: "img/chnl_imgs/Channels10.jpg" }, { chnl: "img/chnl_imgs/Channels11.jpg" }, { chnl: "img/chnl_imgs/Channels12.jpg" },
			{ chnl: "img/chnl_imgs/Channels13.jpg" }, { chnl: "img/chnl_imgs/Channels14.jpg" }, { chnl: "img/chnl_imgs/Channels15.jpg" },
			{ chnl: "img/chnl_imgs/Channels16.jpg" }, { chnl: "img/chnl_imgs/Channels17.jpg" }, { chnl: "img/chnl_imgs/Channels18.jpg" },
			{ chnl: "img/chnl_imgs/Channels19.jpg" }, { chnl: "img/chnl_imgs/Channels20.jpg" }, { chnl: "img/chnl_imgs/Channels21.jpg" },
			{ chnl: "img/chnl_imgs/Channels22.jpg" }, { chnl: "img/chnl_imgs/Channels23.jpg" }, { chnl: "img/chnl_imgs/Channels24.jpg" },
			{ chnl: "img/chnl_imgs/Channels25.jpg" }, { chnl: "img/chnl_imgs/Channels26.jpg" }, { chnl: "img/chnl_imgs/Channels27.jpg" },
			{ chnl: "img/chnl_imgs/Channels28.jpg" }, { chnl: "img/chnl_imgs/Channels29.jpg" }, { chnl: "img/chnl_imgs/Channels30.jpg" },
			{ chnl: "img/chnl_imgs/Channels31.jpg" }, { chnl: "img/chnl_imgs/Channels32.jpg" }
			
		];
		
		
		
		var usrPrfsFctry = {};
			usrPrfsFctry.getUsrData = function(){ return usrData; };
			usrPrfsFctry.getPrfrdChnls = function(){ return usrPrfrdChnls; };
			
			usrPrfsFctry.sendUsrData = function(){
			
			};
		return usrPrfsFctry;
		
	})
	
	.factory('usrScrnsFctry', function(){
		var usrMnScrn = { mnView: "img/friend-banner.jpg", mnChnl: "img/apple-touch-icon.png"} ;
		var usrSubScrn = { subView: "img/globe.jpg", subChnl: "img/chnl_imgs/Channels32.jpg" };
		
		var usrFavs = [
			{ chnlID: "img/chnl_imgs/Channels21.jpg", favScrn: 'img/chnl_prvws/natgeo.jpg', favShwTme: "3pm", favDesc: 'Deep Sea Giants' },
			{ chnlID: "img/chnl_imgs/Channels1.jpg", favScrn: 'img/chnl_prvws/banner5.jpg', favShwTme: "6pm", favDesc: 'Fifa Qualifier' },
			{ chnlID: "img/chnl_imgs/Channels11.jpg", favScrn: 'img/chnl_prvws/banner4.jpg', favShwTme: "7pm", favDesc: 'Lady Gaga Benefit Concert' },
			{ chnlID: "img/chnl_imgs/Channels9.jpg", favScrn: 'img/chnl_prvws/nicki-M.jpg', favShwTme: "9pm", favDesc: 'Interview with Nicki Minaj' }
		];
		var usrSgstns = [
			{ chnlID: "img/chnl_imgs/Channels31.jpg", sgstdScrn: "img/chnl_prvws/tribs.jpg", sgstdTme: "4am", sgstdDsc: "Biography", sgstdDscImg: "img/chnl_prvws_ovr/img1.jpg", sgstdDscCntnt: "Dan is an old Scandinavian given name with disputed meaning. Dan is also a Hebrew given name, after Dan, the fifth son of Jacob with Bilhah and founder of the Israelite Tribe of Dan. " },
			{ chnlID: "img/chnl_imgs/Channels27.jpg", sgstdScrn: "img/chnl_prvws/salsadancing.jpg", sgstdTme: "11pm", sgstdDsc: "Salsa", sgstdDscImg: "img/chnl_prvws_ovr/img3.jpg" },
			{ chnlID: "img/chnl_imgs/Channels12.jpg", sgstdScrn: "img/chnl_prvws/Nowy-Dziennik-TV1.jpg", sgstdTme: "9am", sgstdDsc: "Noticero", sgstdDscImg: "img/chnl_prvws_ovr/img7.jpg" },
			{ chnlID: "img/chnl_imgs/Channels9.jpg", sgstdScrn: "img/chnl_prvws/app-tv-remote.jpg", sgstdTme: "5am", sgstdDsc: "Tutorial", sgstdDscImg: "img/chnl_prvws_ovr/img2.jpg" },
			{ chnlID: "img/chnl_imgs/Channels21.jpg", sgstdScrn: "img/chnl_prvws/banner2.jpg", sgstdTme: "12pm", sgstdDsc: "Fifa Soccer", sgstdDscImg: "img/chnl_prvws_ovr/img4.jpg" },
			{ chnlID: "img/chnl_imgs/Channels3.jpg", sgstdScrn: "img/chnl_prvws/newsreport.jpg", sgstdTme: "10am", sgstdDsc: "Euro News", sgstdDscImg: "img/chnl_prvws_ovr/img5.jpg" },
			{ chnlID: "img/chnl_imgs/Channels27.jpg", sgstdScrn: "img/chnl_prvws/salsadancing.jpg", sgstdTme: "11pm", sgstdDsc: "Salsa", sgstdDscImg: "img/chnl_prvws_ovr/img6.jpg" },
			{ chnlID: "img/chnl_imgs/Channels12.jpg", sgstdScrn: "img/chnl_prvws/Nowy-Dziennik-TV1.jpg", sgstdTme: "9am", sgstdDsc: "Noticero", sgstdDscImg: "img/chnl_prvws_ovr/img3.jpg" },
			{ chnlID: "img/chnl_imgs/Channels9.jpg", sgstdScrn: "img/chnl_prvws/app-tv-remote.jpg", sgstdTme: "5am", sgstdDsc: "Tutorial", sgstdDscImg: "img/chnl_prvws_ovr/img2.jpg" },
			{ chnlID: "img/chnl_imgs/Channels21.jpg", sgstdScrn: "img/chnl_prvws/banner2.jpg", sgstdTme: "12pm", sgstdDsc: "Fifa Soccer", sgstdDscImg: "img/chnl_prvws_ovr/img1.jpg" },
			{ chnlID: "img/chnl_imgs/Channels3.jpg", sgstdScrn: "img/chnl_prvws/newsreport.jpg", sgstdTme: "10am", sgstdDsc: "Euro News", sgstdDscImg: "img/chnl_prvws_ovr/img7.jpg" },
			{ chnlID: "img/chnl_imgs/Channels11.jpg", sgstdScrn: "img/chnl_prvws/img1.jpg", sgstdTme: "9am", sgstdDsc: "Animal Planet", sgstdDscImg: "img/chnl_prvws_ovr/img6.jpg" }

		];
		
		var usrScrnClasses = [
				{ className: "sgstdChnl" }, 
				{ className: "sgstdChnl_open"}, 
				{ className: "posNlne" },
			    { className: "front"},
			    { className: "back"}
			];
				
		//var usrCntnt = { dCntnt: "here lies all the " };
		
		var usrScrnFctry = {};
			usrScrnFctry.getUsrData = function(){ return usrMnScrn; };
			usrScrnFctry.getUsrSubData = function(){ return usrSubScrn; };
			usrScrnFctry.getUsrFavs = function(){ return usrFavs; };
			usrScrnFctry.getUsrSgstns = function(){ return usrSgstns; };
			usrScrnFctry.getUsrClass = function(){ return usrScrnClasses; };
			
			//usrScrnFctry.getUsrCntnt = function(){ return usrCntnt; };
			
			usrScrnFctry.sendUsrData = function(){
			
			};
		return usrScrnFctry;
		
	})
	
	.factory('usrGuideFctry', function(){
		/*
		var usrGuide = { 
					gdeTme: [
						{ '_12pm': 
							[
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title1', gdeDesc:'show description1' },
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title2', gdeDesc:'show description2' },
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title3', gdeDesc:'show description3' },
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title4', gdeDesc:'show description4' }
							]
					 	},
						
						{ '1pm': 
							[
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title1a', gdeDesc:'show description1a' },
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title2a', gdeDesc:'show description2a' },
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title3a', gdeDesc:'show description3a' },
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title4a', gdeDesc:'show description4a' }
							]
					 	},
						
						{ '2pm': 
							[
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title1b', gdeDesc:'show description1b' },
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title2b', gdeDesc:'show description2b' },
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title3b', gdeDesc:'show description3b' },
								{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title4b', gdeDesc:'show description4b' }
							]
					 	}
					 
					]
				
				};
		
		
		var usrGuide = [
					{'_12pm': [
						{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title1', gdeDesc:'show description1' },
						{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title2', gdeDesc:'show description2' },
						{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title3', gdeDesc:'show description3' }
						
					]},
					{'_1pm': [
						{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title1a', gdeDesc:'show description1a' },
						{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title2a', gdeDesc:'show description2a' },
						{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title3a', gdeDesc:'show description3a' }
						
					]},
					{'_2pm': [
						{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title1b', gdeDesc:'show description1b' },
						{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title2b', gdeDesc:'show description2b' },
						{ gdeChnl:'img/apple-touch-icon.png', gdeTtl: 'tv show title3b', gdeDesc:'show description3b' }
						
					]}
					
					
				];
		*/
		
			
		var _12pm = [
				{ gdeChnl:'img/chnl_imgs/Channels1.jpg', gdeTtl: 'tv show title1', gdeDesc:'show description1' },
				{ gdeChnl:'img/chnl_imgs/Channels2.jpg', gdeTtl: 'tv show title2', gdeDesc:'show description2' },
				{ gdeChnl:'img/chnl_imgs/Channels3.jpg', gdeTtl: 'tv show title3', gdeDesc:'show description3' },
				{ gdeChnl:'img/chnl_imgs/Channels11.jpg', gdeTtl: 'tv show title1', gdeDesc:'show description1' },
				{ gdeChnl:'img/chnl_imgs/Channels12.jpg', gdeTtl: 'tv show title2', gdeDesc:'show description2' },
				{ gdeChnl:'img/chnl_imgs/Channels13.jpg', gdeTtl: 'tv show title3', gdeDesc:'show description3' }
		];
		var _1pm = [
				{ gdeChnl:'img/chnl_imgs/Channels4.jpg', gdeTtl: 'tv show title1a', gdeDesc:'show description1a' },
				{ gdeChnl:'img/chnl_imgs/Channels5.jpg', gdeTtl: 'tv show title2a', gdeDesc:'show description2a' },
				{ gdeChnl:'img/chnl_imgs/Channels6.jpg', gdeTtl: 'tv show title3a', gdeDesc:'show description3a' }
		];
		var _2pm = [
				{ gdeChnl:'img/chnl_imgs/Channels17.jpg', gdeTtl: 'tv show title1b', gdeDesc:'show description1b' },
				{ gdeChnl:'img/chnl_imgs/Channels18.jpg', gdeTtl: 'tv show title2b', gdeDesc:'show description2b' },
				{ gdeChnl:'img/chnl_imgs/Channels19.jpg', gdeTtl: 'tv show title3b', gdeDesc:'show description3b' }
		];
		var _3pm = [
				{ gdeChnl:'img/chnl_imgs/Channels24.jpg', gdeTtl: 'tv show title1c', gdeDesc:'show description1c' },
				{ gdeChnl:'img/chnl_imgs/Channels25.jpg', gdeTtl: 'tv show title2c', gdeDesc:'show description2c' },
				{ gdeChnl:'img/chnl_imgs/Channels26.jpg', gdeTtl: 'tv show title3c', gdeDesc:'show description3c' }
		];
		var _4pm = [
				{ gdeChnl:'img/chnl_imgs/Channels23.jpg', gdeTtl: 'tv show title1d', gdeDesc:'show description1d' },
				{ gdeChnl:'img/chnl_imgs/Channels28.jpg', gdeTtl: 'tv show title2d', gdeDesc:'show description2d' },
				{ gdeChnl:'img/chnl_imgs/Channels29.jpg', gdeTtl: 'tv show title3d', gdeDesc:'show description3d' }
		];
		var _5pm = [
				{ gdeChnl:'img/chnl_imgs/Channels4.jpg', gdeTtl: 'tv show title1e', gdeDesc:'show description1e' },
				{ gdeChnl:'img/chnl_imgs/Channels15.jpg', gdeTtl: 'tv show title2e', gdeDesc:'show description2e' },
				{ gdeChnl:'img/chnl_imgs/Channels16.jpg', gdeTtl: 'tv show title3e', gdeDesc:'show description3e' }
		];
		var _6pm = [
				{ gdeChnl:'img/chnl_imgs/Channels7.jpg', gdeTtl: 'tv show title1f', gdeDesc:'show description1f' },
				{ gdeChnl:'img/chnl_imgs/Channels18.jpg', gdeTtl: 'tv show title2f', gdeDesc:'show description2f' },
				{ gdeChnl:'img/chnl_imgs/Channels29.jpg', gdeTtl: 'tv show title3f', gdeDesc:'show description3f' }
		];
		
		
		
		var usrGdeFctry = {};
			usrGdeFctry.getGdeData1 = function(){ return _12pm; };
			usrGdeFctry.getGdeData2 = function(){ return _1pm; };
			usrGdeFctry.getGdeData3 = function(){ return _2pm; };
			usrGdeFctry.getGdeData4 = function(){ return _3pm; };
			usrGdeFctry.getGdeData5 = function(){ return _4pm; };
			usrGdeFctry.getGdeData6 = function(){ return _5pm; };
			usrGdeFctry.getGdeData7 = function(){ return _6pm; };
			
			
			/*usrGdeFctry.getGdeData_unit = function(){
				return usrGuide.gdeTme;
			};
			
			usrGdeFctry.sendGdeData = function(){
			
			};*/
		return usrGdeFctry;
		
	})
	
	
	.controller('myController', function($scope, myFactory){
		
		/// === orig === ////
		$scope.usrDataFile = {
			"prefs": "vws/usrPrefs.html",
			"cntnt": "vws/usrScrns.html",
			"guide": "vws/usrGuide.html"
		}

	})
	
	.controller('usrPrefsCntrlr', function($scope, usrPrefsFctry){
		$scope.usrData = [];
		$scope.usrPrfrdChnls = [];
		
		init();
		function init(){
			$scope.usrData = usrPrefsFctry.getUsrData();
			$scope.usrPrfrdChnls = usrPrefsFctry.getPrfrdChnls();
		}
		
	})
	
	.controller('usrScrnsCntrlr', function($scope, usrScrnsFctry){
		
		
		$scope.usrMnScrn = {};
		$scope.usrSubScrn = {};
		$scope.usrFavs = [];
		$scope.usrSgstns = [];
		$scope.usrScrnClasses = {};
		$scope.usrCntnt = {};
		
		init();
		function init(){
			$scope.usrMnScrn = usrScrnsFctry.getUsrData();
			$scope.usrSubScrn = usrScrnsFctry.getUsrSubData();
			$scope.usrFavs = usrScrnsFctry.getUsrFavs();
			$scope.usrSgstns = usrScrnsFctry.getUsrSgstns();
			$scope.usrScrnClasses = usrScrnsFctry.getUsrClass();
			//$scope.usrCntnt = usrScrnsFctry.getUsrCntnt();
			
		}
		
			
		
		
		///// =============================================== /////
		///// ========= SELECTED CHANNEL TRANSITION ========= /////
		///// =============================================== /////

		$scope.selectedIndex = -1; // Whatever the default selected index is, use -1 for no selection

	    $scope.itemClicked = function ($index) {
			//console.log($index);
			//$index.preventDefault();
	    	$scope.selectedIndex = $index;
			

			/// --- FLIPCARD END --- ///
			
	    };
		
		
		
		///// ============================================== /////
		///// ======== TOKEN AUTHENTICATION SEGMENT ======== /////
		///// ============================================== /////
		
			
			var key = "uFhpKCsBgF9KLlHT0E9rmQ";
			var dKey = "";
			var gen = 5;
			var error = "";
			
			var trnBck = 60 * 10;
			var mDate = new Date();
			//var gTime = mDate.getTime();
			var sTime = Date.parse(mDate)/1000;
			var sTime = sTime - trnBck;
			//var sTime = "1428600830";
			console.log(sTime);
			///var time = mDate.AddSeconds(1268927156 );
			//alert(gTime);
			
			//alert(mDate +" - "+ sTime);
			var timespan = 60 * 20;
			var eTime = sTime + timespan;
			
			//var uri = "http://yiptv-cosmovision.hls.adaptive.level3.net/hls-live/yiptvlive-cosmovision/_definst_/live.m3u8";
			//var uri = "http://yiptv-tele_pacifico.hls.adaptive.level3.net/hls-live/yiptvlive-tele_pacifico/_definst_/live.m3u8?";
			//var uri = "http://yiptv-cosmovision.hls.adaptive.level3.net/hls-live/yiptvlive-cosmovision/_definst_/live.m3u8?valid_from=1428345514&valid_to=1428346714&hash=5d05c22b69a1bd753935d"
			//var nStime = "1428425595", nEtime = "1428426795";
			//var uri = "/hls-live/yiptvlive-cosmovision/_definst_/live.m3u8";
			//var uri = "/yiptv4/beinengov/appleman.m3u8";
			//"http://yiptv-tele_caribe.hls.adaptive.level3.net/hls-live/yiptvlive-tele_caribe/_definst_/live.m3u8?valid_from=1431356215&valid_to=1431357415&hash=959326380c0ba8ef7a31a";
			var uri = "/hls-live/yiptvlive-tele_caribe/_definst_/live.m3u8";
			
			//var uri = "/hls-live/yiptvlive-tele_pacifico/_definst_/live.m3u8";
				uri += "?valid_from="+sTime+"&valid_to="+eTime;
				//uri += "valid_from="+nStime+"&valid_to="+nEtime;
			
			//console.log(sTime +" - "+ eTime+" - "+timespan+" = "+ uri );
			//var stime = "20150405080000";
			//var etime = "20150408080000";
			
			
		
			if  (gen < 0 || gen > 9){
				error = "ERROR: Invalid GEN value";
			}
				if (key.length < 20 || key.length > 64){
					error = "ERROR: Invalid key length";
				}
					if (uri.length < 1){
						error = "ERROR: No URI provided";
					}
						if (error.length > 0) {
							document.getElementById('errTest').innerHTML = error;
						} else {
							var hmac = Crypto.HMAC(Crypto.SHA1, uri, key);
							
							//var hmac = CryptoJS.HmacSHA1(Crypto.SHA1, uri, key);
							//var hmac = CryptoJS.HmacSHA1(Crypto.SHA1, uri, key);
							//var hmac = CryptoJS.SHA1(Crypto.SHA1, uri, key);
								//hmac = hmac.toString();
							console.log('this is hmac length: '+hmac.length);
							//console.log(strlen(hmac));
							if (hmac.length > 20) {
								hmac = hmac.substr(0, 20);
								console.log('this is my hmac: '+hmac);
							}
							//console.log('this is my hmac1: '+hmac);
							//document.getElementById('errTest').innerHTML ="<a href='" +uri+"&hash="+gen+hmac+"'> click here </a>";
							//document.getElementById('errTest').innerHTML ="<a href='" +uri+"&hash=6c40d041b87e693f441ec'> click here </a>";
							
						}

	
				
			///// ================================================ /////
			///// ============ JWPLAYER MODULE SCRIPT ============ /////
			///// ================================================ /////
	
			// jwplayer("myPlayer").setup({
// 				// good for fullScrn //
// 				// width: "100%",    //
// 				// aspectratio: "16:9"//
// 				width: 902,
// 				height: 370,
// 				sources: [
// 					//{ file: "http://yiptv4-live.hls.adaptive.level3.net"+uri+"&hash=5"+hmac }
// 					//{ file: "http://yiptv-tele_pacifico.hls.adaptive.level3.net"+uri+"&hash=5"+hmac }
// 					{ file: "http://yiptv-tele_caribe.hls.adaptive.level3.net"+uri+"&hash="+gen+hmac }
// 				],
// 				rtmp: {
// 					bufferlength: 3
// 					//securetoken: "ge8Cjn0YTcUYqU6xSmVgpA",
// 				},
// 				primary: 'flash',
// 		        modes: [
// 		            {
// 						'type': 'flash',
// 						'src': 'js/jwplayer/jwplayer.flash.swf'
// 					}
// 		        ],
// 				image: "img/friend-banner.jpg",
// 				androidhls: true,
// 				autostart: false,
// 				fallback: false
//
// 			});
	
			/// --- SUB PLAYER MODULE --- ///
			jwplayer("subPlayer").setup({
				// good for fullScrn //
				// width: "100%",    //
				// aspectratio: "16:9"//
				width: 320,
				height: 180,
				sources: [
					{ file: "http://yiptv-tele_pacifico.hls.adaptive.level3.net"+uri+"&hash="+gen+hmac }
					//{ file: "http://yiptv-tele_caribe.hls.adaptive.level3.net"+uri+"&hash="+gen+hmac } 
				],
				rtmp: {
					bufferlength: 3
					//securetoken: "ge8Cjn0YTcUYqU6xSmVgpA",
				},
				primary: 'flash',
		        modes: [
		            { 
						'type': 'flash', 
						'src': 'js/jwplayer/jwplayer.flash.swf' 
					}
		        ],
				image: "img/friend-banner.jpg",
				androidhls: true,
				autostart: false,
				fallback: false
		
			});
	
			///// ================================================ /////
	
	
	})
	
	.controller('usrGuideCntrlr', function($scope, usrGuideFctry){
		//$scope.usrDataPrefs = 
		var guideTime;
		
		//$scope.usrGuide = [];
		$scope._12pm = [];
		//$scope.usrGuide.gdeTme = guideTime;
		
		init();
		function init(){
			//$scope.usrGuide = usrGuideFctry.getGdeData();
			$scope._12pm = usrGuideFctry.getGdeData1();
			$scope._1pm = usrGuideFctry.getGdeData2();
			$scope._2pm = usrGuideFctry.getGdeData3();
			$scope._3pm = usrGuideFctry.getGdeData4();
			$scope._4pm = usrGuideFctry.getGdeData5();
			$scope._5pm = usrGuideFctry.getGdeData6();
			$scope._6pm = usrGuideFctry.getGdeData7();
			//$scope.guideTime = usrGuideFctry.getGdeData_unit();
		}
		
	})
	
	

/*
*
* /// OPTION THREE FOR BINDING DATA ///
*
*

	controllers.myController = function($scope){
		$scope.isPopupVisible = false;

		$scope.showPopup = function(email){
			$scope.isPopupVisible = true;
			$scope.selectedEmail = email;
	
		}	

		$scope.closePopup = function(){
			$scope.isPopupVisible = false;
		}
		
		$scope.emails = [
			{ from: 'Danny', subject: 'for your eye\'s only', date: 'March 17' },
			{ from: 'David', subject: 'for your eye\'s only', date: 'March 18' },
			{ from: 'Dorothy', subject: 'for your eye\'s only', date: 'March 19' }
		]; 
		
		$scope.addCustomer = function(){
			$scope.emails.push({
				from: $scope.newCustomer.from,
				subject: $scope.newCustomer.subject,
				date: $scope.newCustomer.date
			});
		};
	
	}
	
	
	myDemoApp.controller(controllers);
	*/

}(angular.module('app')));