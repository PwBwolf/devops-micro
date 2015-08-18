(function (app) {
    'use strict';

    app.controller('playerCtrl', ['userSvc', 'mediaSvc', 'loggerSvc', '$scope', '$window', '$', function (userSvc, mediaSvc, loggerSvc, $scope, $window, $) {
        $scope.usrMnScrn = {};

        $scope.playerOptions = {
            id: 'yiptv-player',
            file: '/videos/yiptv.mp4',
            width: 902,
            height: 370,
            aspectratio: '16:9',
            primary: 'flash',
            logo: {
                file: '/images/tv-logo.png'
            }
        };

        activate();

        function activate() {

            $scope.player = $window.document.getElementById('player');
            $scope.smm = $window.document.getElementById('playerBottom');
            $scope.channels = $window.document.getElementById('channelMenuHolder');
            $scope.guide = $window.document.getElementById('userGuide');
            $scope.qlBox = $window.document.getElementsByClassName('quick-look-box');
            $scope.isVisible = false;
            $scope.closeVisible = false;
            $scope.loadingChannels = true;

            userSvc.getUserChannels(function (data) {
                $scope.channels = data;
            }, function () {
                loggerSvc.logError('Error loading channel list.');
            });

            $scope.channelClicked = function (index) {
                $scope.selectedChnl = index;
                $scope.selectChannel(index);
                $scope.brandImage = $scope.channels[index].image_url;
                $scope.isVisible = true;
            };

            $scope.watchNow = function (index) {
                $scope.playChannel(index);
            };

            $scope.showCloseButton = function () {
                if (angular.element('#closeBtn').length) {
                    $scope.closeVisible = true;
                    $scope.logoVisible = true;
                } else {
                    var prvwPnl = angular.element('#channelMenuHolder');
                    var closethispanel = angular.element(document.createElement('close-panel'));
                    var channelIdent = angular.element(document.createElement('channel-logo'));
                    angular.element(prvwPnl).append(closethispanel).append(channelIdent);
                }
            };

            $scope.getTarget = function (target) {
                $scope.channelIndex = $scope.channels[target].image_url;
            };
        }

        $scope.selectOnAir = function (channelIndex) {
            if (!$scope.loadingChannelGuide) {
                $scope.loadingChannelGuide = true;
                mediaSvc.getChannelGuide($scope.channels[channelIndex].live_external_id, $scope.channels[channelIndex].name).success(function (showPreview) {
                    $scope.onAir = showPreview[0].airings;
                    $scope.onAirTitle = $scope.onAir[0].program.title;
                    $scope.details = $scope.getProgramDetails($scope.onAir[0]);
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
                mediaSvc.getChannelGuide($scope.channels[channelIndex].live_external_id, $scope.channels[channelIndex].name).success(function (channelGuide) {
                    $scope.showTimes = channelGuide[0].airings;
                    $scope.showListings = [];
                    for (var p in $scope.showTimes) {
                        $scope.showListings[p] = $scope.getChannelDetails($scope.showTimes[p]);
                    }
                    $scope.loadingChannelGuide = false;
                }).error(function () {
                    $scope.loadingChannelGuide = false;
                    loggerSvc.logError('Error loading channel guide.');
                });
            }
        };

        $scope.prvwPnl = function (el) {
            var thisPreviewPnl = angular.element('#channelPreviewPanel').find('div')[0];
            $(thisPreviewPnl).on('click', function (evt) {
                $scope.playChannel(index);
            });
        };

        $scope.playChannel = function (index, airing) {
            if (index) {
                mediaSvc.getChannel($scope.channels[index].id).success(function (channel) {
                    $scope.playerOptions.file = channel.live_pc_url;
                    $scope.playerOptions.autoStart = true;
                    $scope.airing = airing;
                    $scope.channelLogo = $scope.channels[index].image_url;
                    $scope.channelNumber = $scope.channels[index].number;
                    $scope.channelName = $scope.channels[index].name;
                    playStream();
                }).error(function () {
                    loggerSvc.logError('Error loading channel.');
                });
            }
        };

        function playStream() {
            jwplayer('yiptv-player').setup({
                width: 912,
                height: 370,
                playlist: [{
                    image: $scope.channelLogo,
                    sources: [
                        {file: $scope.playerOptions.file}
                    ]
                }],
                rtmp: {
                    bufferlength: 3
                },
                primary: 'flash',
                modes: [
                    {
                        'type': 'flash',
                        'src': 'scripts/config/jwplayer/jwplayer.flash.swf'
                    }
                ],
                autostart: true,
                fallback: false
            });
        }

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

        $scope.getImage = function (uri) {
            if (uri.indexOf('/images/channels/') === 0) {
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
                programDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span><span class="program-details-body">' + $scope.getTime(1, airing) + '</span>&nbsp;<span class="program-details-header">Duration: </span><span class="program-details-body">' + airing.duration + ' min</span></p>';
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
                channelDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span><span class="program-details-body">' + $scope.getTime(1, show) + '</span>&nbsp;<span class="program-details-header">Duration: </span><span class="program-details-body">' + show.duration + ' min</span></p>';
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
