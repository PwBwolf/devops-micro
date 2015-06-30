(function (app) {
    'use strict';

    app.controller('playerCtrl', ['userSvc', 'mediaSvc', 'loggerSvc', '$scope', function (userSvc, mediaSvc, loggerSvc, $scope) {
        $scope.playerOptions = {
			id: 'my-player',
            file: '/videos/yiptv.mp4',
			width: 902,
			height: 370,
            aspectratio: '16:9',
            primary: 'flash',
            logo: {
                file: '/images/tv_logo.png'
            }
        };

        $scope.channelSliderOptions = {
            auto: false,
            autoStart: false,
            maxSlides: 10,
            slideWidth: 150,
            slideMargin: 50,
            preloadImages: 'visible',
            pager: false
        };

        $scope.channelGuideSliderOptions = {
            auto: false,
            autoStart: false,
            maxSlides: 20,
            slideWidth: 150,
            slideMargin: 0,
            infiniteLoop: false,
            hideControlOnEnd: true,
            preloadImages: 'visible',
            pager: false
        };

        activate();

        function activate() {
            $scope.loadingChannels = true;
            userSvc.getUserChannels(function (data) {
                $scope.channels = data;
                if ($scope.channels && $scope.channels.length > 0) {
                    //$scope.selectChannel(0);
			        $scope.chnlClicked = function (index) {
			            $scope.selectedChnl = index;
						$scope.selectChannel(index);
			        };
					
					for(var c in $scope.channels){
						//$scope.selectChannel(c);
						//console.log($scope.channels[c].name);
					}
                }
                $scope.loadingChannels = false;
            }, function () {
                $scope.loadingChannels = false;
                loggerSvc.logError('Error loading channel list.');
            });
        };
		//jwplayer("my-player").setup({ $scope.playerOptions; });
		//console.log($scope.channels.length);
		
        $scope.selectChannel = function (channelIndex) {
            if(!$scope.loadingChannelGuide) {
                $scope.selectedChannelIndex = channelIndex;
                $scope.loadingChannelGuide = true;
				console.log('chnl log: '+channelIndex);
                mediaSvc.getChannelGuide($scope.channels[channelIndex].live_external_id, $scope.channels[channelIndex].name).success(function (channelGuide) {
                    $scope.airings = channelGuide[0].airings;
					//console.log('this time: '+$scope.airings[channelIndex].program.title);
					$scope.onAir = $scope.airings[0].program.title;
                    $scope.loadingChannelGuide = false;
                }).error(function () {
                    $scope.loadingChannelGuide = false;
                    loggerSvc.logError('Error loading channel guide.');
                });
            }
        };

        $scope.playChannel = function (index, airing) {
            if(index) {
                mediaSvc.getChannel($scope.channels[$scope.selectedChannelIndex].id).success(function (channel) {
                    $scope.playerOptions.file = channel.live_pc_url;
                    $scope.playerOptions.autoStart = true;
                    $scope.airing = airing;
					console.log(index+' - '+channel.live_pc_url);
                    $scope.channelLogo = $scope.channels[$scope.selectedChannelIndex].image_url;
                    $scope.channelNumber = $scope.channels[$scope.selectedChannelIndex].number;
                    $scope.channelName = $scope.channels[$scope.selectedChannelIndex].name;
					
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
