(function (app){
	'use strict'
	console.log('hello')
	app.controller('epgCtrl', ['$scope', '$rootScope', '$timeout', 'mediaSvc', '$filter', function ($scope, $rootScope, $timeout, mediaSvc, $filter) {
		console.log('epgCtrl loaded')
		$scope.blah = 'this is a string for testing'
		$scope.logos = []
		$scope.programming = []

		getTimeSlots()
		
		// media service has received array of channels. emitter events on root scope? ... can't be a great idea.
        $rootScope.$on('ChannelsLoaded', function () {
            // The original controller was using these functions with $timeout. I don't know why.
            // there doesn't appear to be a need to do so. I am using them with $timeout here and
            // everything seems to still be working.
            // call getChannelGuide 1 ms after the ChannelsLoaded event happens
            // $timeout(getLogos, 1);
            // // call getProgramming 1 ms after the ChannelsLoaded event happens
            // $timeout(getProgramming, 1)
            getLogos()
            getProgramming()
        });

        $scope.$on('ChannelFilterEvent', function(event, args) {
            updateChannelGuide($rootScope.filteredChannels);
        });

		function getTimeSlots() {
                
            // get current date. this is date string.
            var hoursOffset = 0
            var currentSlot = new Date();
            var startSlot = Math.floor(currentSlot.getTime() / (1000 * 60 * 30))
            console.log('startSlot in half hours', startSlot)
            startSlot = startSlot  * 1000 * 60 * 30
            var timeSlots = [];
            $scope.timeSlots = []

            for (var i = 0; i < 16; i++) {
                // calculating hours offset in milliseconds because getTime() uses UNIX epoch time.
                hoursOffset = 1800 * 1000 * i
                $scope.timeSlots[i] = $filter('date')((startSlot + (hoursOffset)), 'h:mm a');
            }
        }

        function getLogos() {
            var channelIds = $rootScope.filteredChannels.map(function (item) { return item.id; });

            console.log('channelId printing', channelIds)
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
                // $(channelLogo).attr('id', 'channelGuideLogo').attr('title', channelTitle).attr('style', 'cursor: pointer; background: #FFF url(' + getImage(logo) + ') 50% no-repeat; background-size:contain ').attr('ng-click', 'watchNow('+ chIndex + ',0)').attr('href', '') ;
            });
            console.log($scope.logos)
        }

        // This function creates the actual guide with the program listings and stuff
        // This should all go under channelGuideCtrl
        function getProgramming() {
            // start date is today
            var startDate = new Date();
            // $rootScope.filteredChannels is an array of objects for all the channels {id, logoUri, order, status, subscriptionPlan, tags_ids, title}
            // channelIds is just an array of the ids from $rootScope.filteredChannels
            var channelIds = $rootScope.filteredChannels.map(function (item) { return item.id; });
            $scope.channelIds = channelIds

            // ********* Things I need on the front end **********
            // 

            // probably gets all channels and programming for the next 6 hours
            mediaSvc.getChannelGuideAll(channelIds.toString(), 6).success(function (channelsEpg) {
                // sets program guide on root scope... dumb.
                // this an aray of objects with a channel id property and programs property. programs have
                // {description, startTime, endTime, genre, ratings, title}
                $rootScope.channelsEpg = channelsEpg;

                //console.log(channelsEpg, channelsEpg.length)
                
                // loop over the channels and 
                angular.forEach(channelIds, function(channelId) {

                    // station is the chanel id. not sure exactly what the channel id is, but it doesn't need to be set to station here.
                    var station = channelId;
                    //console.log('station', station)
                    
                    // chIndex is the actual position in the guide the channel appears. For example: chIndex 0 will be the first one in the guide
                    var chIndex = _.findIndex($rootScope.filteredChannels, {id: station});
                    //console.log('chIndex', chIndex)
                    
                    // a link to the logo for a given channel
                    var logo =  $rootScope.filteredChannels[chIndex].logoUri;
                    //console.log('logo', logo)
                    
                    // the title of the channel, like HBO or Bloomberg
                    var channelTitle = $rootScope.filteredChannels[chIndex].title;
                    //console.log('channelTitle', channelTitle)
                    
                    // mostly the same as chIndex. probably will be used to move important channels to the top
                    var epgIndex =  _.findIndex(channelsEpg, {channel_id: station});
                    //console.log('epgIndex', epgIndex)
                    
                    // the programs for the current time period
                    // channelsEpg has the programs for the current channel
                    var lineUp = [];
                    if(epgIndex >= 0){
                        lineUp = channelsEpg[epgIndex].programs;
                        //console.log('lineUp is ', lineUp)                            
                    }

                    if (lineUp === null){
                    	lineUp = [{
                    		title: 'Not Available',
                    		description: 'Not Available'
                    	}]
                    }

                    console.log('hello lineUp', lineUp)

                    var programInfo = {
                    	station: channelId,
                    	chIndex: _.findIndex($rootScope.filteredChannels, {id: station}),
                    	logo: $rootScope.filteredChannels[chIndex].logoUri,
                    	channelTitle: $rootScope.filteredChannels[chIndex].title,
                    	epgIndex: _.findIndex(channelsEpg, {channel_id: station}),
                    	lineUp: lineUp
                    }

                    // this section is all just data formatting. It makes sure the show times and dropdown information
                    // looks good. Passing the startTime and endTime through filters in the html page and concatenating
                    // them wasn't working. The dropdown text looks better when formatted here. Otherwise you get 
                    // 'Not Available' printing twice, leaving a blank new line, or getting too much logic in the page.
                    // I prefer keeping it in the controller. 
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
                    console.log(programInfo)

                    // make some divs and set their sizes
                    // is this happening in line or nested?
                    //var blahblah = document.createElement('div')
                    //console.log('seeing what happens with function inside a function', document.createElement('div'))
                    
                    // *******************************************
                    // create channelGuide and channelBlock divs for each element in channelId
                    // set the width and height of channelBlock
                    // make channelBlock the first child element of channelGuide
                    // do this for each channelId
                    // not sure where the channelGuide is getting attached to the page

                    var channelLineUp;

                    // // run this if there are any programs scheduled for the channel
                    // if (lineUp && lineUp.length > 0) {
                    //     angular.forEach(lineUp, function (data, id) {
                    //         //if (!data.image) {
                    //         //    channelLineUp = '<div title="' + data.description + '&#013;' + getTime(1, data) + '" style="' + timeSpan(startDate, data.startTime, data.endTime) + '">';
                    //         //} else
                    //         //{
                    //             console.log('data and id in getChannelGuide', data, id)
                    //             // ***************************************
                    //             // concatenate data into html elements
                    //             // append these elements (channelLineup) to the channelGuide
                    //             // need to figure out how to convert the logic in here to directives
                    //             // 

                    //             // id seems to refer to the order of the programs. if it's 0, it's the current 
                    //             // program and needs the additional span. probably for styling purposes.
                    //             if(id === 0){
                    //                 channelLineUp = '<div title="' + data.title +'&#13;&#10;' + data.description + '&#013;' + getTime(1, data) + '" style="cursor: pointer;' + timeSpan(startDate, data.startTime, data.endTime) + '" ng-click="watchNow('+ chIndex + ',0)" href="">';
                    //                 channelLineUp += '<span style="float:right"> <img src="../images/play-button.png" /> </span>';
                    //             }
                    //             else{
                    //                 channelLineUp = '<div title="' + data.title +'&#13;&#10;' + data.description + '&#013;' + getTime(1, data) + '" style="' + timeSpan(startDate, data.startTime, data.endTime) + '">';
                    //             }
                    //         //}
                    //         channelLineUp += '<p style="text-align: left;"><span class="channel-details-body">' + data.title + '</span></p>';
                    //         channelLineUp += '<p style="text-align: left"></span><span class="channel-details-body">' + getTime(1, data) + '</span></p></div>';
                    //     });
                    // } 
                    // else {
                    //     channelLineUp = '<div title="' + $filter('translate')('PLAYER_NOT_AVAILABLE') + '" style="width:300px;border-right:none"><img src="../images/empty.png" /><p style="text-align: left;"><span class="channel-details-body">' + $filter('translate')('PLAYER_NOT_AVAILABLE') + '</span></p>';
                    // }
               });
            }).error(function () {
                    console.log('channel guide ctrl error bloc');
            });
        }

        // This function will calculate the size of an element in the epg based on how much time is
        // remaining in the program. Otherwise, shows that are longer than an hour will take up too
        // much room and push other elements over.
        function showLength(startTime, endTime){
            // calculate the most recent half hour and then  calculate the size of the element based
            // on the remaining time left in the show.
            
            // calculate most recent half hour then convert back to unix time
            var lastHalfHour = Math.floor(new Date().getTime() / (1000 * 60 * 30))
            lastHalfHour = lastHalfHour  * 1000 * 60 * 30
        	startTime = new Date(startTime).getTime()
        	endTime = new Date(endTime).getTime()

            // calculate width of the program element for a a show that already started based on
            // time remaining since the most recent half hour. 
            if(startTime < lastHalfHour){
                var showRemaining = (endTime - lastHalfHour) / 1000 / 60
                return showRemaining
            }
            else{
                // division at the end will give show length in minutes again
                var showLength = (endTime - startTime) / 1000 / 60
                return showLength
            }
        }


	}])
}(angular.module('app')));