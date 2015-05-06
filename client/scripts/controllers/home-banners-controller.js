(function (app) {
    'use strict';

    app.controller('homeBannersCtrl', ['$scope', '$', 'homeBannersSvc', function ($scope, $, homeBannersSvc) {
        $scope.en_Bnrs = [];
        $scope.sp_Bnrs = [];

        $('#slider').nivoSlider({
            pauseTime: 6000
        });
    }]);
}(angular.module('app')));
