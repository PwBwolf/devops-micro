(function (app) {
    'use strict';

    app.controller('playerCtrl', ['userSvc', 'mediaSvc', 'loggerSvc', '$scope', function (userSvc, mediaSvc, loggerSvc, $scope) {
        $scope.playerOptions = {
            file: '/videos/yiptv.mp4',
            width: '100%',
            aspectratio: '16:9',
            primary: 'html5',
            logo: {
                file: '/img/tv_logo.png'
            }
        };

        $scope.channelSliderOptions = {
            auto: false,
            autoStart: false,
            maxSlides: 10,
            slideWidth: 150,
            slideMargin: 50,
            preloadImages: 'all',
            pager: false
        };

        activate();

        function activate() {
            userSvc.getUserChannels(function (data) {
                $scope.channels = data;
                if($scope.channels && $scope.channels.length > 0) {
                    $scope.changeChannel($scope.channels[0].id, false);
                }
            }, function () {
                loggerSvc.logError('Error loading channel list.');
            });
        }

        $scope.changeChannel = function (channelId, autoStart) {
            mediaSvc.getChannel(channelId).success(function (channel) {
                $scope.playerOptions.file = channel.live_pc_url;
                $scope.playerOptions.autostart = autoStart;
                $scope.channelName = channel.name;
                $scope.channelLogo = channel.image_url;
                $scope.channelNumber = channel.number;
            }).error(function () {
                loggerSvc.logError('Error loading channel.');
            });
        };
    }]);
}(angular.module('app')));
