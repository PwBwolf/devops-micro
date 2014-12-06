(function (app) {
    'use strict';

    app.controller('contactUsCtrl', ['$scope', 'appSvc', 'loggerSvc', '$filter', function ($scope, appSvc, loggerSvc, $filter) {
        $scope.contactUs = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                appSvc.contactUs(
                    $scope.cu,
                    function success () {
                        loggerSvc.logSuccess($filter('translate')('CONTACT_US_SUCCEEDED') || 'Contact us succeeded!');
                        $scope.saving = false;
                    },
                    function error () {
                        loggerSvc.logError($filter('translate')('CONTACT_US_FAILED') || 'Contact us failed.');
                        $scope.saving = false;
                    });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.name.$dirty = true;
            $scope.form.interest.$dirty = true;
            $scope.form.email.$dirty = true;
            $scope.form.assist.$dirty = true;
        }
    }]);
}(angular.module('app')));
