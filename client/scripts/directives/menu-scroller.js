(function (app) {
    'use strict';

    app.directive('menuScroller', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function () {
                var topBtn = angular.element('#top');
                var navBar = $window.document.getElementById('navBar');
                var brand = $window.document.getElementById('brand');
                var navTop = navBar.offsetTop;
                var navLogo = brand.querySelector('img');
                var navDocked = false;

                function scrollTop() {
                    return $window.document.body.scrollTop || $window.document.documentElement.scrollTop;
                }

                $window.onscroll = function () {
					var c = 0;
                    if (!navDocked && (navBar.offsetTop - scrollTop() < 0)) {
                        navBar.style.top = 0;
                        navBar.style.position = 'fixed';
                        navBar.style.color = 'black';
                        navBar.className = 'docked';
                        navLogo.style.position = 'fixed';
                        navLogo.className = 'image-docked';
                        topBtn.show('slow');
                        navDocked = true;
						
						
                    } else if (navDocked && scrollTop() <= navTop) {
						//c++;
                        navBar.style.position = 'absolute';
                        navLogo.style.position = 'absolute';
                        navBar.style.top = navTop + 'px';
                        navBar.style.color = '#3e194d';
                        navBar.className = navBar.className.replace('docked', '');
                        navLogo.className = navLogo.className.replace('image-docked', null);
						topBtn.hide('slow');
                        navDocked = false;

						
                    }
					
                };
            }
        };
    }]);
}(angular.module('app')));
