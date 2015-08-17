(function (app) {
    'use strict';

    app.controller('homeChnlsCtrl', ['$scope', '$', 'homeChnlsSvc', '$filter', '$window', function ($scope, $, homeChnlsSvc, $filter, $window) {
		$scope.usrData = [];
		$scope.usrPrfrdChnls = [];
        $scope.mrqeData = [];
		
        $scope.counter = 0;
        
		init();
		function init(){
            $scope.now = $filter('date')(new Date(), 'HH:mm a');
            $scope.format = $filter('date')(new Date(), 'HH:mm a');
            
			$scope.dUser = $scope.user;
			$scope.usrData = homeChnlsSvc.getUsrData();
			$scope.usrPrfrdChnls = homeChnlsSvc.getPrfrdChnls();
            $scope.mrqeData = homeChnlsSvc.getMarqueeData();
            

            var text = $scope.mrqeData;
            setInterval(change, 5000);
            function change() {

                $scope.counter++;
            
                if($scope.counter >= text.length) { $scope.counter = 0; }
            }
            
		}
        $scope.slctdMrqe = -1;
        
        $scope.crntMrqe = function (counter) { $scope.slctdMrqe = counter; }		
        $scope.isVisible = false;
        

    }]);
}(angular.module('app')));
