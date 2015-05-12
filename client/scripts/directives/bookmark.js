(function (app) {
    'use strict';

    app.directive('bookmark', ['$', function ($) {
        return function (scope, element, attrs) {

            element.bind('click', function () {
                var id = element.attr('id');
                var site = $('html, body');
                site.animate({
                    scrollTop: $('#' + id + '_Bx').offset().top - 30
                }, 1500);
                return false;
            });
        };
    }]);
}(angular.module('app')));
