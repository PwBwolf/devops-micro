(function (app) {
    'use strict';

    app.controller('promoCtrl', ['$scope', 'userSvc', 'mediaSvc', 'homeScrnsSvc', 'loggerSvc', function ($scope, userSvc, mediaSvc, homeScrnsSvc, loggerSvc ) {
        $scope.usrScrnClasses = {};
                
        activate();
        function activate() {
            $scope.usrScrnClasses = homeScrnsSvc.getUsrClass();
            $scope.loadingChannels = true;
            userSvc.getPromoChannels(function (data) {
                $scope.promoChnls = data;
                if ($scope.promoChnls && $scope.promoChnls.length > 0) {
					for(var h in $scope.promoChnls){
                        console.log('the promo channel name is: '+$scope.promoChnls[h].name);
                    /*$scope.chnlClicked = function (index) {
			            $scope.selectedPromoChnl = index;
						$scope.selectChannel(index);
			        };*/
					}
                }
                $scope.loadingChannels = false;
            }, function () {
                $scope.loadingChannels = false;
                loggerSvc.logError('Error loading promo-channel list.');
            });
        };
		/*
        $scope.selectPromoChannel = function (channelIndex) {
            if(!$scope.loadingChannelGuide) {
                $scope.selectedChannelIndex = channelIndex;
                $scope.loadingChannelGuide = true;
				//console.log('chnl log: '+channelIndex);
                mediaSvc.getChannelGuide($scope.channels[channelIndex].live_external_id, $scope.channels[channelIndex].name).success(function (channelGuide) {
                    $scope.airings = channelGuide[0].airings;
                    $scope.playChannel(channelIndex);
					console.log('this time: '+$scope.airings[channelIndex].program.title);
					//$scope.onAir = $scope.airings[channelIndex].program.title;
                    $scope.loadingChannelGuide = false;
                }).error(function () {
                    $scope.loadingChannelGuide = false;
                    loggerSvc.logError('Error loading channel guide.');
                });
            }
        };
        
        
        $scope.playChannel = function (index, airing) {
            if(index) {
                mediaSvc.getChannel($scope.channels[index].id).success(function (channel) {
                    $scope.playerOptions.file = channel.live_pc_url;
                    $scope.playerOptions.autoStart = true;
                    $scope.airing = airing;
					//console.log(index+' - '+' - '+index+' - '+channel.live_pc_url);
                    $scope.channelLogo = $scope.channels[index].image_poster;
                    $scope.channelNumber = $scope.channels[index].number;
                    $scope.channelName = $scope.channels[index].name;
					
					playStream();
                }).error(function () {
                    loggerSvc.logError('Error loading channel.');
                });
            }
        };
		
        function playStream(){
            jwplayer("my-player").setup({
                // good for fullScrn //
                // width: "100%",    //
                // aspectratio: "16:9"//

                width: 902,
                height: 370,
                playlist: [{
                    image: $scope.channelLogo,
                    sources: [
                        //{file: bUrl+fUri+"&hash="+key+hmac }
                        //{ file: "http://yiptv-tele_caribe.hls.adaptive.level3.net" }
                        { file: $scope.playerOptions.file }
                    ],
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
                //androidhls: true,
                autostart: true,
                fallback: false

            });
        };
        
        */
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

        $scope.getImage = function(uri) {
            if(uri.indexOf('/images/channels/') === 0) {
                return uri;
            } else {
                return $scope.appConfig.graceNoteImageUrl + uri;
            }
        };

        $scope.getProgramDetails = function(airing) {
            var programDetails = '<p style="text-align: left"><span class="program-details-header">Program: </span>' + airing.program.title + '</p>';
            if(airing.duration) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Time: </span>' + $scope.getTime(1, airing) + '</p>';
            }
            if(airing.startTime) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Duration: </span>' + airing.duration + ' minutes</p>';
            }
            if(airing.program.shortDescription) {
                programDetails += '<p style="text-align: left"><span class="program-details-header">Description: </span>' + airing.program.shortDescription + '</p>';
            }
            return programDetails;
        };
		
		
		
		
		
    }]);
}(angular.module('app')));
