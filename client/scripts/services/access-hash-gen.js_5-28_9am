(function (app) {
    'use strict';

    app.service('accesshashgen', ['$scope', 'accessurlsvc', 'accesskeysvc', function ($scope, accessurlsvc, accesskeysvc) {
        /*
        $scope.allChannels = [];
        		$scope.prodLvls = [];
        		$scope.keyTokens = [];
        		$scope.kTkn = {};*/
		$scope.keyTokens = [];
		$scope.kTkn = [];
		
		init();
		function init(){
			$scope.keyTokens = accesskeysvc.getAllData();
			$scope.kTkn = accesskeysvc.getRndmData();
			
		}
		
        //var access = accesskeysvc.keyTokens;
		
		//var usrHashSrvc = {};
			//usrHashSrvc.getChnlHash = function(){ return access; };
		
		//return usrHashSrvc;
        //return access;
		console.log('this is kTkn: '+$scope.kTkn.key);
		/*
		this.createHash = function(uri, gen, key) {
			    		  
				var key = acceskeysvc.getAllData;
				var dKey = "";
				var gen = 5;
				var error = "";
		
				var trnBck = 60 * 10;
				var mDate = new Date();
				var sTime = Date.parse(mDate)/1000;
				var sTime = sTime - trnBck;
		
				console.log('this is the key: '+key);

				var timespan = 60 * 20;
				var eTime = sTime + timespan;
		
				//var uri = "http://yiptv-cosmovision.hls.adaptive.level3.net/hls-live/yiptvlive-cosmovision/_definst_/live.m3u8";
				//var uri = "http://yiptv-tele_pacifico.hls.adaptive.level3.net/hls-live/yiptvlive-tele_pacifico/_definst_/live.m3u8?";

				var uri = "/hls-live/yiptvlive-tele_caribe/_definst_/live.m3u8";
					uri += "?valid_from="+sTime+"&valid_to="+eTime;

	
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
								console.log('this is hmac length: '+hmac.length);
								if (hmac.length > 20) {
									hmac = hmac.substr(0, 20);
									console.log('this is my hmac: '+hmac);
								}
								console.log('this is my hmac1: '+hmac);
					
							}
						  
						  
						  
				//return hmac;
						  
						  
						  
						   /*
			    		   element.bind('click', function () {
			    		   							   console.log('you clicked ');
			    		   			                   //element.html('You clicked me!');
			    		   			               });
			    		   			               element.bind('mouseenter', function () {
			    		   							   console.log('you mouseenter');
			    		   			                   //element.css('background-color', 'yellow');
			    		   			               });
			    		   			               element.bind('mouseleave', function () {
			    		   							   console.log('you mouseleave');
			    		   			                   //element.css('background-color', 'white');
			    		   			               }); /
			    		   
        };
		*/
    }]);
}(angular.module('app')));
