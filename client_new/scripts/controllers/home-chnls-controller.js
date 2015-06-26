(function (app) {
    'use strict';

    app.controller('homeChnlsCtrl', ['$scope', '$', 'homeChnlsSvc', function ($scope, $, homeChnlsSvc) {
		$scope.usrData = [];
		$scope.usrPrfrdChnls = [];
		
		//$scope.dUser = $scope.user;
		//console.log('dFirstName: '+dUser);
		
		init();
		function init(){
			$scope.dUser = $scope.user;
			$scope.usrData = homeChnlsSvc.getUsrData();
			$scope.usrPrfrdChnls = homeChnlsSvc.getPrfrdChnls();
		}

    }]);
}(angular.module('app')));
