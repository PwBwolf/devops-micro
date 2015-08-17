(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', '$location', '$', '$filter', '$compile', 'prflButtons', function (appSvc, $scope, $window, $location, $, $filter, $compile, prflButtons) {
        $scope.prflSlctns = [];
        
		activate();
		init();
        function activate() {
            if ($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
        }

		function init(){
			$scope.prflSlctns = prflButtons.getPfrlSlctns();
			$scope.dUsr = $scope.user;        
		}
		
		
		$scope.isSlctd = false;
		$scope.slctdPrflItm = -1; // Whatever the default selected index is, use -1 for no selection
		$scope.slctdAcctPnl = -1;

	    $scope.prflItmSlctd = function ($index) { $scope.slctdPrflItm = $index; };  // Flip card on click
		$scope.acctPnlSlctd = function (pnl) { $scope.slctdAcctPnl = pnl; };
		$scope.getPrsnlInfo = function (){

			console.log('the wing');
		}

        
        $scope.content = {
            'banners': 'views/banner-desktop.html',
        };
		
		$scope.usrDataFile = {
			"cntnt": "views/home-scrns.html",
			"chnls": "views/home-chnls.html",
			"guide": "views/home-guide.html",
			"langPrefs": "views/preferences.html",
			"usrPrfl": "views/user-info.html",
			"usrPwd": "views/change-password.html"
		}
		
		
    }])
	.filter('setCount', function(){
		return function(repo, begin, end){
			return repo.slice(begin, end);
		}
	});
	
}(angular.module('app')));
