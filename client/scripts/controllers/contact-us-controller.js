(function (app) {
    'use strict';

    app.controller('contactUsCtrl', ['appSvc', 'loggerSvc', '$scope', '$filter', '$location', function (appSvc, loggerSvc, $scope, $filter, $location) {

        init();
        activate();

        function init() {
            $scope.mv = {email: $scope.user.email, name: $scope.user.firstName + ' ' + $scope.user.lastName, telephone: $scope.user.telephone};
        }

        $scope.$on('UserChanged', function () {
            init();
        });

        function activate() {
            appSvc.getCountries().success(function (data) {
                $scope.countries = data;
                $scope.mv.country = 'United States';
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
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.name.$dirty = true;
            $scope.form.interest.$dirty = true;
            $scope.form.email.$dirty = true;
            $scope.form.telephone.$dirty = true;
            $scope.form.details.$dirty = true;
            $scope.form.country.$dirty = true;
        }
    }]);
}(angular.module('app')));
