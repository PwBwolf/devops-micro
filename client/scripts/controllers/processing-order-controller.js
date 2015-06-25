(function (app) {
    'use strict';

    app.controller('processingOrderCtrl', ['$rootScope', '$timeout', '$location', function ($rootScope, $timeout, $location) {
        activate();

        function activate() {
            if ($rootScope.signUpSuccessUrl) {
                $timeout(function () {
                    $location.path($rootScope.signUpSuccessUrl);
                }, 1000);
            }
        }
    }]);
}(angular.module('app')));
