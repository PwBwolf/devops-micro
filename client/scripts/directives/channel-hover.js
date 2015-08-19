(function (app) {
    'use strict';

    app.directive('channelHover', ['$', function ($) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div compile-html="programDetails"></div>',
            link: function (scope, el, attrs) {
                attrs.$set('class', 'small-channel-description');
                attrs.$set('id', 'smallChannelDescription');
                el.closest('li').on('click', function () {
                    $(scope.channelList).removeClass('channel-panel');
                    $(scope.channelList).addClass('channel-panel-max');
                    scope.$apply(scope.showCloseButton());
                });
            }
        };
    }]);
}(angular.module('app')));
