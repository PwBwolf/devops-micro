(function (app) {
    'use strict';

    app.controller('playerCtrl', ['userSvc', 'mediaSvc', 'loggerSvc', '$scope', '$window', '$compile', function (userSvc, mediaSvc, loggerSvc, $scope, $window, $compile) {
        activate();

        function activate() {
            $scope.player = $window.document.getElementById('player');
            $scope.promo = $window.document.getElementById('playerBottom');
            $scope.channelList = $window.document.getElementById('channelMenuHolder');
            $scope.guide = $window.document.getElementById('userGuide');
            $scope.isVisible = false;
            $scope.closeVisible = false;
            $scope.loadingChannels = true;

            userSvc.getUserChannels(function (data) {
                $scope.channels = data;
            }, function () {
                loggerSvc.logError('Error loading channel list.');
            });
        }

        $scope.channelClicked = function (index) {
            $scope.selectedChannel = index;
            $scope.selectChannel(index);
            $scope.brandImage = $scope.channels[index].image_url;
            $scope.isVisible = true;
        };

        $scope.watchNow = function (index, play) {
            if (index !== null && index !== undefined && index > -1) {
                $scope.playChannel(index);
            } else if (play === 0) {
                $scope.playChannel($scope.selectedChannel);
            }
        };

        $scope.showCloseButton = function () {
            if (angular.element('#closeBtn').length) {
                $scope.closeVisible = true;
                $scope.logoVisible = true;
            } else {
                var previewPanel = angular.element('#channelMenuHolder');
                var closePanel = angular.element(document.createElement('close-panel'));
                var channelLogo = angular.element(document.createElement('channel-logo'));
                $compile(channelLogo)($scope);
                $compile(closePanel)($scope);
                angular.element(previewPanel).append(closePanel).append(channelLogo);
            }
        };

        $scope.hideCloseButton = function () {
            $scope.isVisible = false;
            $scope.closeVisible = false;
            $scope.logoVisible = false;
        };

        $scope.selectOnAir = function (channelIndex) {
            if (!$scope.loadingChannelGuide) {
                $scope.loadingChannelGuide = true;
                mediaSvc.getChannelGuide($scope.channels[channelIndex].live_external_id, $scope.channels[channelIndex].name).success(function (showPreview) {
                    $scope.onAir = showPreview[0].airings;
                    $scope.onAirTitle = $scope.onAir[0].program.title;
                    $scope.programDetails = $scope.getProgramDetails($scope.onAir[0]);
                    $scope.loadingChannelGuide = false;
                }).error(function () {
                    $scope.loadingChannelGuide = false;
                    loggerSvc.logError('Error loading channel guide.');
                });
            }
        };

        $scope.selectChannel = function (channelIndex) {
            if (!$scope.loadingChannelGuide) {
                $scope.loadingChannelGuide = true;
                mediaSvc.getChannelGuide($scope.channels[channelIndex].live_external_id).success(function (channelGuide) {
                    $scope.showTimes = channelGuide[0].airings;
                    $scope.showListings = [];
                    for (var i = 0; i < $scope.showTimes.length; i++) {
                        $scope.showListings[i] = $scope.getChannelDetails($scope.showTimes[i]);
                    }
                    $scope.loadingChannelGuide = false;
                }).error(function () {
                    $scope.loadingChannelGuide = false;
                    loggerSvc.logError('Error loading channel guide.');
                });
            }
        };

        $scope.playChannel = function (index, airing) {
            mediaSvc.getChannel($scope.channels[index].id).success(function (channel) {
                $scope.tvUrl = channel.live_pc_url;
                $scope.airing = airing;
                $scope.channelLogo = $scope.channels[index].image_url;
                $scope.channelNumber = $scope.channels[index].number;
                $scope.channelName = $scope.channels[index].name;
                playStream();
            }).error(function () {
                loggerSvc.logError('Error loading channel.');
            });
        };

        function playStream() {
            jwplayer('yiptv-player').setup({
                width: 912,
                height: 370,
                playlist: [{
                    image: $scope.channelLogo,
                    sources: [
                        {file: $scope.tvUrl}
                    ]
                }],
                rtmp: {
                    bufferlength: 3
                },
                primary: 'flash',
                modes: [
                    {
                        'type': 'flash',
                        'src': 'scripts/external/jwplayer.flash.swf'
                    }
                ],
                autostart: true,
                fallback: false
            });
        }

        function getTime(index, airing) {
            if (index === 0) {
                return 'on now';
            }
            var startTime = new Date(airing.startTime);
            var endTime = new Date(airing.endTime);
            return pad(startTime.getHours()) + ':' + pad(startTime.getMinutes()) + ' - ' + pad(endTime.getHours()) + ':' + pad(endTime.getMinutes());
        }

        function pad(number) {
            var value = String(number);
            if (value.length === 1) {
                value = '0' + value;
            }
            return value;
        }

        $scope.getImage = function (uri) {
            if (uri.indexOf('/images/') === 0) {
                return uri;
            } else {
                return $scope.appConfig.graceNoteImageUrl + uri;
            }
        };

        $scope.getProgramDetails = function (airing) {
            var programDetails = '<p style="text-align: left;"><span class="program-details-header">On Now: </span><span class="program-details-body">' + airing.program.title + '</span></p>';
            if (!airing.duration && !airing.startTime) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span><span class="program-details-body">Not Available</span>&nbsp;<span class="program-details-header">Duration: </span><span class="program-details-body">Not Available</span></p>';
            } else {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span><span class="program-details-body">' + getTime(1, airing) + '</span>&nbsp;<span class="program-details-header">Duration: </span><span class="program-details-body">' + airing.duration + ' min</span></p>';
            }
            if (!airing.program.shortDescription) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Description: </span><span class="program-details-body">Not Available</span></p>';
            } else {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Description: </span><span class="program-details-body">' + airing.program.shortDescription + '</span></p>';
            }
            return programDetails;
        };

        $scope.getChannelDetails = function (show) {
            var channelDetails = '<div><img src="' + $scope.getImage(show.program.preferredImage.uri) + '" /><p style="text-align: left;"><span class="program-details-header">Title: </span><span class="program-details-body">' + show.program.title + '</span></p>';
            if (!show.duration && !show.startTime) {
                channelDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span><span class="program-details-body">Not Available</span>&nbsp;<span class="program-details-header">Duration: </span><span class="program-details-body">Not Available</span></p>';
            } else {
                channelDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span><span class="program-details-body">' + getTime(1, show) + '</span>&nbsp;<span class="program-details-header">Duration: </span><span class="program-details-body">' + show.duration + ' min</span></p>';
            }
            if (!show.program.shortDescription) {
                channelDetails += '<p style="text-align: left"><span class="program-details-header">Description: </span><span class="program-details-body">Not Available</span></p>';
            } else {
                channelDetails += '<p style="text-align: left"><span class="program-details-header">Description: </span><span class="program-details-body">' + show.program.shortDescription + '</span></p></div>';
            }
            return channelDetails;
        };
    }]);
}(angular.module('app')));
