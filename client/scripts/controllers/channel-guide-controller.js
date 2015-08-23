(function (app) {
    'use strict';

    app.controller('channelGuideCtrl', ['$scope', '$', 'mediaSvc', '$filter', 'loggerSvc', function ($scope, $, mediaSvc, $filter, loggerSvc) {

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

            mediaSvc.getUserChannels(function (data) {
                $scope.userChannels = data;

                angular.forEach($scope.userChannels, function (value, key) {
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
                                    $scope.channelLineUp = '<div title="' + data.program.title + '&#013;' + getTime(1, data) + '" style="' + timeSpan(data.duration, startDate, data.startTime) + '"><img src="../images/tv-logo.png" /><p style="text-align: left;"><span class="channel-details-body">' + data.program.title + '</span></p>';
                                } else {
                                    $scope.channelLineUp = '<div title="' + data.program.title + '&#013;' + getTime(1, data) + '" style="' + timeSpan(data.duration, startDate, data.startTime) + '"><img src="' + getImage(data.program.preferredImage.uri) + '" /><p style="text-align: left;"><span class="channel-details-body">' + data.program.title + '</span></p>';
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
                        loggerSvc.logError($filter('translate')('CHANNEL_GUIDE_LOAD_ERROR'));
                    });

                });
            });
        }

        function timeSpan(time, guideStartTime, programStartTime) {
            if (guideStartTime && programStartTime) {
                var hourDate = new Date(guideStartTime);
                hourDate.setMinutes(0);
                hourDate.setSeconds(0);
                var diff = Math.floor((hourDate.getTime() - new Date(programStartTime).getTime()) / (1000 * 60));
                if (diff >= 0) {
                    return 'width:' + ((time - diff) * 4) + 'px';
                } else {
                    return 'margin-left:' + (diff * -4) + 'px;' + 'width:' + (time * 4) + 'px;border-left: 1px solid';
                }
            } else {
                return 'width:' + (time * 4) + 'px';
            }
        }

        function getTime(index, airing) {
            if (index === 0) {
                return $filter('translate')('CHANNEL_GUIDE_ON_NOW');
            }
            if (!airing) {
                return '';
            }
            var startTime = new Date(airing.startTime);
            var endTime = new Date(airing.endTime);
            return (startTime.getHours() % 12 ? startTime.getHours() % 12 : 12) + ':' + pad(startTime.getMinutes()) + ' ' + (startTime.getHours() >= 12 ? 'PM' : 'AM' ) + ' - ' + (endTime.getHours() % 12 ? endTime.getHours() % 12 : 12) + ':' + pad(endTime.getMinutes()) + ' ' + (endTime.getHours() >= 12 ? 'PM' : 'AM' );
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
