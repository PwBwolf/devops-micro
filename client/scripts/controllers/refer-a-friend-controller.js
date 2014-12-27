(function (app) {
    'use strict';

    app.controller('referAFriendCtrl', ['userSvc', 'loggerSvc', '$scope', '$filter', '$location', function (userSvc, loggerSvc, $scope, $filter, $location) {

        $scope.referralLink = $scope.appConfig.url + 'invite/' + $scope.user.referralCode;

        $scope.getReferralLink = function () {
            return $scope.referralLink;
        };

        $scope.fallback = function (copy) {
            window.prompt($filter('translate')('RAF_COPY_LINK_MOBILE'), copy);
        };

        $scope.sendRafEmails = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.sendRafEmails($scope.mv, function () {
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
            $scope.form.emailList.$dirty = true;
        }

    }]);
}(angular.module('app')));
