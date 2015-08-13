var customerApp = angular.module('myApp', ['ngRoute']);
 customerApp.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
            $routeProvider.
            when('/',{
                templateUrl: 'empty.html',
                controller: "testCtrl"
            }).
            when('/channelguide',{
                templateUrl: 'channelguide.html',
                controller: "channelGuideCtrl"
            }).
            otherwise({
                redirectTo: '/'             
            });
        }]);

customerApp.controller('channelGuideCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/channelguide').success(function(data) {
        $scope.channels = data.channelsDB;
        $scope.message = 'this is channel guide page';
    })
}]);

customerApp.controller('testCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/').success(function(data) {
        $scope.test = 'this test page';
    })
}]);