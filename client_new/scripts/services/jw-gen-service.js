(function (app) {
    'use strict';

	app.service('jwgensrvc', ['accessurlsvc', function(accessurlsvc){
		var chnlID;
		$scope.allChannels = [];
		$scope.prodLvls = [];
		//var bUrl = accessurlsvc.allChannels[0].baseUrl;
		//var bUri = allChannels[0].streamLoc;
		//var key = kTkn.key;
		//var token = kTkn.token;
		var error = "";
		
		var trnBck = 60 * 10;
		var mDate = new Date();
		var sTime = Date.parse(mDate)/1000;
		var sTime = sTime - trnBck;
		var timespan = 60 * 20;
		var eTime = sTime + timespan;
		
		
		//var fUri = bUri+"?valid_from="+sTime+"&valid_to="+eTime;
		//console.log('baseurl: '+bUrl+' baseURI: '+fUri+' key: '+key+' token: '+token+' sTime: '+sTime+' eTime: '+eTime);
		init();
		
		function init() {
			$scope.allChannels = accessurlsvc.getAllData();
			$scope.prodLvls = accessurlsvc.getProdStatus();
			
			//var bUrl = $scope.allChannels[0].baseUrl;
			//var bUri = $scope.allChannels[0].streamLoc;
		}
		
		
		//}]);




	/*
    app.service('jwgensrvc', ['accessurlsvc', 'accesskeysvc', function ($scope, accessurlsvc, accesskeysvc) {
        
        $scope.allChannels = [];
        $scope.prodLvls = [];
        $scope.special = [];
		
		$scope.keyTokens = [];
		$scope.kTkn = [];
		
		init();
		function init(){
			$scope.allChannels = accessurlsvc.getAllData();
			$scope.prodLvls = accessurlsvc.getProdStatus();
			$scope.special = accessurlsvc.getSpecial();
			
			$scope.keyTokens = accesskeysvc.getAllData();
			$scope.kTkn = accesskeysvc.getRndmData();
			
			$scope.callMyTest = mytest;
			
		}
		
        var access = $scope.kTkn.token;
		var lvl = $scope.prodLvls[2].lvlStatus;
		var dSpcl = $scope.special[1].dtype;
	*/
		//var usrHashSrvc = {};
			//usrHashSrvc.getChnlHash = function(){ return access; };
		//return usrHashSrvc;
		
		/*
		function mytest($scope){
			$scope.testing = "hottness!";
			
		}
		
		console.log('this is kTkn: '+access+' special: '+dSpcl);
		console.log('these are prodLvls: '+lvl);
		*/
		
		
		/// === new test === ///
		/*
		var chnlID;
		
		var bUrl = $scope.allChannels[0].baseUrl;
		var bUri = $scope.allChannels[0].streamLoc;
		var key = $scope.kTkn.key;
		var token = $scope.kTkn.token;
		var error = "";
		
		var trnBck = 60 * 10;
		var mDate = new Date();
		var sTime = Date.parse(mDate)/1000;
		var sTime = sTime - trnBck;
		var timespan = 60 * 20;
		var eTime = sTime + timespan;
		
		
		var fUri = bUri+"?valid_from="+sTime+"&valid_to="+eTime;
		console.log('baseurl: '+bUrl+' baseURI: '+fUri+' key: '+key+' token: '+token+' sTime: '+sTime+' eTime: '+eTime);
		*/
		
		
		
		/*
		function createH(chnlID){
			
			var tname = [
				{ dname: 'timmy', dtype: 'thomas'},
				{ dname: 'crafty', dtype: 'masking'}
			];
			
			if (key < 0 || key > 9){
					error = "Error: Invalid KEY value";
				}
					if (token.length < 20 || token.length > 64){
						error = "Error: Invalid key length";
					}
						if (fUri.length < 1){
							error = "Error: No URI found";
						}
							if (error.length > 0){
								document.getElementById('errLog').innerHTML = error;
							} else {
								var hmac = Crypto.HMAC(Crypto.SHA1, fUri, token);
									[].push.apply($scope.special, tname);
								}
								
								if (hmac.length > 20){
									hmac = hmac.substr(0, 20);
									
								}
								//console.log('this is hmac: '+hmac+' and: '+$scope.special.dtype);
								
														
								return hmac;
			
		}
		
		console.log('this is '+$scope.special[0].dtype+' dType');
		
		
		
		/// --- ng-click button function --- ///
		createH(chnlID);
		*/
		
		//return access;
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
    }])
}(angular.module('app')));
