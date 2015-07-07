(function (app){
    'use strict'
    app.controller('jwplyrCtrl', ['userSvc', 'mediaSvc', 'loggerSvc', '$scope', function (userSvc, mediaSvc, loggerSvc, $scope) {
        $scope.playChannel = function (index, airing) {
            if(index) {
                mediaSvc.getChannel($scope.channels[index].id).success(function (channel) {
                    $scope.playerOptions.file = channel.live_pc_url;
                    $scope.playerOptions.autoStart = true;
                    $scope.airing = airing;
					//console.log(index+' - '+' - '+$scope.selectedChannelIndex+' - '+channel.live_pc_url);
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
						{ file: file }
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

    }]);

}(angular.module('app')));


