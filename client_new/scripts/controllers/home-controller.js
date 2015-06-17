(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', '$location', '$', '$filter', 'prflButtons', function (appSvc, $scope, $window, $location, $, $filter, prflButtons) {
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
		}
		
		
		$scope.isSlctd = false;
		$scope.slctdPrflItm = -1; // Whatever the default selected index is, use -1 for no selection

	    $scope.prflItmSlctd = function ($index) {
	    	$scope.slctdPrflItm = $index; // Flip card on click
			switch($index){
				case $index:
					$scope.isSlctd = true;
					console.log('selected: '+$index);
					break;
				default:
					$scope.isSlctd = false;
					console.log('nothing');
					break;
			}
	    	console.log('this index: '+$index);
			//return true;
		};
		
		
		
		$scope.getPrsnlInfo = function (){
			//$scope.usrDataInfo = { "usrPrfl": "views/user-info.html" };
			//$('#langPrefs').attr('id', 'usrPrfl').attr('data-ng-include', 'usrDataInfo.usrPrfl');
			console.log('the wing');
		}
		
		$scope.prflPrefs = function(){
			
		}
		
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
	
}(angular.module('app')));
