(function (app) {
    'use strict';

    app.factory('playerSvc', ['$filter', '$rootScope', 'mediaSvc', function ($filter, $rootScope, mediaSvc) {
        console.log('player service loaded')
        var channelsEpgObj = {};
        var allChannelsObj = {};
        var timeBarStart;
        return {
            getTimeSlots: function () {
                var hoursOffset = 0;
                timeBarStart = lastHalfHour();
                var timeSlots = [];
                for (var i = 0; i < 7; i++) {
                    hoursOffset = 3600 * 1000 * i;
                    timeSlots[i] = $filter('date')((timeBarStart + (hoursOffset)), 'h:mm a');
                }
                return timeSlots;
            },

            getProgramming: function (cb) {
                // channelIds is an array of id from $rootSCope.filteredChannels and has the ids in the
                // same order as $rootScope.filteredChannels
                var channelIds = $rootScope.filteredChannels.map(function (item) {
                    return item.id;
                });

                var allChannels = [];

                makeAllChannelObj($rootScope.filteredChannels);

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
                            var lineUp = channelsEpgObj[id] || [];
                            lineUp = formatLineUp(lineUp);

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

                        return cb(null, allChannels);
                    })
                    .error(function () {
                        return cb('channel guide ctrl error bloc');
                    });
            },

            formatFavorites: function (favorites) {
                var arr = [];
                for (var i = 0; i < favorites.length; i++) {
                    var validId = allChannelsObj.hasOwnProperty(favorites[i].channelId);
                    if(validId){
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
            },

            allChannelsObj: allChannelsObj,
        }

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

        function formatLineUp(lineUp){
            if(lineUp.length > 0){
                var firstShowStart = new Date(lineUp[0].startTime).getTime();
                for (var j = 0; j < lineUp.length; j++) {
                    if(j === 0 && (firstShowStart > timeBarStart)){
                        var paddingObj = paddingObject(lineUp[0].image, lineUp[0].startTime);
                        lineUp.unshift(paddingObj);
                    }
                    if (lineUp[j].startTime) {
                        var title = lineUp[j]["title"];
                        var startTime = $filter('date')(lineUp[j].startTime, 'h:mm');
                        var endTime = $filter('date')(lineUp[j].endTime, 'h:mm');
                        var time = startTime + " - " + endTime;
                        var description = lineUp[j]["description"];
                        lineUp[j]["startHour"] = startTime;
                        lineUp[j]["endHour"] = endTime;
                        lineUp[j]["dropdownInfo"] = title + "\n" + time + "\n" + description;
                        lineUp[j]["length"] = showLength(lineUp[j].startTime, lineUp[j].endTime);
                    } else {
                        lineUp[j]["dropdownInfo"] = lineUp[j]["title"];
                    }
                }
            }
            return lineUp;
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

        function makeAllChannelObj(arr){
            for(var i = 0; i < arr.length; i++){
                var id = arr[i].id;
                var channel = arr[i];
                allChannelsObj[id] = channel;
            }
        }

        // create empty program object that will create padding between current time and a show that starts in the future
        // creating all fields of a program object so I don't have to worry about where else in the code these properties are used
        function paddingObject(image, endTime){
            var placeHolder = {
                description: null,
                dropDownInfo: null,
                title: null,
                genres: null,
                image: image,
                length: showLength(timeBarStart, endTime),
                endTime: endTime,
                startTime: new Date(timeBarStart).toISOString(),
                ratings: ""
            }
            return placeHolder;
        }

        // this is duplicate in player controller because I can't use it in getTimeSlots here and make it a property to
        // export and use in other controllers, so it would have to be duplicate in here, but I decided to just keep it
        // closer to where it's used in player-controller
        function lastHalfHour(){
            var currentTime = new Date();
            var lastHalf = Math.floor(currentTime.getTime() / (1000 * 60 * 30)); // get unix time in half hours rounded down to last half hour
            lastHalf = lastHalf * 1000 * 60 * 30;                               // get last half hour in ms again
            return lastHalf;
        }

    }]);
}(angular.module('app')));

