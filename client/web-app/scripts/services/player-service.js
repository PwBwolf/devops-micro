(function (app) {
    'use strict';

    app.factory('playerSvc', ['$filter', '$rootScope', 'mediaSvc', function ($filter, $rootScope, mediaSvc) {

        var channelsEpgObj = {};
        var allChannelsObj = {};
        return {
            getTimeSlots: function () {
                var hoursOffset = 0;
                var currentSlot = new Date();
                var startSlot = Math.floor(currentSlot.getTime() / (1000 * 60 * 30));
                startSlot = startSlot * 1000 * 60 * 30;
                var timeSlots = [];
                for (var i = 0; i < 7; i++) {
                    hoursOffset = 3600 * 1000 * i;
                    timeSlots[i] = $filter('date')((startSlot + (hoursOffset)), 'h:mm a');
                }
                return timeSlots;
            },

            getProgramming: function (cb) {
                console.time('getProgramming')
                // channelIds is an array of id from $rootSCope.filteredChannels and has the ids in the
                // same order as $rootScope.filteredChannels
                var channelIds = $rootScope.filteredChannels.map(function (item) {
                    return item.id;
                });

                var allChannels = [];

                mediaSvc.getChannelGuideAll(channelIds.toString(), 6).success(function (channelsEpg) {
                        $rootScope.channelsEpg = channelsEpg;
                        // create filteredChannelObj with channel ids as keys
                        for(var i = 0; i < $rootScope.channelsEpg.length; i++){
                            var id = $rootScope.channelsEpg[i].channel_id;
                            channelsEpgObj[id] = $rootScope.channelsEpg[i].programs || [];
                        }
                        for(var i = 0; i < $rootScope.filteredChannels.length; i++){
                            // I declare these here instead of directly in the programInfo object for readability
                            var id = $rootScope.filteredChannels[i].id;
                            var chIndex = i;
                            var logo = $rootScope.filteredChannels[i].logoUri;
                            var channelTitle = $rootScope.filteredChannels[i].title;
                            var tags = $rootScope.filteredChannels[i].tags_ids;
                            var lineUp = channelsEpgObj[id];
                            if(lineUp.length > 0){
                                for (var j = 0; j < lineUp.length; j++) {
                                    if (lineUp[j].startTime) {
                                        lineUp[j]["startHour"] = $filter('date')(lineUp[j].startTime, 'h:mm');
                                        lineUp[j]["endHour"] = $filter('date')(lineUp[j].endTime, 'h:mm');
                                        lineUp[j]["dropdownInfo"] = lineUp[j]["title"] + "\n" + lineUp[j]["description"];
                                        lineUp[j]["length"] = showLength(lineUp[j].startTime, lineUp[j].endTime);
                                    } else {
                                        lineUp[j]["dropdownInfo"] = lineUp[j]["title"];
                                    }
                                }
                            }

                            var programInfo = {
                                id: id,
                                chIndex: chIndex,
                                logo: logo,
                                channelTitle: channelTitle,
                                epgIndex: i,
                                lineUp: lineUp,
                                tags: tags
                            };

                            allChannels.push(programInfo);
                            allChannelsObj[id] = programInfo;
                        }
                        console.timeEnd('getProgramming')
                        return cb(null, allChannels);
                    })
                    .error(function () {
                        return cb('channel guide ctrl error bloc');
                    });
            },

            formatFavorites: function (favorites) {
                var arr = [];
                for (var i = 0; i < favorites.length; i++) {
                    if(favorites[i].channelId){
                        arr.push(favorites[i].channelId);
                    }
                }
                return arr;
            },

            // get a full channel object for each channel id
            mapChannels: function (channelIds) {
                var arr = [];
                if (!Array.isArray(channelIds)) {
                    channelIds = objToArr(channelIds);
                }
                for (var i = 0; i < channelIds.length; i++) {
                    arr.push(allChannelsObj[channelIds[i]])
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

