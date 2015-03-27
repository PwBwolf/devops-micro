(function (app) {
    'use strict';

    app.controller('playerCtrl', ['$scope', function ($scope) {
        $scope.options = {
            file: 'https://www.youtube.com/watch?v=eFTLKWw542g',
            image: 'http://www.livestream.com/filestore/logos/6a941358-6c7f-2ebf-e8ac-b05f4f338270-banner.png',
            width: '100%',
            aspectratio: '16:9',
            logo: {
                file: '/img/tv_logo.png'
            }
        };

        $scope.changeChannel = function(url) {
            $scope.options.file = url;
            $scope.options.autostart = true;
        };
    }]);
}(angular.module('app')));
