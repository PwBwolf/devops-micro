(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', '$location', '$filter', 'userSvc', 'loggerSvc', function (appSvc, $scope, $window, $location, $filter, userSvc, loggerSvc) {

        activate();

        function activate() {
            if ($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
        }

        $scope.signIn = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.signIn(
                    $scope.mv,
                    function () {
                        $location.path('/user-home');
                        $scope.saving = false;
                    },
                    function () {
                        loggerSvc.logError($filter('translate')('SIGN_IN_FAILED'));
                        $scope.saving = false;
                    });
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.email.$touched = true;
            $scope.form.password.$touched = true;
        }
    }]);
}(angular.module('app')));
