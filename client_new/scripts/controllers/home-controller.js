(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', '$location', '$', '$filter', '$compile', 'prflButtons', function (appSvc, $scope, $window, $location, $, $filter, $compile, prflButtons) {
        $scope.prflSlctns = [];
        //var d;
		//$scope.d = new Date();
        
		activate();
		init();
        function activate() {
            if ($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
        }
		
		//var dUser = $scope.user.firstName;
		//console.log('dUser: '+dUser);
		
		function init(){
			$scope.prflSlctns = prflButtons.getPfrlSlctns();
			$scope.dUsr = $scope.user;        
		}
		
		
		$scope.isSlctd = false;
		$scope.slctdPrflItm = -1; // Whatever the default selected index is, use -1 for no selection
		$scope.slctdAcctPnl = -1;

	    $scope.prflItmSlctd = function ($index) { $scope.slctdPrflItm = $index; };  // Flip card on click
		$scope.acctPnlSlctd = function (pnl) { $scope.slctdAcctPnl = pnl; console.log('pnl: '+pnl) };
		$scope.getPrsnlInfo = function (){
			//$scope.usrDataInfo = { "usrPrfl": "views/user-info.html" };
			//$('#langPrefs').attr('id', 'usrPrfl').attr('data-ng-include', 'usrDataInfo.usrPrfl');
			console.log('the wing');
		}
		
		$scope.prflPrefs = function(){
			
		}
		
        $scope.$watch(function () {
            return window.innerWidth;
        }, function (value) {
            var x = value;
            switch (true) {
                case (x < 768):
                    $scope.content = {
                        'banners': 'views/banner-mobile.html',
                        'shows': 'views/shows.html',
                        'download': 'views/download.html',
                        'footer': 'views/footer.html'
                    };
                    break;
                case (x > 767 && x < 1025):
                    $scope.content = {
                        'banners': 'views/banner-tablet.html',
                        'shows': 'views/shows.html',
                        'download': 'views/download.html',
                        'footer': 'views/footer.html'
                    };
                    break;
                case (x > 1025):
                    $scope.content = {
                        'banners': 'views/banner-desktop.html',
                        'shows': 'views/shows.html',
                        'download': 'views/download.html',
                        'footer': 'views/footer.html'
                    };
                    break;
            }
        });
		
		$scope.usrDataFile = {
			//"prefs": "views/home-prefs.html",
			//"prefs": "views/user-prefs.html",
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
