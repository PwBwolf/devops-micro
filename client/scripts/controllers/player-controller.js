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
            preloadImages: 'visible',
            pager: false
        };

        $scope.channelGuideSliderOptions = {
            auto: false,
            autoStart: false,
            maxSlides: 20,
            slideWidth: 150,
            slideMargin: 0,
            infiniteLoop: false,
            hideControlOnEnd: true,
            preloadImages: 'visible',
            pager: false
        };

        activate();

        function activate() {
            $scope.loadingChannels = true;
            userSvc.getUserChannels(function (data) {
                $scope.channels = data;
                if ($scope.channels && $scope.channels.length > 0) {
                    $scope.selectChannel(0);
                }
                $scope.loadingChannels = false;
            }, function () {
                $scope.loadingChannels = false;
                loggerSvc.logError('Error loading channel list.');
            });
        }

        $scope.selectChannel = function (channelIndex) {
            if(!$scope.loadingChannelGuide) {
                $scope.selectedChannelIndex = channelIndex;
                $scope.loadingChannelGuide = true;
                mediaSvc.getChannelGuide($scope.channels[channelIndex].live_external_id, $scope.channels[channelIndex].name).success(function (channelGuide) {
                    $scope.airings = channelGuide[0].airings;
                    $scope.loadingChannelGuide = false;
                }).error(function () {
                    $scope.loadingChannelGuide = false;
                    loggerSvc.logError('Error loading channel guide.');
                });
            }
        };

        $scope.playChannel = function (index, airing) {
            if(index === 0) {
                mediaSvc.getChannel($scope.channels[$scope.selectedChannelIndex].id).success(function (channel) {
                    $scope.playerOptions.file = channel.live_pc_url;
                    $scope.playerOptions.autoStart = true;
                    $scope.airing = airing;
                    $scope.channelLogo = $scope.channels[$scope.selectedChannelIndex].image_url;
                    $scope.channelNumber = $scope.channels[$scope.selectedChannelIndex].number;
                    $scope.channelName = $scope.channels[$scope.selectedChannelIndex].name;
                }).error(function () {
                    loggerSvc.logError('Error loading channel.');
                });
            }
        };

        $scope.getTime = function (index, airing) {
            if (index === 0) {
                return 'on now';
            }
            var startTime = new Date(airing.startTime);
            var endTime = new Date(airing.endTime);
            return pad(startTime.getHours()) + ':' + pad(startTime.getMinutes()) + ' - ' + pad(endTime.getHours()) + ':' + pad(endTime.getMinutes());
        };

        function pad(number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
            return r;
        }

        $scope.getDate = function (index, airing) {
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            if (index === 0) {
                return '';
            }
            var startTime = new Date(airing.startTime);
            return startTime.getDate() + ' ' + monthNames[startTime.getMonth()];
        };

        $scope.getImage = function(uri) {
            if(uri.indexOf('/img/channels/') === 0) {
                return uri;
            } else {
                return $scope.appConfig.graceNoteImageUrl + uri;
            }
        };

        $scope.getProgramDetails = function(airing) {
            var programDetails = '<p style="text-align: left"><span class="program-details-header">Program: </span>' + airing.program.title + '</p>';
            if(airing.duration) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span>' + $scope.getTime(1, airing) + '</p>';
            }
            if(airing.startTime) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Duration: </span>' + airing.duration + ' minutes</p>';
            }
            if(airing.program.shortDescription) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Description: </span>' + airing.program.shortDescription + '</p>';
            }
            return programDetails;
        };
    }]);
}(angular.module('app')));
