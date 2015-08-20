(function (app) {
    'use strict';

    app.controller('promoCtrl', ['$scope', '$filter', 'userSvc', 'loggerSvc', function ($scope, $filter, userSvc, loggerSvc) {

        $scope.selectedPromoChannel = -1;
        activate();

        function activate() {
            userSvc.getPromoChannels(function (data) {
                $scope.promoChannels = data;
            }, function () {
                loggerSvc.logError($filter('translate')('PLAYER_PROMO_CHANNEL_LIST_LOAD_ERROR'));
            });
        }

        $scope.promoChannelSelected = function ($index) {
            $scope.selectedPromoChannel = $index;
        };
    }]);
}(angular.module('app')));
