(function (app) {
    'use strict';

    app.directive('menuScroller', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function () {
                var topBtn = angular.element('#pgCntnt');
                var navBar = $window.document.getElementById('navBar');
                var brand = $window.document.getElementById('brand');
                var navTop = navBar.offsetTop;
                var navLogo = brand.querySelector('img');
                var navDocked = false;

                function scrollTop() {
                    return $window.document.body.scrollTop || $window.document.documentElement.scrollTop;
                }

                $window.onscroll = function () {
                    if (!navDocked && (navBar.offsetTop - scrollTop() < 0)) {
                        navBar.style.top = 0;
                        navBar.style.position = 'fixed';
                        navBar.style.color = 'black';
                        navBar.className = 'docked';
                        navLogo.style.position = 'fixed';
                        navLogo.className = 'imgdocked';
                        topBtn.show('slow');
                        navDocked = true;
                    } else if (navDocked && scrollTop() <= navTop) {
                        navBar.style.position = 'absolute';
                        navLogo.style.position = 'absolute';
                        navBar.style.top = navTop + 'px';
                        navBar.style.color = '#3e194d';
                        navBar.className = navBar.className.replace('docked', '');
                        navLogo.className = navLogo.className.replace('imgdocked', '');
                        navLogo.style.position = 'absolute';
                        topBtn.hide('slow');
                        navDocked = false;
                    }
                };
            }
        };
    }]);
}(angular.module('app')));