(function (app) {
    'use strict';

    app.controller('promoCtrl', ['$scope', 'userSvc', 'homeScrnsSvc', 'loggerSvc', function ($scope, userSvc, homeScrnsSvc, loggerSvc) {
        $scope.usrScrnClasses = {};

        activate();
        function activate() {
            $scope.usrScrnClasses = homeScrnsSvc.getUsrClass();

            $scope.loadingChannels = true;
            userSvc.getPromoChannels(function (data) {
                $scope.promoChnls = data;
                $scope.loadingChannels = false;
            }, function () {
                $scope.loadingChannels = false;
                loggerSvc.logError('Error loading promo-channel list.');
            });
        }

        $scope.selectedIndex = -1;

        $scope.itemClicked = function ($index) {
            $scope.selectedIndex = $index;
        };

        $scope.getProgramDetails = function (airing) {
            var programDetails = '<p style="text-align: left"><span class="program-details-header">Program: </span>' + airing.program.title + '</p>';
            if (airing.duration) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span>' + $scope.getTime(1, airing) + '</p>';
            }
            if (airing.startTime) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Duration: </span>' + airing.duration + ' minutes</p>';
            }
            if (airing.program.shortDescription) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Description: </span>' + airing.program.shortDescription + '</p>';
            }
            return programDetails;
        };
    }]);
}(angular.module('app')));
