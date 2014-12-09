(function (app) {
    'use strict';

    app.controller('contactUsCtrl', ['appSvc', 'loggerSvc', '$scope', '$filter', '$location', function (appSvc, loggerSvc, $scope, $filter, $location) {

        activate();

        function activate() {
            appSvc.getCountries().success(function (data) {
                $scope.countries = data;
                $scope.mv = {country: 'United States'};
            }).error(function () {
                loggerSvc.logError($filter('translate')('CONTACT_US_COUNTRY_LOAD_ERROR') || 'Error loading country list');
            });
        }

        $scope.saveContactUs = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                appSvc.saveContactUs(
                    $scope.mv,
                    function () {
                        $location.path('/contact-us-success');
                        $scope.saving = false;
                    },
                    function () {
                        loggerSvc.logError($filter('translate')('CONTACT_US_ERROR') || 'Error submitting your request');
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
            $scope.form.details.$dirty = true;
        }
    }]);
}(angular.module('app')));
