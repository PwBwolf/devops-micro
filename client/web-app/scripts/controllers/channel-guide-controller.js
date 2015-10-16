(function (app) {
    'use strict';

    app.controller('channelGuideCtrl', ['$scope', '$rootScope', '$', '$q', '$timeout', 'mediaSvc', '$filter', 'loggerSvc', function ($scope, $rootScope, $, $q, $timeout, mediaSvc, $filter) {

        var canceller;
        var date = new Date();
        var channelGuideHolder = angular.element('#channelGuidePanel');
        var timeHeaderBar = angular.element(document.createElement('div'));

        activate();

        function activate() {
            var dt = $filter('date')(date, 'h:00 a');
            var timeModule = angular.element(document.createElement('ul'));
            var timeModuleItemFirst = angular.element(document.createElement('li'));
            timeHeaderBar.attr('id', 'guideHeader').attr('class', 'guide-header');
            $(timeModuleItemFirst).attr('class', 'time-module-item').html(dt);
            $(timeModule).prepend(timeModuleItemFirst);

            function getTimeSlots() {
                var currentSlot = new Date();
                for (var l = 1; l < 8; l++) {
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
        }

        $rootScope.$on('ChannelsLoaded', function () {
            $timeout(getChannelGuide, 100);
        });

        function getChannelGuide() {
            async.eachSeries($rootScope.channels, function (value, callback) {
                if (canceller) {
                    canceller.resolve();
                }
                canceller = $q.defer();
                mediaSvc.getChannelGuide(value.id, 6, canceller).success(function (programs) {
                    var logo = value.logoUri;
                    var station = value.id;
                    var lineUp = programs;
                    var channelGuide = angular.element(document.createElement('div'));
                    var channelLogo = angular.element(document.createElement('div'));
                    $(channelLogo).attr('id', 'channelGuideLogo').attr('title', value.name).attr('class', 'guide-logo').attr('style', 'background: rgba(200,200,200,0.80) url(' + getImage(logo) + ') 50% no-repeat; background-size:contain ');
                    $(channelGuide).attr('channel', station).prepend(channelLogo);
                    var startDate = date;
                    var channelLineUp;
                    if (lineUp.length > 0) {
                        angular.forEach(lineUp, function (data) {
                            if (!data.image) {
                                channelLineUp = '<div title="' + data.title + '&#013;' + getTime(1, data) + '" style="' + timeSpan(data.endTime, startDate, data.startTime) + '"><img src="../images/tv-logo.png" /><p style="text-align: left;"><span class="channel-details-body">' + data.title + '</span></p>';
                            } else {
                                channelLineUp = '<div title="' + data.title + '&#013;' + getTime(1, data) + '" style="' + timeSpan(data.endTime, startDate, data.startTime) + '"><img src="' + getImage(data.image) + '" /><p style="text-align: left;"><span class="channel-details-body">' + data.title + '</span></p>';
                            }
                            startDate = null;
                            channelLineUp += '<p style="text-align: left"></span><span class="channel-details-body">' + getTime(1, data) + '</span></p></div>';
                            $(channelGuide).append(channelLineUp);
                        });
                    } else {
                        channelLineUp = '<div title="' + $filter('translate')('PLAYER_NOT_AVAILABLE') + '" style="width:300px;border-right:none"><img src="../images/empty.png" /><p style="text-align: left;"><span class="channel-details-body">' + $filter('translate')('PLAYER_NOT_AVAILABLE') + '</span></p>';
                        $(channelGuide).append(channelLineUp);

                    }
                    $(channelGuide).attr('class', 'channel-description');
                    $(channelGuide).attr('id', 'channelGuideDescription');
                    angular.element(channelGuideHolder).prepend(timeHeaderBar).append(channelGuide);
                    callback();
                }).error(function () {
                    callback();
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
                    return 'width:' + ((time - diff) * 5) + 'px';
                } else {
                    return 'margin-left:' + (diff * -5) + 'px;' + 'width:' + (time * 5) + 'px;border-left: 1px solid';
                }
            } else {
                return 'width:' + (time * 5) + 'px';
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
            return (startTime.getHours() % 12 ? startTime.getHours() % 12 : 12) + ':' + pad(startTime.getMinutes()) + ' ' + (startTime.getHours() >= 12 ? 'PM' : 'AM' ) + ' - ' + (endTime.getHours() % 12 ? endTime.getHours() % 12 : 12) + ':' + pad(endTime.getMinutes()) + ' ' + (endTime.getHours() >= 12 ? 'PM' : 'AM');
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
                return '/images/empty.png';
            } else if (uri.indexOf('/images/') === 0) {
                return uri;
            } else {
                return uri;
            }
        }
    }]);
}(angular.module('app')));
