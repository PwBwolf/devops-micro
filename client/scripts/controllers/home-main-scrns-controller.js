(function (app) {
    'use strict';

    app.controller('homeScrnsCtrl', ['$scope', '$filter', 'homeScrnsSvc', 'accessurlsvc', 'accesskeysvc', function ($scope, $filter, homeScrnsSvc, accessurlsvc, accesskeysvc) {
        $scope.usrSubScrn = {};
        $scope.usrFavs = [];
        $scope.usrSgstns = [];
        $scope.usrScrnClasses = {};
        $scope.usrCntnt = {};
        $scope.allChannels = [];
        $scope.prodLvls = [];
        $scope.fullShowDesc = [];
        $scope.keyTokens = [];
        $scope.kTkn = [];
        $scope.showTheFile = function () {
            return true;
        };

        init();
        function init() {
            $scope.usrSubScrn = homeScrnsSvc.getUsrSubData();
            $scope.usrFavs = homeScrnsSvc.getUsrFavs();
            $scope.usrSgstns = homeScrnsSvc.getUsrSgstns();
            $scope.usrScrnClasses = homeScrnsSvc.getUsrClass();
            $scope.allChannels = accessurlsvc.getAllData();
            $scope.prodLvls = accessurlsvc.getProdStatus();
            $scope.fullShowDesc = accessurlsvc.getShowDesc();
            $scope.keyTokens = accesskeysvc.getAllData();
            $scope.kTkn = accesskeysvc.getRndmData();

            var mytest;
            $scope.callMyTest = mytest;
        }


        $scope.selectedIndex = -1; // Whatever the default selected index is, use -1 for no selection

        $scope.itemClicked = function ($index) {
            $scope.selectedIndex = $index; // Flip card on click
        };

        var key = $scope.kTkn.key;
        var token = $scope.kTkn.token;
        var error = '';

        var trnBck = 60 * 10;
        var sTime = sTime - trnBck;
        var timespan = 60 * 20;
        var eTime = sTime + timespan;

        $scope.createH = function (show) {
            var showDtls = $filter('filter')($scope.allChannels, {tmsId: show})[0];
            var bUrl = showDtls.baseUrl;
            var bUri = showDtls.streamLoc;
            var fUri = bUri + "?valid_from=" + sTime + "&valid_to=" + eTime;
            if (sTime) {
                setupPlayer(bUrl, bUri, fUri);
            } else {
                setPromotion(strtTme, endTme, duration, stationId, program);
            }
        };

        function setPromotion() {
            $scope.showTheFile = function () {
                //return true;
            };
        }

        function setupPlayer(bUrl, bUri, fUri) {
            if (key < 0 || key > 9) {
                error = 'Error: Invalid KEY value';
            }
            if (token.length < 20 || token.length > 64) {
                error = 'Error: Invalid key length';
            }
            if (fUri.length < 1) {
                error = 'Error: No URI found';
            }
            if (error.length > 0) {
                document.getElementById('errLog').innerHTML = error;
            } else {
                var hmac = Crypto.HMAC(Crypto.SHA1, fUri, token);
                if (hmac.length > 20) {
                    hmac = hmac.substr(0, 20);
                }
            }

            jwplayer('my-player').setup({
                width: 902,
                height: 370,
                playlist: [{
                    image: '../images/friend-banner.jpg',
                    sources: [
                        {file: bUrl + fUri + '&hash=' + key + hmac}
                    ]
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
                autostart: true,
                fallback: false

            });
        }
    }]);
}(angular.module('app')));
