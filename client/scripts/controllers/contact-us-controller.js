(function (app) {
    'use strict';

    app.controller('contactUsCtrl', ['$scope', 'appSvc', 'loggerSvc', '$filter', '$location', function ($scope, appSvc, loggerSvc, $filter, $location) {
        $scope.contactUs = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                appSvc.saveContactUs(
                    $scope.mv,
                    function success () {
                        $location.path('/contact-us-success');
                        $scope.saving = false;
                    },
                    function error () {
                        loggerSvc.logError($filter('translate')('CONTACT_US_ERROR') || 'Error submitting your message and contact details.');
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
            $scope.form.telephone.$dirty = true;
            $scope.form.assist.$dirty = true;
        }
    }]);
}(angular.module('app')));
