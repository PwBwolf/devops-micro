(function (app) {
    'use strict';

    app.directive('channelAiring', function () {
        return {
            restrict: 'A',
            template: '<div data-ng-bind-html=ChannelLineup></div>',
            link: function (scope, element, attrs) {
                attrs.$set('id', 'channelGuideDesc');
                attrs.$set('class', 'chnlDesc');
            }
        };
    });

}(angular.module('app')));
