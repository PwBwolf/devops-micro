(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', 'webStorage', function (appSvc, $scope, $window, webStorage) {

        activate();

        function activate() {
            if ($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
        }
    }]);
}(angular.module('app')));
