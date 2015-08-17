(function (app) {
    'use strict';

    app.directive('prflPnlDirective', function () {
        return {
            restrict: 'A',
            replace: true,
            template: '<div data-ng-include="{{slctdPnl.include}}"></div>'
        };
    });

}(angular.module('app')));
