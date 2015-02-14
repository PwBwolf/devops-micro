(function (app) {
    'use strict';

    app.controller('commonCtrl', ['$window', '$scope', function ($window, $scope) {
        if($scope.app.reload) {
            $scope.app.reload = false;
            $window.location.reload();
        }
    }]);
}(angular.module('app')));
