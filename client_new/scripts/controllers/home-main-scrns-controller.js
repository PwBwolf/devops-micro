(function (app) {
    'use strict';

    app.controller('homeScrnsCtrl', ['$scope', '$filter', 'homeScrnsSvc', 'accessurlsvc', 'accesskeysvc', function ($scope, $filter, homeScrnsSvc, accessurlsvc, accesskeysvc) {
		$scope.usrMnScrn = {};
		$scope.usrSubScrn = {};
		$scope.usrFavs = [];
		$scope.usrSgstns = [];
		$scope.usrScrnClasses = {};
		$scope.usrCntnt = {};
		//$scope.special = {};
		$scope.allChannels = [];
		$scope.prodLvls = [];
		$scope.fullShowDesc = [];
		
		$scope.keyTokens = [];
		$scope.kTkn = [];
		$scope.showTheFile = function(){
			//var tID = event.target.id;
			return true;
			//if($(this).id === 'my-player'){
			//	return true
				//}
			//console.log('Tis: '+tID);
			/*
			switch(tID){
				case 'my-player':
					return true;
					break;
				default:
					return false;
					break;
				
			};
			*/
		};
		
		init();
		function init(){
			
			$scope.usrMnScrn = homeScrnsSvc.getUsrData();
			$scope.usrSubScrn = homeScrnsSvc.getUsrSubData();
			$scope.usrFavs = homeScrnsSvc.getUsrFavs();
			$scope.usrSgstns = homeScrnsSvc.getUsrSgstns();
			$scope.usrScrnClasses = homeScrnsSvc.getUsrClass();
			
			$scope.allChannels = accessurlsvc.getAllData();
			$scope.prodLvls = accessurlsvc.getProdStatus();
			$scope.fullShowDesc = accessurlsvc.getShowDesc();
			
			$scope.keyTokens = accesskeysvc.getAllData();
			$scope.kTkn = accesskeysvc.getRndmData();
			
			var mytest;
			//$scope.usrCntnt = usrScrnsFctry.getUsrCntnt();
			$scope.callMyTest = mytest;
			//$scope.special = accessurlsvc.getSpecial();
		}
		
		
		$scope.selectedIndex = -1; // Whatever the default selected index is, use -1 for no selection

	    $scope.itemClicked = function ($index) {
	    	$scope.selectedIndex = $index; // Flip card on click
	    };
		
		
		
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
		//var cnvrtdTme = $scope.usrFavs;	 
		//var dCnvrtdTme = cnvrtdTme.favShwTme;		
		//console.log('this is time: '+cnvrtdTme[1].favShwTme);
		//angular.forEach(cnvrtdTme.favShwTme, function(value, key){
			//console.log('value: '+value+' key: '+key);
			//var dCrntTme = Date.parse(value)/1000;
			//console.log('this is converted: '+dCrntTme+' and key: '+key);
			//});
		
		
		//console.log('this is me: ' +$scope.usrFavs[0].favDesc);
		//console.log('this is from: '+$scope.usrSgstns[4].chnlIdImg);
		//console.log('this is why: ' +$scope.prodLvls[2].lvlStatus);
		//console.log('this is test: ' +$scope.allChannels[1].streamLoc);
		
		//console.log('this is '+$scope.special[0].dname+' dname');
		//console.log('call test '+$scope.callMyTest.testing; );
		//function mytest($scope){
		//	$scope.testing = "hottness!";
		//	
		//}
		//console.log('hmac is: '+hmac);
		
		/// === new test === ///
		
		//var chnlIdImg;
		
		//var bUrl = $scope.allChannels[0].baseUrl;
		//var bUri = $scope.allChannels[0].streamLoc;
		
		
		var key = $scope.kTkn.key;
		var token = $scope.kTkn.token;
		var error = "";
		
		var trnBck = 60 * 10;
		var mDate = new Date();
		
		var testDate = "2015-06-05T14:30Z";
		var testTime = Date.parse(testDate)/1000;
		
		var sTime = Date.parse(mDate)/1000;
		var sTime = sTime - trnBck;
		var timespan = 60 * 20;
		var eTime = sTime + timespan;
		
		
		//var fUri = bUri+"?valid_from="+sTime+"&valid_to="+eTime;
		//console.log('baseurl: '+bUrl+' baseURI: '+fUri+' key: '+key+' token: '+token+' sTime: '+sTime+' eTime: '+eTime);
		
		
		
		
		
		$scope.createH = function(show){
			//console.log('this is clicked: '+show+', startTime: '+sTime+' testTime: '+testTime);
			var sT = $scope.fullShowDesc[0].program.tmsId;
			
			var showDtls = $filter('filter')($scope.allChannels, {tmsId:show})[0];
			var showStartTime = $filter('filter')($scope.usrFavs, {tmsId:show})[0];
			
			var showFullDesc = $filter('filter')($scope.fullShowDesc, {sT:show})[0];   
			
			var bUrl = showDtls.baseUrl;
			var bUri = showDtls.streamLoc;
			var fUri = bUri+"?valid_from="+sTime+"&valid_to="+eTime;
			
			//var shwStrt = showFullDesc.strtTme;
			
			
			
			//console.log('streamLoc: '+fUri);
			console.log('baseurl: '+bUrl+' baseURI: '+fUri+' key: '+key+' token: '+token+' sTime: '+sTime+' eTime: '+eTime);
			
			//var myobject = $filter('filter')($scope.allChannels, function(t){
				//console.log('it: '+t[0].chnlId);
				//return t.chnlId === chnl;
				
				//});
				if(sTime){
					setupPlayer(bUrl, bUri, fUri);
						
					
					
				} else {
					setPromotion(strtTme, endTme, duration, stationId, program);
				}
			
				//setupPlayer();
				
		};
		
		function setPromotion(){
			
			
			$scope.showTheFile = function(){
				//return true;
			}
		}
		
		function setupPlayer(bUrl, bUri, fUri){
			console.log('stream is: '+fUri);
			
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
									//[].push.apply($scope.special, tname);
									if (hmac.length > 20){
										hmac = hmac.substr(0, 20);
									}
									//$scope.showTheFile = function(){
										//$scope.showTheFile = true;
										//};
								}
								
								
								console.log('this is hmac: '+hmac);
								
														
								//return hmac;
			
			
			//}
		
		//console.log('this is '+$scope.special[0].dtype+' dType');
		
		
		
		/// --- ng-click button function --- ///
		//createH(chnlIdImg);
		
		
		
		
		
		
		
		
		
		
			///// ================================================ /////
			///// ============ JWPLAYER MODULE SCRIPT ============ /////
			///// ================================================ /////
		
			/// temp content delete before production ///
		
		
		
		//$scope.dPlayer = function (){
			//console.log('player started');
			
			
			jwplayer("my-player").setup({
				// good for fullScrn //
				// width: "100%",    //
				// aspectratio: "16:9"//
				
				width: 902,
				height: 370,
				playlist: [{
					image: "../images/friend-banner.jpg",
					sources: [
						//{ file: "http://yiptv-tele_caribe.hls.adaptive.level3.net" }
						{ file: bUrl+fUri+"&hash="+key+hmac }
					],
				}],
				rtmp: {
					bufferlength: 3
				},
				primary: 'flash',
		        modes: [
		            {
						'type': 'flash',
						'src': 'scripts/config/jwplayer/jwplayer.flash.swf'
					}
		        ],
				//androidhls: true,
				autostart: true,
				fallback: false
				
			});
			
					/*$scope.showTheFile = function(){
						return true;
					};*/
			
			
			
						/// --- SUB PLAYER MODULE --- ///
						/*
						jwplayer("sub-player").setup({
							// good for fullScrn //
							// width: "100%",    //
							// aspectratio: "16:9"//
				
							width: 320,
							height: 180,
							sources: [
								{ file: bUrl+fUri+"&hash="+key+hmac }
							],
							rtmp: {
								bufferlength: 3
							},
							primary: 'flash',
					        modes: [
					            { 
									'type': 'flash', 
									'src': 'scripts/config/jwplayer/jwplayer.flash.swf' 
								}
					        ],
							image: "images/friend-banner.jpg",
							//androidhls: true,
							autostart: true,
							fallback: false
				
						});
						*/
			
			
			
		};
			
			
			
		
    }]);
}(angular.module('app')));
