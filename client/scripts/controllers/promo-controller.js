(function (app) {
    'use strict';

    app.controller('promoCtrl', ['$scope', 'userSvc', 'loggerSvc', function ($scope, userSvc, loggerSvc) {

        $scope.selectedPromoChannel = -1;
        activate();

        function activate() {
            userSvc.getPromoChannels(function (data) {
                $scope.promoChannels = data;
            }, function () {
                loggerSvc.logError('Error loading promo channel list');
            });
        }

        $scope.promoChannelSelected = function ($index) {
            $scope.selectedPromoChannel = $index;
        };
    }]);
}(angular.module('app')));
