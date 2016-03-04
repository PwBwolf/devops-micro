(function (app) {
    'use strict';

    app.controller('contactUsCtrl', ['appSvc', 'loggerSvc', '$scope', '$filter', '$location', function (appSvc, loggerSvc, $scope, $filter, $location) {

        init();
        activate();

        function init() {
            if($scope.user.email) {
                $scope.mv = {email: $scope.user.email, name: $scope.user.firstName + ' ' + $scope.user.lastName};
            } else {
                $scope.mv = {};
            }
        }

        $scope.$on('UserChanged', function () {
            init();
        });

        function activate() {
            appSvc.getCountries().success(function (data) {
                $scope.countries = data;
                $scope.mv.country = 'United States';
                $scope.mv.interest = 'Technical Support';
            }).error(function () {
                loggerSvc.logError($filter('translate')('CONTACT_US_COUNTRY_LOAD_ERROR'));
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
                        loggerSvc.logError($filter('translate')('CONTACT_US_ERROR'));
                        $scope.saving = false;
                    });
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.name.$touched = true;
            $scope.form.interest.$touched = true;
            $scope.form.email.$touched = true;
            $scope.form.details.$touched = true;
            $scope.form.country.$touched = true;
        }
    }]);
}(angular.module('app')));
