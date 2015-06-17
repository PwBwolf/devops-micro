(function (app) {
    'use strict';

    app.factory('prflButtons', [function () {
		var prflSlctns = [
			{ pnlID: 'langPrefs', includePath: 'views/preferences.html', pnlLabel: 'HEADER_PROFILE_BTN_1' },
			{ pnlID: 'usrPrfl', includePath: 'views/user-info.html', pnlLabel: 'HEADER_PROFILE_BTN_2' },
			{ pnlID: 'pwdChng', includePath: 'views/change-password.html', pnlLabel: 'HEADER_PROFILE_BTN_3' }
			
		];
		
        var usrPrflsFctry = {};
	        usrPrflsFctry.getPfrlSlctns = function () { return prflSlctns; };
			
			return usrPrflsFctry;
			
	}]);
}(angular.module('app')));