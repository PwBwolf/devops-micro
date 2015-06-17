(function (app) {
    'use strict';

    app.controller('homeChnlsCtrl', ['$scope', '$', 'homeChnlsSvc', function ($scope, $, homeChnlsSvc) {
		$scope.usrData = [];
		$scope.usrPrfrdChnls = [];
		
		init();
		function init(){
			$scope.usrData = homeChnlsSvc.getUsrData();
			$scope.usrPrfrdChnls = homeChnlsSvc.getPrfrdChnls();
		}

    }]);
}(angular.module('app')));
