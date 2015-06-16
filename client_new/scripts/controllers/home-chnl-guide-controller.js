(function (app) {
    'use strict';

    app.controller('homeChnlGuideCtrl', ['$scope', '$', 'homeChnlGuideSvc', function ($scope, $, homeChnlGuideSvc) {

		init();
		function init(){
			$scope._12pm = homeChnlGuideSvc.getGdeData1();
			$scope._1pm = homeChnlGuideSvc.getGdeData2();
			$scope._2pm = homeChnlGuideSvc.getGdeData3();
			$scope._3pm = homeChnlGuideSvc.getGdeData4();
			$scope._4pm = homeChnlGuideSvc.getGdeData5();
			$scope._5pm = homeChnlGuideSvc.getGdeData6();
			$scope._6pm = homeChnlGuideSvc.getGdeData7();
		}
		       
    }]);
}(angular.module('app')));
