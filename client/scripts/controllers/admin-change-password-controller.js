(function (app) {
    'use strict';

    app.controller('adminChangePasswordCtrl', ['adminSvc', 'loggerSvc', '$scope', '$filter', '$location', function (adminSvc, loggerSvc, $scope, $filter, $location) {

        $scope.changePassword = function () {
            if ($scope.form.$valid) {
                adminSvc.changePassword($scope.mv).success(function () {
                    loggerSvc.logSuccess($filter('translate')('ADMIN_CHANGE_PASSWORD_SUCCESS'));
                    $location.path('/admin');
                }).error(function (error) {
                    if(error === 'UserNotFound') {
                        loggerSvc.logError($filter('translate')('ADMIN_CHANGE_PASSWORD_USER_NOT_FOUND'));
                    } else {
                        loggerSvc.logError($filter('translate')('ADMIN_CHANGE_PASSWORD_ERROR'));
                    }

                });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.email.$dirty = true;
            $scope.form.newPassword.$dirty = true;
        }
    }]);
}(angular.module('app')));
