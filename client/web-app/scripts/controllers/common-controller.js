(function (app) {
    'use strict';

    app.controller('commonCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {

        $scope.verificationEmail = $routeParams.verificationEmail;

    }]);
}(angular.module('app')));
