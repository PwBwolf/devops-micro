(function (app) {
    'use strict';

    app.controller('tempCtrl', ['$location', function ($location) {
        activate();

        function activate() {
            $location.path('/');
        }
    }]);
}(angular.module('app')));
