(function (app) {
    'use strict';

    app.controller('resendVerificationSuccessCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {

        $scope.verificationEmail = $routeParams.email;

    }]);
}(angular.module('app')));
