(function (app) {
    'use strict';

    app.controller('resendVerificationSuccessCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {

        $scope.verificationEmail = $routeParams.verificationEmail;

    }]);
}(angular.module('app')));
