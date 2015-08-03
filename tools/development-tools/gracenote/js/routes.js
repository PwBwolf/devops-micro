(function (app) {
    'use strict';

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
		$routeProvider.
		when('/',{
			templateUrl: 'empty.html',
			controller: "testCtrl"
		}).
		when('/channelguide',{
			templateUrl: 'channelguide.html',
			controller: "channelGuideCtrl"
		}).
		when('/channelguide/:stationid',{
			templateUrl: 'channel.html',
			controller: "channelCtrl"
		}).
		when('/program/:programid',{
			templateUrl: 'empty.html',
			controller: "preProgramCtrl"
		}).
		when('/channelguide/:stationid/:programid',{
			templateUrl: 'program.html',
			controller: "programCtrl"
		}).
		otherwise({
			redirectTo: '/'             
		});
	}]);
}(angular.module('myApp')));