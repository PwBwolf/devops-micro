(function (app) {
    'use strict';

    app.factory('homeChnlGuideSvc', [function () {
		var _12pm = [
				{ gdeChnl:'images/chnl_imgs/Channels1.jpg', gdeTtl: 'tv show title1', gdeDesc:'show description1' },
				{ gdeChnl:'images/chnl_imgs/Channels2.jpg', gdeTtl: 'tv show title2', gdeDesc:'show description2' },
				{ gdeChnl:'images/chnl_imgs/Channels3.jpg', gdeTtl: 'tv show title3', gdeDesc:'show description3' },
				{ gdeChnl:'images/chnl_imgs/Channels11.jpg', gdeTtl: 'tv show title1', gdeDesc:'show description1' },
				{ gdeChnl:'images/chnl_imgs/Channels12.jpg', gdeTtl: 'tv show title2', gdeDesc:'show description2' },
				{ gdeChnl:'images/chnl_imgs/Channels13.jpg', gdeTtl: 'tv show title3', gdeDesc:'show description3' }
		];
		var _1pm = [
				{ gdeChnl:'images/chnl_imgs/Channels4.jpg', gdeTtl: 'tv show title1a', gdeDesc:'show description1a' },
				{ gdeChnl:'images/chnl_imgs/Channels5.jpg', gdeTtl: 'tv show title2a', gdeDesc:'show description2a' },
				{ gdeChnl:'images/chnl_imgs/Channels6.jpg', gdeTtl: 'tv show title3a', gdeDesc:'show description3a' }
		];
		var _2pm = [
				{ gdeChnl:'images/chnl_imgs/Channels17.jpg', gdeTtl: 'tv show title1b', gdeDesc:'show description1b' },
				{ gdeChnl:'images/chnl_imgs/Channels18.jpg', gdeTtl: 'tv show title2b', gdeDesc:'show description2b' },
				{ gdeChnl:'images/chnl_imgs/Channels19.jpg', gdeTtl: 'tv show title3b', gdeDesc:'show description3b' }
		];
		var _3pm = [
				{ gdeChnl:'images/chnl_imgs/Channels24.jpg', gdeTtl: 'tv show title1c', gdeDesc:'show description1c' },
				{ gdeChnl:'images/chnl_imgs/Channels25.jpg', gdeTtl: 'tv show title2c', gdeDesc:'show description2c' },
				{ gdeChnl:'images/chnl_imgs/Channels26.jpg', gdeTtl: 'tv show title3c', gdeDesc:'show description3c' }
		];
		var _4pm = [
				{ gdeChnl:'images/chnl_imgs/Channels23.jpg', gdeTtl: 'tv show title1d', gdeDesc:'show description1d' },
				{ gdeChnl:'images/chnl_imgs/Channels28.jpg', gdeTtl: 'tv show title2d', gdeDesc:'show description2d' },
				{ gdeChnl:'images/chnl_imgs/Channels29.jpg', gdeTtl: 'tv show title3d', gdeDesc:'show description3d' }
		];
		var _5pm = [
				{ gdeChnl:'images/chnl_imgs/Channels4.jpg', gdeTtl: 'tv show title1e', gdeDesc:'show description1e' },
				{ gdeChnl:'images/chnl_imgs/Channels15.jpg', gdeTtl: 'tv show title2e', gdeDesc:'show description2e' },
				{ gdeChnl:'images/chnl_imgs/Channels16.jpg', gdeTtl: 'tv show title3e', gdeDesc:'show description3e' }
		];
		var _6pm = [
				{ gdeChnl:'images/chnl_imgs/Channels7.jpg', gdeTtl: 'tv show title1f', gdeDesc:'show description1f' },
				{ gdeChnl:'images/chnl_imgs/Channels18.jpg', gdeTtl: 'tv show title2f', gdeDesc:'show description2f' },
				{ gdeChnl:'images/chnl_imgs/Channels29.jpg', gdeTtl: 'tv show title3f', gdeDesc:'show description3f' }
		];
		
		
		
		var usrGdeFctry = {};
			usrGdeFctry.getGdeData1 = function(){ return _12pm; };
			usrGdeFctry.getGdeData2 = function(){ return _1pm; };
			usrGdeFctry.getGdeData3 = function(){ return _2pm; };
			usrGdeFctry.getGdeData4 = function(){ return _3pm; };
			usrGdeFctry.getGdeData5 = function(){ return _4pm; };
			usrGdeFctry.getGdeData6 = function(){ return _5pm; };
			usrGdeFctry.getGdeData7 = function(){ return _6pm; };
			
			usrGdeFctry.sendGdeData = function(){
			
			};
			
		return usrGdeFctry;
		
    }]);
}(angular.module('app')));
