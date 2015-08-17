(function (app) {
    'use strict';

    app.directive('channelExpander', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div data-ng-bind-html=showListings></div>',
            link: function (scope, el, attrs) {
                attrs.$set('id', 'channelPreviewPanel');
                attrs.$set('class', 'channelPreview');
            }
        };
    });

}(angular.module('app')));
