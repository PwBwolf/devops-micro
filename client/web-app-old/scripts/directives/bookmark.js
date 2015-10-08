(function (app) {
    'use strict';

    app.directive('bookmark', ['$', function ($) {
        return function (scope, element) {

            element.bind('click', function () {
                var id = element.attr('id');
                var site = $('html, body');
                site.animate({
                    scrollTop: $('#' + id + 'Box').offset().top - 30
                }, 1500);
                return false;
            });
        };
    }]);
}(angular.module('app')));
