(function (app) {
    'use strict';

    app.controller('preferencesCtrl', ['userSvc', 'loggerSvc', '$rootScope', '$scope', '$filter', '$location', function (userSvc, loggerSvc, $rootScope, $scope, $filter, $location) {

        activate();

        function activate() {
            userSvc.getPreferences(function (data) {
                $scope.mv = data;
            }, function () {
                loggerSvc.logError($filter('translate')('PREFERENCES_FETCH_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
            });
        }

        $scope.updatePreferences = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.updatePreferences($scope.mv, function () {
                    $scope.saving = false;
                    $rootScope.$broadcast('ChangeLanguage', $scope.mv.defaultLanguage);
                    $location.path('/preferences-success');
                }, function () {
                    loggerSvc.logError($filter('translate')('PREFERENCES_SAVE_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
                    $scope.saving = false;
                });
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.defaultLanguage.$touched = true;
        }
    }]);
}(angular.module('app')));
