(function (app) {
    'use strict';

    app.controller('programDetailSlideCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

        activate();

        function activate() {
            $scope.checked = false; // This will be binded using the ps-open attribute
            var programDetailSlider = document.getElementById('programDetailSlider');
            $scope.program = {title: '', description: '', showTime: 'ShowTime ...'};
            $scope.toggleProgramDetail = function () {
                var width = $(window).width();
                $scope.checked = !$scope.checked;
                if ($scope.checked) {
                    $scope.program = $rootScope.program;
                }
            }
        }
    }]);
}(angular.module('app')));
