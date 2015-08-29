(function (app) {
    'use strict';

    app.directive('channelLogo', [function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div title="{{brandName}}" ng-show="logoVisible" style="background:rgba(200,200,200,0.85) url({{brandImage}}) 50% no-repeat; background-size: contain;"></div>',
            link: function (scope, element, attrs) {
                attrs.$set('id', 'channelBrand');
                attrs.$set('class', 'brand-logo ');
                scope.logoVisible = true;
            }
        };
    }]);
}(angular.module('app')));
