(function (app) {
    'use strict';

    app.factory('homeScrnsSvc', [function () {
		var usrMnScrn = { mnView: "images/friend-banner.jpg", mnChnl: "images/apple-touch-icon.png"} ;
		var usrSubScrn = { subView: "images/globe.jpg", subChnl: "images/chnl_imgs/Channels32.jpg" };
		
		var usrFavs = [
			{ chnlId: '30402', chnlIdImg: "images/chnl_imgs/Channels21.jpg", tmsId: 'SH006883590000', favScrn: 'images/chnl_prvws/natgeo.jpg', favShwTme: "3pm", favDesc: 'Deep Sea Giants' },
			{ chnlId: '76942', chnlIdImg: "images/chnl_imgs/Channels1.jpg", tmsId: 'SH015465320000', favScrn: 'images/chnl_prvws/banner5.jpg', favShwTme: "6pm", favDesc: 'Fifa Qualifier' },
			{ chnlId: '75044', chnlIdImg: "images/chnl_imgs/Channels11.jpg", tmsId: 'SH015466000000', favScrn: 'images/chnl_prvws/banner4.jpg', favShwTme: "7pm", favDesc: 'Lady Gaga Benefit Concert' },
			{ chnlId: '55912', chnlIdImg: "images/chnl_imgs/Channels9.jpg", tmsId: 'SH015465720000', favScrn: 'images/chnl_prvws/nicki-M.jpg', favShwTme: "9pm", favDesc: 'Interview with Nicki Minaj' }
		];
		var usrSgstns = [
			{ chnlId: '74917', chnlIdImg: "images/chnl_imgs/Channels31.jpg", sgstdScrn: "images/chnl_prvws/tribs.jpg", sgstdTme: "4am", sgstdDsc: "Biography", sgstdDscImg: "images/chnl_prvws_ovr/img1.jpg", sgstdDscCntnt: "Dan is an old Scandinavian given name with disputed meaning. Dan is also a Hebrew given name, after Dan, the fifth son of Jacob with Bilhah and founder of the Israelite Tribe of Dan. " },
			{ chnlId: '', chnlIdImg: "images/chnl_imgs/Channels27.jpg", sgstdScrn: "images/chnl_prvws/salsadancing.jpg", sgstdTme: "11pm", sgstdDsc: "Salsa", sgstdDscImg: "images/chnl_prvws_ovr/img3.jpg" },
			{ chnlId: '', chnlIdImg: "images/chnl_imgs/Channels12.jpg", sgstdScrn: "images/chnl_prvws/Nowy-Dziennik-TV1.jpg", sgstdTme: "9am", sgstdDsc: "Noticero", sgstdDscImg: "images/chnl_prvws_ovr/img7.jpg" },
			{ chnlId: '', chnlIdImg: "images/chnl_imgs/Channels9.jpg", sgstdScrn: "images/chnl_prvws/app-tv-remote.jpg", sgstdTme: "5am", sgstdDsc: "Tutorial", sgstdDscImg: "images/chnl_prvws_ovr/img2.jpg" },
			{ chnlId: '', chnlIdImg: "images/chnl_imgs/Channels21.jpg", sgstdScrn: "images/chnl_prvws/banner2.jpg", sgstdTme: "12pm", sgstdDsc: "Fifa Soccer", sgstdDscImg: "images/chnl_prvws_ovr/img4.jpg" },
			{ chnlId: '', chnlIdImg: "images/chnl_imgs/Channels3.jpg", sgstdScrn: "images/chnl_prvws/newsreport.jpg", sgstdTme: "10am", sgstdDsc: "Euro News", sgstdDscImg: "images/chnl_prvws_ovr/img5.jpg" },
			{ chnlId: '', chnlIdImg: "images/chnl_imgs/Channels27.jpg", sgstdScrn: "images/chnl_prvws/salsadancing.jpg", sgstdTme: "11pm", sgstdDsc: "Salsa", sgstdDscImg: "images/chnl_prvws_ovr/img6.jpg" },
			{ chnlId: '', chnlIdImg: "images/chnl_imgs/Channels12.jpg", sgstdScrn: "images/chnl_prvws/Nowy-Dziennik-TV1.jpg", sgstdTme: "9am", sgstdDsc: "Noticero", sgstdDscImg: "images/chnl_prvws_ovr/img3.jpg" },
			{ chnlId: '', chnlIdImg: "images/chnl_imgs/Channels9.jpg", sgstdScrn: "images/chnl_prvws/app-tv-remote.jpg", sgstdTme: "5am", sgstdDsc: "Tutorial", sgstdDscImg: "images/chnl_prvws_ovr/img2.jpg" },
			{ chnlId: '', chnlIdImg: "images/chnl_imgs/Channels21.jpg", sgstdScrn: "images/chnl_prvws/banner2.jpg", sgstdTme: "12pm", sgstdDsc: "Fifa Soccer", sgstdDscImg: "images/chnl_prvws_ovr/img1.jpg" },
			{ chnlId: '', chnlIdImg: "images/chnl_imgs/Channels3.jpg", sgstdScrn: "images/chnl_prvws/newsreport.jpg", sgstdTme: "10am", sgstdDsc: "Euro News", sgstdDscImg: "images/chnl_prvws_ovr/img7.jpg" },
			{ chnlId: '', chnlIdImg: "images/chnl_imgs/Channels11.jpg", sgstdScrn: "images/chnl_prvws/img1.jpg", sgstdTme: "9am", sgstdDsc: "Animal Planet", sgstdDscImg: "images/chnl_prvws_ovr/img6.jpg" }

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
    }]);
}(angular.module('app')));
