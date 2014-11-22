(function (app) {
    'use strict';

    app.directive('yipFlexSlider', [function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.flexslider({
                    animation: 'slide',
                    controlNav:false,
                    prevText: '',
                    nextText: ''
                });
            }
        };
    }]);
}(angular.module('app')));

