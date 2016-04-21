(function (app) {
    'use strict';

    app.controller('verifyUserCtrl', ['userSvc', '$scope', '$location', function (userSvc, $scope, $location) {

        verifyUser();

        function verifyUser() {
            var code = $location.search().code;
            if (code) {
                userSvc.verifyUser(
                    code,
                    function () {
                        $scope.heading = 'VERIFY_USER_HEADING_SUCCESS';
                        $scope.message = 'VERIFY_USER_MESSAGE_SUCCESS';
                        $scope.error = false;
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
    }]);
}(angular.module('app')));
