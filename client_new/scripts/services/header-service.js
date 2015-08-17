(function (app) {
    'use strict';

    app.factory('headerSvc', [function () {

        var marqueeData = [
            {type: 'e', message: 'HEADER_MARQUEE_TEXT_1'},
            {type: 'e', message: 'HEADER_MARQUEE_TEXT_2'},
            {type: 'a', message: 'HEADER_MARQUEE_TEXT_3'},
            {type: 'e', message: 'HEADER_MARQUEE_TEXT_4'},
            {type: 'a', message: 'HEADER_MARQUEE_TEXT_5'}
        ];
		
		
		var usrPrfsFctry = {};
            usrPrfsFctry.getMarqueeData = function(){ return marqueeData; };
			
			usrPrfsFctry.sendUsrData = function(){
			
			};
		return usrPrfsFctry;
    }]);
}(angular.module('app')));
