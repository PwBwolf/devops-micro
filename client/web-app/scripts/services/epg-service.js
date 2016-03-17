(function() {
	'use strict'

	angular
		.module('app')
		.factory('epgSrvc', epgSrvc)

	epgSrvc.$inject = ['$filter', '$rootScope', 'mediaSvc']

	function epgSrvc ($filter, $rootScope, mediaSvc){
		var service = {
			// service properties and function refs go in here
			getTimeSlots: getTimeSlots,
			getLogos: getLogos,
			getProgramming: getProgramming,
			formatFavorites: formatFavorites,
			mapChannels: mapChannels
		}

		return service

		// functions that do workgo here
		function getTimeSlots() {
            var hoursOffset = 0
            var currentSlot = new Date();
            var startSlot = Math.floor(currentSlot.getTime() / (1000 * 60 * 30))
            startSlot = startSlot  * 1000 * 60 * 30
            var timeSlots = [];

            for (var i = 0; i < 16; i++) {
                hoursOffset = 1800 * 1000 * i
                timeSlots[i] = $filter('date')((startSlot + (hoursOffset)), 'h:mm a');
            }
            return timeSlots
        }

        function getLogos() {
        	var logos = []
            var channelIds = $rootScope.filteredChannels.map(function (item) { return item.id; });

            angular.forEach(channelIds, function(channelId) {
                var station = channelId;
                // delete after testing
                //var oldchIndex = _.findIndex($rootScope.filteredChannels, {id: station});
                var chIndex = $rootScope.filteredChannels.map(function(e){return e.id}).indexOf(channelId)
                // delete after testing
                // console.log('checking how indexOf works against _.findIndex', oldchIndex, chIndex)
                var logo =  $rootScope.filteredChannels[chIndex].logoUri;
                var channelTitle = $rootScope.filteredChannels[chIndex].title;

                var logoInformation = {
                    station: channelId,
                    chIndex: chIndex,
                    logo:  logo,
                    channelTitle: channelTitle,
                }

                logos.push(logoInformation)
            });
            return logos
        }

        function getProgramming(cb) {
            var startDate = new Date();
            var channelIds = $rootScope.filteredChannels.map(function (item) { return item.id; });
            var allChannels = []
            // delete after testing
            // console.log('element form $rootScope.filteredChannels', $rootScope.filteredChannels[0])
            // console.log('element form $rootScope.filteredChannels', $rootScope.filteredChannels[1])
            // console.log('element form $rootScope.filteredChannels', $rootScope.filteredChannels[2])
            // console.log('element form $rootScope.filteredChannels', $rootScope.filteredChannels[3])
            // console.log('printing channelIds in epg-controller - getProgramming()', $scope.channelIds)

            mediaSvc.getChannelGuideAll(channelIds.toString(), 6).success(function (channelsEpg) {
                $rootScope.channelsEpg = channelsEpg;

                angular.forEach(channelIds, function(channelId) {
                    var station = channelId;
                    // delete after testing
                    //var oldchIndex = _.findIndex($rootScope.filteredChannels, {id: station});
                    var chIndex = $rootScope.filteredChannels.map(function(e){return e.id}).indexOf(channelId)
                    // delete after testing
                    //console.log('checking how indexOf works against _.findIndex', oldchIndex, chIndex)
                    var logo =  $rootScope.filteredChannels[chIndex].logoUri;
                    var channelTitle = $rootScope.filteredChannels[chIndex].title;
                    // delete after testing
                    //var oldepgIndex =  _.findIndex(channelsEpg, {channel_id: station});
                    var epgIndex = channelsEpg.map(function(e){return e.channel_id}).indexOf(station)
                    // delete after testing
                    // console.log('checking how indexOf works for epgIndex in getProgramming()', oldepgIndex, epgIndex)
                    var lineUp = [];

                    if(epgIndex >= 0){
                        lineUp = channelsEpg[epgIndex].programs;
                    }

                    if (lineUp === null){
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
                        lineUp: lineUp
                    }

                    for(var i = 0; i < programInfo.lineUp.length; i++){
                        if(programInfo.lineUp[i].startTime){
                            programInfo.lineUp[i]["startHour"] = $filter('date')(programInfo.lineUp[i].startTime, 'h:mm')
                            programInfo.lineUp[i]["endHour"] = $filter('date')(programInfo.lineUp[i].endTime, 'h:mm')
                            programInfo.lineUp[i]["dropdownInfo"] = programInfo.lineUp[i]["title"] + "\n" + programInfo.lineUp[i]["description"]
                            programInfo.lineUp[i]["length"] = showLength(programInfo.lineUp[i].startTime, programInfo.lineUp[i].endTime)
                            // delete after testing
                            //console.log(programInfo.lineUp[i].startHour, programInfo.lineUp[i].endHour, programInfo.lineUp[i].length)
                        }
                        else{
                            programInfo.lineUp[i]["dropdownInfo"] = programInfo.lineUp[i]["title"]
                        }
                    }

                    allChannels.push(programInfo)
                });
                return cb(null, allChannels)
                //console.log('all channels in getProgramming', $scope.allChannels)
            })
            .error(function () {
                console.log('channel guide ctrl error bloc');
                return cb('channel guide ctrl error bloc')
            });
        }

        function showLength(startTime, endTime){
            var lastHalfHour = Math.floor(new Date().getTime() / (1000 * 60 * 30))
            lastHalfHour = lastHalfHour  * 1000 * 60 * 30
            startTime = new Date(startTime).getTime()
            endTime = new Date(endTime).getTime()

            if(startTime < lastHalfHour){
                var showRemaining = (endTime - lastHalfHour) / 1000 / 60
                return showRemaining
            }
            else{
                var showLength = (endTime - startTime) / 1000 / 60
                return showLength
            }
        }

        function formatFavorites(favorites){
            var arr = []
            for(var i = 0; i < favorites.length; i++){
                arr.push(favorites[i].channelId)
            }
            return arr
        }

        // technically, this is an O(n^2) algorithm in the worst case right now.
        // this can be fixed by changing the channel arrays to objects for O(1)
        // lookup time.
        function mapChannels(channelIds, allChannels) {
            var arr = []
            var channelIndex = -1;
            if(!Array.isArray(channelIds)) {
                channelIds = objToArr(channelIds)
            }
            for(var i = 0; i < channelIds.length; i++){
                channelIndex = allChannels.map(function(e){return e.station}).indexOf(channelIds[i])
                console.log('favorite channel object', allChannels[channelIndex])
                arr.push(allChannels[channelIndex])
            }
            return arr
        }

        function objToArr (obj) {
            var arr = []
            for (var key in obj) {
                if(obj.hasOwnProperty(key)) {
                    arr.push(obj[key])
                    console.log(obj.key)
                }
            }
            return arr
        }


	}
})()