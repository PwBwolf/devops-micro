(function (app) {
    'use strict';

    app.controller('inviteCtrl', ['$rootScope', '$routeParams', '$location', function ($rootScope, $routeParams, $location) {

        $rootScope.referredBy = $routeParams.referralCode;
        redirect();

        function redirect() {
            $location.path('/sign-up/premium');
        }

    }]);
}(angular.module('app')));
