(function (app) {
    'use strict';

    app.controller('signInCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', function (userSvc, loggerSvc, $scope, $location) {

        $scope.signIn = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.signIn(
                    $scope.mv,
                    function () {
                        $location.path('/my-account');
                        $scope.saving = false;
                    },
                    function (response) {
                        console.dir(response);
                        if (response === 'EmailNotConfirmed') {
                            loggerSvc.logError('Sign In failed as email is not yet confirmed');
                        } else {
                            loggerSvc.logError('Sign In failed');
                        }
                        $scope.saving = false;
                    });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.email.$dirty = true;
            $scope.form.password.$dirty = true;
        }
    }]);
}(angular.module('app')));
