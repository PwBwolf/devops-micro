(function (app) {
    'use strict';

    app.factory('homePrefsSvc', [function () {
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
    }]);
}(angular.module('app')));
