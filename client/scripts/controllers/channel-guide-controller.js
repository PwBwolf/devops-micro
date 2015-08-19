(function (app) {
    'use strict';

    app.controller('channelGuideCtrl', ['$scope', '$', 'userSvc', 'mediaSvc', '$filter', 'loggerSvc', function ($scope, $, userSvc, mediaSvc, $filter, loggerSvc) {

        activate();

        function activate() {
            var date = new Date();
            var dt = $filter('date')(date, 'h:00 a');
            var channelGuideHolder = angular.element('#channelGuidePanel');
            var timeHeaderBar = angular.element(document.createElement('div'));
            var timeModule = angular.element(document.createElement('ul'));
            var timeModuleItemFirst = angular.element(document.createElement('li'));
            timeHeaderBar.attr('id', 'guideHeader').attr('class', 'guide-header');
            $(timeModuleItemFirst).attr('class', 'time-module-item').html(dt);
            $(timeModule).prepend(timeModuleItemFirst);

            function getTimeSlots() {
                var currentSlot = new Date();
                for (var l = 1; l < 30; l++) {
                    var count = 60 * l;
                    var timeSlots = [];
                    timeSlots[l] = $filter('date')(new Date(currentSlot.getTime() + (count * 60 * 1000)), 'h:00 a');
                    var timeModuleItemOthers = angular.element(document.createElement('li'));
                    $(timeModuleItemOthers).attr('class', 'time-module-item').html(timeSlots[l]);
                    $(timeModule).append(timeModuleItemOthers);
                }
            }

            getTimeSlots();

            $(timeHeaderBar).append(timeModule);

            userSvc.getUserChannels(function (data) {
                $scope.userChannels = data;

                angular.forEach($scope.userChannels, function (value, key) {
                    if (key < 10) {
                        mediaSvc.getChannelGuide(value.live_external_id, value.identifier).success(function (channelView) {
                            var logo = channelView[0].preferredImage.uri;
                            var station = channelView[0].callSign;
                            var lineUp = channelView[0].airings;
                            var channelGuide, channelLogo;

                            setChannelLineup();

                            function setChannelLineup() {
                                channelGuide = angular.element(document.createElement('div'));
                                channelLogo = angular.element(document.createElement('div'));
                                $(channelLogo).attr('id', 'channelGuideLogo').attr('class', 'guide-logo').attr('style', 'background: rgba(200,200,200,0.80) url(' + getImage(logo) + ') 50% no-repeat; background-size:contain ');
                                $(channelGuide).attr('channel', station).prepend(channelLogo);
                                var startDate = date;
                                angular.forEach(lineUp, function (data) {
                                    if (!data.program.preferredImage.uri) {
                                        $scope.channelLineUp = '<div style="width:' + timeSpan(data.duration, startDate, data.startTime) + '"><img src="../images/tv-logo.png" /><p style="text-align: left;"><span class="channel-details-body">' + data.program.title + '</span></p>';
                                    } else {
                                        $scope.channelLineUp = '<div style="width:' + timeSpan(data.duration, startDate, data.startTime) + '"><img src="' + getImage(data.program.preferredImage.uri) + '" /><p style="text-align: left;"><span class="channel-details-body">' + data.program.title + '</span></p>';
                                    }
                                    startDate = null;
                                    $scope.channelLineUp += '<p style="text-align: left"></span><span class="channel-details-body">' + getTime(1, data) + '</span></p></div>';
                                    $(channelGuide).append($scope.channelLineUp);
                                    $(channelGuide).attr('class', 'channel-description');
                                    $(channelGuide).attr('id', 'channelGuideDescription');
                                });
                                angular.element(channelGuideHolder).prepend(timeHeaderBar).append(channelGuide);
                            }
                        }).error(function () {
                            loggerSvc.logError('Error loading channel guide.');
                        });
                    } else {
                        return 'end';
                    }
                });
            });
        }

        $scope.channelHovered = function (index) {
            $scope.hoveredChannel = index;
            selectOnAir(index);
        };

        function timeSpan(time, guideStartTime, programStartTime) {
            if (guideStartTime && programStartTime) {
                var hourDate = new Date(guideStartTime);
                hourDate.setMinutes(0);
                hourDate.setSeconds(0);
                var diff = Math.floor((hourDate.getTime() - new Date(programStartTime).getTime()) / (1000 * 60));
                return (time * 4) - (diff * 4) + 'px';
            } else {
                return (time * 4) + 'px';
            }
        }

        function selectOnAir(channelIndex) {
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
        }

        function getTime(index, airing) {
            if (index === 0) {
                return 'on now';
            }
            if (!airing) {
                return '';
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

        function getImage(uri) {
            if (!uri) {
                return '/images/tv-logo.png';
            } else if (uri.indexOf('/images/') === 0) {
                return uri;
            } else {
                return $scope.appConfig.graceNoteImageUrl + uri;
            }
        }
    }]);
}(angular.module('app')));
