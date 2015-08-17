(function (myApp) {
    'use strict';

    myApp.controller('mainCtrl', ['$scope', 'appSvc', function ($scope, appSvc) {

        activate();

        function activate() {
            getAppConfig();
        }

        function getAppConfig() {
            appSvc.getAppConfig().success(function (response) {
                $scope.appConfig = response;
            }).error(function (err) {
                loggerSvc.logError('main-controller - getAppConfig - failed to get app config: ' + err);
            });
        }
    }]);
}(angular.module('myApp')));