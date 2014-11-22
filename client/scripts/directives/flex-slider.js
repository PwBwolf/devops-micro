(function (app) {
    'use strict';

    app.directive('flexSlider', [function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.flexslider({
                    animation: 'slide',
                    controlNav:false
                });
            }
        };
    }]);
}(angular.module('app')));

