(function (app) {
    'use strict';

    app.controller('showsCtrl', ['showsSvc', '$scope', function (showsSvc, $scope) {
        init();

        function init() {
            $scope.sports = showsSvc.getSports();
            $scope.news = showsSvc.getNews();
            $scope.entertainment = showsSvc.getEntertainment();
        }

        $scope.itemClickedSports = function (index) {
            $scope.selectedIndexSports = index;
        };

        $scope.itemClickedNews = function (index) {
            $scope.selectedIndexNews = index;
        };

        $scope.itemClickedEntertainment = function (index) {
            $scope.selectedIndexEntertainment = index;
        };
    }]);
}(angular.module('app')));
