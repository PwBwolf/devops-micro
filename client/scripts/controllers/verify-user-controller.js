(function (app) {
    'use strict';

    app.controller('verifyUserCtrl', ['userSvc', '$scope', '$location', '$filter', function (userSvc, $scope, $location) {

        $scope.showPassword = false;

        verifyUser();

        function verifyUser() {
            var code = $location.search().code;
            if (code) {
                userSvc.verifyUser(
                    code,
                    function (result) {
                        if (result === 'web-user') {
                            $scope.heading = 'VERIFY_USER_HEADING_SUCCESS';
                            $scope.message = 'VERIFY_USER_MESSAGE_SUCCESS';
                            $scope.error = false;
                        } else {
                            $scope.showPassword = true;
                        }
                    },
                    function () {
                        $scope.heading = 'VERIFY_USER_HEADING_ERROR';
                        $scope.message = 'VERIFY_USER_MESSAGE_ERROR';
                        $scope.error = true;
                    });
            } else {
                $scope.heading = 'VERIFY_USER_HEADING_ERROR';
                $scope.message = 'VERIFY_USER_MESSAGE_ERROR';
                $scope.error = true;
            }
        }

        $scope.setPasswordAndVerifyUser = function () {
            var code = $location.search().code;
            if (code) {
                if ($scope.form.$valid) {
                    $scope.saving = true;
                    $scope.mv.code = code;
                    userSvc.setPasswordAndVerifyUser(
                        $scope.mv,
                        function () {
                            $scope.heading = 'VERIFY_USER_HEADING_SUCCESS';
                            $scope.message = 'VERIFY_USER_MESSAGE_SUCCESS';
                            $scope.error = false;
                            $scope.showPassword = false;
                        },
                        function () {
                            $scope.heading = 'VERIFY_USER_HEADING_ERROR';
                            $scope.message = 'VERIFY_USER_MESSAGE_ERROR';
                            $scope.error = true;
                            $scope.showPassword = false;
                        });
                } else {
                    setFormDirty();
                }
            } else {
                $scope.heading = 'VERIFY_USER_HEADING_ERROR';
                $scope.message = 'VERIFY_USER_MESSAGE_ERROR';
                $scope.error = true;
                $scope.showPassword = false;
            }
        };

        function setFormDirty() {
            $scope.form.newPassword.$dirty = true;
            $scope.form.confirmPassword.$dirty = true;
        }
    }]);
}(angular.module('app')));
