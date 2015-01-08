(function (app) {
    'use strict';

    app.controller('referAFriendCtrl', ['appSvc', 'loggerSvc', '$scope', '$filter', '$location', function (appSvc, loggerSvc, $scope, $filter, $location) {

        init();

        function init() {
            $scope.mv = {email: $scope.user.email};
        }

        $scope.$on('UserChanged', function () {
            init();
        });

        $scope.sendRafEmails = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                appSvc.sendRafEmails($scope.mv, function () {
                    $scope.saving = false;
                    $location.path('/refer-a-friend-success');
                }, function () {
                    loggerSvc.logError($filter('translate')('RAF_EMAIL_SEND_ERROR'));
                    $scope.saving = false;
                });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.email.$dirty = true;
            $scope.form.emailList.$dirty = true;
        }

    }]);
}(angular.module('app')));
