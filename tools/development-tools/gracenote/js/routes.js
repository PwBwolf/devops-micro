(function (app) {
    'use strict';

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.
        when('/',{
            templateUrl: 'empty.html',
            controller: "channelLogoCtrl"
        }).
        when('/channelguide',{
            templateUrl: 'channelguide.html',
            //controller: "channelGuideCtrl"
            controller: "channelListCtrl"
        }).
        when('/channelguide/:stationid',{
            templateUrl: 'channel.html',
            //controller: "channelCtrl"
            controller: "channelInfoCtrl"
        }).
        when('/program/:programid',{
            templateUrl: 'empty.html',
            controller: "preProgramCtrl"
        }).
        when('/channelguide/:stationid/:programid',{
            templateUrl: 'program.html',
            //controller: "programCtrl"
            controller: "programDetailCtrl"
        }).
        otherwise({
            redirectTo: '/'             
        });
    }]);
}(angular.module('myApp')));