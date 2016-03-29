(function (app) {
    'use strict';

    app.factory('playerSvc', ['$filter', '$rootScope', 'mediaSvc', function ($filter, $rootScope, mediaSvc) {

        return {
            getTimeSlots: function () {
                var hoursOffset = 0;
                var currentSlot = new Date();
                var startSlot = Math.floor(currentSlot.getTime() / (1000 * 60 * 30));
                startSlot = startSlot * 1000 * 60 * 30;
                var timeSlots = [];
                for (var i = 0; i < 6; i++) {
                    hoursOffset = 3600 * 1000 * i;
                    timeSlots[i] = $filter('date')((startSlot + (hoursOffset)), 'h:mm a');
                }
                return timeSlots;
            },

            getProgramming: function (cb) {
                var channelIds = $rootScope.filteredChannels.map(function (item) {
                    return item.id;
                });
                var allChannels = [];

                mediaSvc.getChannelGuideAll(channelIds.toString(), 6).success(function (channelsEpg) {
                        $rootScope.channelsEpg = channelsEpg;
                        angular.forEach(channelIds, function (channelId) {
                            var station = channelId;
                            var chIndex = $rootScope.filteredChannels.map(function (e) {
                                return e.id;
                            }).indexOf(channelId);
                            var logo = $rootScope.filteredChannels[chIndex].logoUri;
                            var channelTitle = $rootScope.filteredChannels[chIndex].title;
                            var epgIndex = channelsEpg.map(function (e) {
                                return e.channel_id;
                            }).indexOf(station);
                            var lineUp = [];
                            var tags = $rootScope.filteredChannels[chIndex].tags_ids;
                            if (epgIndex >= 0) {
                                lineUp = channelsEpg[epgIndex].programs;
                            }
                            if (lineUp === null) {
                                lineUp = [{
                                    title: 'Not Available',
                                    description: 'Not Available'
                                }]
                            }
                            var programInfo = {
                                station: channelId,
                                chIndex: chIndex,
                                logo: logo,
                                channelTitle: channelTitle,
                                epgIndex: epgIndex,
                                lineUp: lineUp,
                                tags: tags
                            };
                            for (var i = 0; i < programInfo.lineUp.length; i++) {
                                if (programInfo.lineUp[i].startTime) {
                                    programInfo.lineUp[i]["startHour"] = $filter('date')(programInfo.lineUp[i].startTime, 'h:mm');
                                    programInfo.lineUp[i]["endHour"] = $filter('date')(programInfo.lineUp[i].endTime, 'h:mm');
                                    programInfo.lineUp[i]["dropdownInfo"] = programInfo.lineUp[i]["title"] + "\n" + programInfo.lineUp[i]["description"];
                                    programInfo.lineUp[i]["length"] = showLength(programInfo.lineUp[i].startTime, programInfo.lineUp[i].endTime);
                                } else {
                                    programInfo.lineUp[i]["dropdownInfo"] = programInfo.lineUp[i]["title"];
                                }
                            }
                            allChannels.push(programInfo);
                        });
                        return cb(null, allChannels);
                    })
                    .error(function () {
                        return cb('channel guide ctrl error bloc');
                    });
            },

            formatFavorites: function (favorites) {
                var arr = [];
                for (var i = 0; i < favorites.length; i++) {
                    arr.push(favorites[i].channelId);
                }
                return arr;
            },

            mapChannels: function (channelIds, allChannels) {
                var arr = [];
                var channelIndex = -1;
                if (!Array.isArray(channelIds)) {
                    channelIds = objToArr(channelIds);
                }
                for (var i = 0; i < channelIds.length; i++) {
                    channelIndex = allChannels.map(function (e) {
                        return e.station;
                    }).indexOf(channelIds[i]);
                    arr.push(allChannels[channelIndex])
                }
                return arr;
            }
        };

        function showLength(startTime, endTime) {
            var lastHalfHour = Math.floor(new Date().getTime() / (1000 * 60 * 30));
            lastHalfHour = lastHalfHour * 1000 * 60 * 30;
            startTime = new Date(startTime).getTime();
            endTime = new Date(endTime).getTime();
            if (startTime < lastHalfHour) {
                return (endTime - lastHalfHour) / 1000 / 60;
            } else {
                return (endTime - startTime) / 1000 / 60;
            }
        }

        function objToArr(obj) {
            var arr = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    arr.push(obj[key]);
                }
            }
            return arr;
        }

        function arrToObj(arr) {
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                var currentValue = arr[i];
                obj[currentValue] = arr[i];
            }
            return arrToObj;
        }
    }]);
}(angular.module('app')));

