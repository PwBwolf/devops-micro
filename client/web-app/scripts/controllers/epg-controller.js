(function (app){
	'use strict'
	console.log('hello')
	app.controller('epgCtrl', ['$scope', '$rootScope', '$timeout', 'mediaSvc', '$filter', function ($scope, $rootScope, $timeout, mediaSvc, $filter) {
		$scope.logos = []
		$scope.programming = []

		getTimeSlots()
		
        $rootScope.$on('ChannelsLoaded', function () {
            getLogos()
            getProgramming()
        });

        $scope.$on('ChannelFilterEvent', function(event, args) {
            updateChannelGuide($rootScope.filteredChannels);
        });

		function getTimeSlots() {
            var hoursOffset = 0
            var currentSlot = new Date();
            var startSlot = Math.floor(currentSlot.getTime() / (1000 * 60 * 30))
            startSlot = startSlot  * 1000 * 60 * 30
            var timeSlots = [];
            $scope.timeSlots = []

            for (var i = 0; i < 16; i++) {
                hoursOffset = 1800 * 1000 * i
                $scope.timeSlots[i] = $filter('date')((startSlot + (hoursOffset)), 'h:mm a');
            }
        }

        function getLogos() {
            var channelIds = $rootScope.filteredChannels.map(function (item) { return item.id; });
            
            angular.forEach(channelIds, function(channelId) {
                var station = channelId;
                var chIndex = _.findIndex($rootScope.filteredChannels, {id: station});
                var logo =  $rootScope.filteredChannels[chIndex].logoUri;
                var channelTitle = $rootScope.filteredChannels[chIndex].title;

                var logoInformation = {
                	station: channelId,
	                chIndex: _.findIndex($rootScope.filteredChannels, {id: station}),
	                logo:  $rootScope.filteredChannels[chIndex].logoUri,
	                channelTitle: $rootScope.filteredChannels[chIndex].title,
                }

                $scope.logos.push(logoInformation)
            });
        }

        function getProgramming() {
            var startDate = new Date();
            var channelIds = $rootScope.filteredChannels.map(function (item) { return item.id; });
            $scope.channelIds = channelIds

            mediaSvc.getChannelGuideAll(channelIds.toString(), 6).success(function (channelsEpg) {
                $rootScope.channelsEpg = channelsEpg;
                
                angular.forEach(channelIds, function(channelId) {
                    var station = channelId;
                    var chIndex = _.findIndex($rootScope.filteredChannels, {id: station});                    
                    var logo =  $rootScope.filteredChannels[chIndex].logoUri;
                    var channelTitle = $rootScope.filteredChannels[chIndex].title;
                    var epgIndex =  _.findIndex(channelsEpg, {channel_id: station});
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
                    	chIndex: _.findIndex($rootScope.filteredChannels, {id: station}),
                    	logo: $rootScope.filteredChannels[chIndex].logoUri,
                    	channelTitle: $rootScope.filteredChannels[chIndex].title,
                    	epgIndex: _.findIndex(channelsEpg, {channel_id: station}),
                    	lineUp: lineUp
                    }

                    for(var i = 0; i < programInfo.lineUp.length; i++){
                    	if(programInfo.lineUp[i].startTime){
                    		programInfo.lineUp[i]["startHour"] = $filter('date')(programInfo.lineUp[i].startTime, 'h:mm')
	                    	programInfo.lineUp[i]["endHour"] = $filter('date')(programInfo.lineUp[i].endTime, 'h:mm')
	                    	programInfo.lineUp[i]["dropdownInfo"] = programInfo.lineUp[i]["title"] + "\n" + programInfo.lineUp[i]["description"]
	                    	programInfo.lineUp[i]["length"] = showLength(programInfo.lineUp[i].startTime, programInfo.lineUp[i].endTime)
	                    	console.log(programInfo.lineUp[i].startHour, programInfo.lineUp[i].endHour, programInfo.lineUp[i].length)
                    	}
                    	else{
                    		programInfo.lineUp[i]["dropdownInfo"] = programInfo.lineUp[i]["title"]
                    	}
                    }

                    $scope.programming.push(programInfo)
               });
            }).error(function () {
                    console.log('channel guide ctrl error bloc');
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


	}])
}(angular.module('app')));