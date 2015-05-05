(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', '$location', function (appSvc, $scope, $window, $location) {
        activate();
		
		$scope.notifyServiceOnChage = function(){
		    console.log($scope.windowHeight);
		};

        function activate() {
            if ($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
        };

        $scope.imageMapClick = function (url) {
            if (url.charAt(0) === '/') {
                $location.path(url);
            } else {
                $window.open(url);
            }
        };

        $scope.onWebSliderChange = function () {
            angular.element($window).triggerHandler('resize');
        };

        $scope.$watch(function () {
            return window.innerWidth;
        }, function (value) {
            var x = value;
            switch (true) {
                case (x < 768):
                    $scope.usrDataFile = {
                        'bnr': 'views/user-banner-mobile.html',
                        'shws': 'views/user-shows.html',
                        'ntwrks': 'views/user-networks.html',
                        'abt': 'views/user-about.html',
                        'app': 'views/user-app.html',
                        'ftr': 'views/user-footer-menu.html'
                    };
                    break;
                case (x > 767 && x < 1025):
                    $scope.usrDataFile = {
                        'bnr': 'views/user-banner-tablet.html',
                        'shws': 'views/user-shows.html',
                        'ntwrks': 'views/user-networks.html',
                        'abt': 'views/user-about.html',
                        'app': 'views/user-app.html',
                        'ftr': 'views/user-footer-menu.html'
                    };
                    break;
                case (x > 1025):
                    $scope.usrDataFile = {
                        'bnr': 'views/user-banner.html',
                        'shws': 'views/user-shows.html',
                        'ntwrks': 'views/user-networks.html',
                        'abt': 'views/user-about.html',
                        'app': 'views/user-app.html',
                        'ftr': 'views/user-footer-menu.html'
                    };
                    break;
            }
        });

        var mnuBtns = ['pgCntnt', 'Shws', 'Ntwrks', 'Abt', 'Orders'];

        for (var j = 0; j < 5; j++) {
            $('#' + mnuBtns[j]).on('click', function () {
                var dPg = $(this).attr('id');
                var dSite = $('html, body');
                dSite.animate({
                    scrollTop: $('#' + dPg + '_Bx').offset().top - 30
                }, 1500);
                return false;
            });
        }
		
		
		$scope.$on('$locationChangeStart', function (event, newLoc, oldLoc){
		   console.log('changing to: ' + newLoc);
		});

		$scope.$on('$locationChangeSuccess', function (event, newLoc, oldLoc){
		   console.log('changed from '+oldLoc+' to: ' + newLoc);
		});
		
    }]);
}(angular.module('app')));
