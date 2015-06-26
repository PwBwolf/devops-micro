(function (app) {
    'use strict';

    app.factory('accessurlsvc', [function () {
		var prodLvls = [
			{ lvl: '3', lvlStatus: 'In Production' },
			{ lvl: '2', lvlStatus: 'Pre Production' },
			{ lvl: '1', lvlStatus: 'Pending Production' },
			{ lvl: '0', lvlStatus: 'Not in Production' }
			
		];
		
		var allChannels = [
			{ prdStatus: '2', tmsId: '', chnlID: '90917', baseUrl: 'http://yiptv-a3series.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-a3series/_definst_/live.m3u8' },
			{ prdStatus: '2', tmsId: '', chnlID: '16800', baseUrl: 'http://yiptv-antenna3.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-antenna3/_definst_/live.m3u8' },
			{ prdStatus: '1', tmsId: '', chnlID: '00000', baseUrl: 'http://yiptv2-live.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-aymsports/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: 'SH006883590000', chnlID: '92197', baseUrl: 'http://yiptv-azclick.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-azclick/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: 'SH015465320000', chnlID: '61404', baseUrl: 'http://yiptv-azcorazon.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-azcorazon/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: 'SH015466000000', chnlID: '76942', baseUrl: 'http://yiptv4-live.hls.adaptive.level3.net', streamLoc: '/yiptv4/beinengov/appleman.m3u8' },
			{ prdStatus: '3', tmsId: 'SH015465720000', chnlID: '76943', baseUrl: 'http://yiptv7-live.hls.adaptive.level3.net', streamLoc: '/yiptv7/beinespanov/appleman.m3u8' },
			{ prdStatus: '0', tmsId: '', chnlID: '76943', baseUrl: 'http://yiptv-beinespanol.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-beinespanol/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: '9154758', chnlID: '00000', baseUrl: 'http://yiptv-boliviatv.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-boliviatv/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: '9154754', chnlID: '69650', baseUrl: 'http://yiptv-canaltiempo.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-canaltiempo/_definst_/live.m3u8' },
			{ prdStatus: '2', tmsId: '', chnlID: '15213', baseUrl: 'http://yiptv-canal52.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-canal52/_definst_/live.m3u8' },
			
			{ prdStatus: '3', tmsId: '9154753', chnlID: '00000', baseUrl: 'http://yiptv-live.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-canal_america/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: '9154752', chnlID: '60271', baseUrl: 'http://yiptv-canalantiestres.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-canalantiestres/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: '9154751', chnlID: '12750', baseUrl: 'http://yiptv2-live.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-canal_sur/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: '9154750', chnlID: '55912', baseUrl: 'http://yiptv2-live.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-canal_tro/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: '9154749', chnlID: '87028', baseUrl: 'http://yiptv-elcantinazo.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-elcantinazo/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: '9154748', chnlID: '49411', baseUrl: 'http://yiptv8-live.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-caribvision/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: '9154747', chnlID: '84443', baseUrl: 'http://yiptv-cb24.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-cb24/_definst_/live.m3u8' },
			{ prdStatus: '1', tmsId: '', chnlID: '00000', baseUrl: 'http://yiptv2-live.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-cbtvmich/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: '9154746', chnlID: '75044', baseUrl: 'http://yiptv-live.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-clubbing_tv/_definst_/live.m3u8' },
			{ prdStatus: '3', tmsId: '9154745', chnlID: '65269', baseUrl: 'http://yiptv-cosmovision.hls.adaptive.level3.net', streamLoc: '/hls-live/yiptvlive-cosmovision/_definst_/live.m3u8' },
			
		];
		
		var fullShowDesc = [
			{ strtTme: '2015-06-05T16:50Z', endTme: '2015-06-05T19:00Z', duration: '130', qualifiers: ['Live', 'New'], channels: ['026'], stationId: '76942', 
				program: { 
					tmsId: 'EP014003856780',
					rootId: '11759012',
					sportsId: '199',
					subType: 'Sports Event',
					title: 'Soccer',
					eventTitle: 'Toulon International U-21: China vs. England',
					titleLang: 'en',
					descriptionLang: 'en',
					entityType: 'Sports',
					genres: ['Soccer'],
					longDescription: 'From France',
					shortDescription: 'From France',
					preferredImage: {
						width: '240',
						height: '360',
						uri: 'assets/p7900709_b_v5_aa.jpg',
						category: 'Banner-L3',
						text: 'yes',
						primary: 'true',
						tier: 'Sport'
					} 
				} 
			}
			
		];
				
		var accessUrlFctry = {};
			accessUrlFctry.getAllData = function(){ return allChannels; };
			accessUrlFctry.getProdStatus = function(){ return prodLvls; };
			accessUrlFctry.getShowDesc = function(){ return fullShowDesc; };
			//accessUrlFctry.getSpecial = function(){ return special; };
						
			accessUrlFctry.sendUsrData = function(){
			
			};
		return accessUrlFctry;
    }])
	.service('jwgensrvc', function(){
		var chnlID;
		
		//var bUrl = allChannels[0].baseUrl;
		//var bUri = allChannels[0].streamLoc;
		//var key = kTkn.key;
		//var token = kTkn.token;
		var special = [
			{ dname: '', dtype: 'isType' },
			{ dname: '', dtype: 'isType1' },
			
		];
		
		var error = "";
		
		var trnBck = 60 * 10;
		var mDate = new Date();
		var sTime = Date.parse(mDate)/1000;
		var sTime = sTime - trnBck;
		var timespan = 60 * 20;
		var eTime = sTime + timespan;
		
		
		//return allChannels[0].baseUrl;
		
		//console.log('base is: '+allChannels[0].baseUrl);
		//var fUri = bUri+"?valid_from="+sTime+"&valid_to="+eTime;
		//console.log('baseurl: '+bUrl+' baseURI: '+fUri+' key: '+key+' token: '+token+' sTime: '+sTime+' eTime: '+eTime);
		
		
		
		
	});
}(angular.module('app')));