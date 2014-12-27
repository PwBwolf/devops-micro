(function (app) {
    'use strict';

    app.controller('verifyUserCtrl', ['userSvc', '$scope', '$location', '$filter', function (userSvc, $scope, $location) {

        verifyUser();

        function verifyUser() {
            var code = $location.search().code;
            if (code) {
                userSvc.verifyUser(
                    code,
                    function () {
                        $scope.heading = 'VERIFY_USER_HEADING_SUCCESS';
                        $scope.message = 'VERIFY_USER_MESSAGE_SUCCESS';
                    },
                    function () {
                        $scope.heading = 'VERIFY_USER_HEADING_ERROR';
                        $scope.message = 'VERIFY_USER_MESSAGE_ERROR';
                    });
            } else {
                $scope.heading = 'VERIFY_USER_HEADING_ERROR';
                $scope.message = 'VERIFY_USER_MESSAGE_ERROR';
            }
        }
    }]);
}(angular.module('app')));
