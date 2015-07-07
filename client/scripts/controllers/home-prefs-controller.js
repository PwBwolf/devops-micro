(function (app) {
    'use strict';

    app.controller('homePrefsCtrl', ['$scope', '$', 'homePrefsSvc', function ($scope, $, homePrefsSvc) {
		$scope.usrData = [];
		$scope.usrPrfrdChnls = [];
		
		init();
		function init(){
			$scope.usrData = homePrefsSvc.getUsrData();
			$scope.usrPrfrdChnls = homePrefsSvc.getPrfrdChnls();
		}

    }]);
}(angular.module('app')));
