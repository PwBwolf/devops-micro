(function (app) {
    'use strict';

    app.controller('referAFriendCtrl', ['$scope', '$filter', function ($scope, $filter) {
        $scope.referralLink = $scope.appConfig.url + 'refer-a-friend/' + $scope.user.referralCode;

        $scope.getReferralLink = function() {
            return $scope.referralLink;
        };

        $scope.fallback = function(copy) {
            window.prompt($filter('translate')('RAF_COPY_LINK_MOBILE'), copy);
        };

    }]);
}(angular.module('app')));
