(function (app) {
    'use strict';

    app.controller('verifyUserCtrl', ['userSvc', '$scope', '$location', '$filter', function (userSvc, $scope, $location, $filter) {

        verifyUser();

        function verifyUser() {
            var code = $location.search().code;
            if (code) {
                userSvc.verifyUser(
                    code,
                    function () {
                        $scope.heading = $filter('translate')('VERIFY_USER_HEADING_SUCCESS') || 'Success';
                        $scope.message = $filter('translate')('VERIFY_USER_MESSAGE_SUCCESS') || 'Your account has been successfully verified. You can sign into YipTV using the Sign In button above.';
                    },
                    function () {
                        $scope.heading = $filter('translate')('VERIFY_USER_HEADING_ERROR') || 'Error';
                        $scope.message = $filter('translate')('VERIFY_USER_MESSAGE_ERROR') || 'Unable to verify your account or account is already verified. Please contact YipTV Customer Care';
                    });
            } else {
                $scope.heading = $filter('translate')('VERIFY_USER_HEADING_ERROR') || 'Error';
                $scope.message = $filter('translate')('VERIFY_USER_MESSAGE_ERROR') || 'Unable to verify your account or account is already verified. Please contact YipTV Customer Care';
            }
        }
    }]);
}(angular.module('app')));
