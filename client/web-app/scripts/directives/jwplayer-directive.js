(function() {
    'use strict'
    angular
        .module('app')
        .directive('pipScreen', ppTv);

    function ppTv() {
        console.log('new jwplayer running');
        return {
            restrict: 'E',
            scope: {
                whichTv: '=info'
            },
            link: function (scope, element, attributes) {
                attributes.$observe('playurl', function(value) {
                    console.log('new playurl', value)
                    jwplayer(attributes.id).setup({
                        width: '100%',
                        height: 360,
                        file: value,
                        image: '@channelLogo',
                        primary: 'flash',
                        autostart: true,
                        fallback: true,
                        androidhls: true,
                        type: 'hls'
                    });

                })

            }
        };
    }
})()





// This is the code to have the picture and picture on the html
//<div id="tv-section">
//    <div class="main-tv">
//    <pip-screen info='tv' class="mainUrl" playurl="{{mainUrl}}" channel-logo="{{channelLogo}}" id="screen1"></pip-screen>
//    </div>
//    <div class="pip-controls">
//    <button class="pip-but btn btn-default" ng-model="picturepicture" ng-init="picturepicture=false"  ng-click="picturepicture= !picturepicture; playPip();" ng-bind="picturepicture? 'Close': 'Picture in Picture'"></button></br>
//    <button class="pip-but btn btn-default" ng-if="picturepicture" ng-click="switchTv()">Switch</button></br>
//    </div>
//    <div class="pip-tv" ng-if="picturepicture" ng-animate="'animate'">
//    <pip-screen info='pip'class="pipUrl" playurl="{{pipUrl}}" channel-logo="{{channelLogo}}" id="screen2"></pip-screen>
//    </div>
//    </div>

