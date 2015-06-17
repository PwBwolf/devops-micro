(function (app) {
    'use strict';

    app.factory('accesskeysvc', [function () {
		var keyTokens = [
			{ key: '0', token: '3UFExM7kHJGKb6VsmKTC9A' },
			{ key: '1', token: 'ge8Cjn0YTcUYqU6xSmVgpA' },
			{ key: '2', token: 'oipBIlT4mdQ4S42R1uyigQ' },
			{ key: '3', token: 'K0qQJNN3yx1hLOd6RWVH1w' },
			{ key: '4', token: 'JI3ucpLndFOcGvJTVQt88w' },
			{ key: '5', token: 'uFhpKCsBgF9KLlHT0E9rmQ' },
			{ key: '6', token: 'qtFR0CUaJOpWIrv2BxAUzQ' },
			{ key: '7', token: '0pK8xLdN1a08cgePPXNuzQ' },
			{ key: '8', token: 'WL89I5HDQ2k4EQOKsR1dsw' },
			{ key: '9', token: 'EjZt5Cjl3j8fCes5ez5v6Q' }
		];
		
		//var kTkn = keyTokens.length;
		var kTkn = keyTokens[Math.floor(Math.random()*keyTokens.length)];
		//console.log('key: '+kTkn.key+' token: '+kTkn.token);
		
		var accessKeyFctry = {};
			accessKeyFctry.getRndmData = function(){ return kTkn; };
			accessKeyFctry.getAllData = function(){ return keyTokens; };
			//accessKeyFctry.getUsrSubData = function(){ return usrSubScrn; };
			
			accessKeyFctry.sendUsrData = function(){
			
			};
			
		
		return accessKeyFctry;
		
    }]);
}(angular.module('app')));