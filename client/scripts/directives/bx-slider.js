(function (app) {
    'use strict';

    app.directive('bxSlider', [function () {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                var slider = element.bxSlider(scope.$eval(attrs.setup));

                scope.$watch(attrs.data, function () {
                    slider.destroySlider();
                    slider = element.bxSlider(scope.$eval(attrs.setup));
                }, true);
            }
        };
    }]);
}(angular.module('app')));
