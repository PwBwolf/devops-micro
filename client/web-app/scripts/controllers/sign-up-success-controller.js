(function (app) {
    'use strict';

    app.controller('signUpSuccessCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {

        $scope.showVerification = $routeParams.showVerification;

    }]);
}(angular.module('app')));
