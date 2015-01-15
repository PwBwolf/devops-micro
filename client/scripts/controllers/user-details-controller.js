(function (app) {
    'use strict';

    app.controller('userDetailsCtrl', ['adminSvc', 'loggerSvc', '$scope', '$filter', function (adminSvc, loggerSvc, $scope, $filter) {

        $scope.getUserDetails = function() {
            if ($scope.form.$valid) {
                $scope.saving = true;
                $scope.showDetails = false;
                adminSvc.getUserDetails($scope.mv.email).success(function (data) {
                    if(data) {
                        $scope.user = data;
                        $scope.showDetails = true;
                        $scope.saving = false;
                    } else {
                        loggerSvc.logError($filter('translate')('USER_DETAILS_USER_NOT_FOUND'));
                        $scope.saving = false;
                    }
                }).error(function () {
                    loggerSvc.logError($filter('translate')('USER_DETAILS_USER_FETCH_ERROR'));
                    $scope.saving = false;
                });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.email.$dirty = true;
        }
    }]);
}(angular.module('app')));
