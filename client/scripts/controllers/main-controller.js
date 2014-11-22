(function (app) {
    'use strict';

    app.controller('mainCtrl', ['appSvc', 'loggerSvc', '$scope', function (appSvc, loggerSvc, $scope) {
        activate();

        function activate() {
            appSvc.getAppConfig().success(function (response) {
                $scope.appConfig = response;
            }).error(function () {
                loggerSvc.logError('Error fetching application config');
            });
        }
    }]);
}(angular.module('app')));

