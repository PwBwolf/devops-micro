(function (app) {
    'use strict';

    app.directive('channelHover', ['$', function ($) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div ng-bind-html="programDetails"></div>',
            link: function (scope, el, attrs) {
                attrs.$set('class', 'small-channel-description');
                attrs.$set('id', 'smallChannelDescription');
                el.closest('li').on('click', function () {
                    var target = $(this).prop('tagName').toLowerCase();
                    target = $(target).index(this);
                    scope.$apply(scope.getTarget(target));
                    $(scope.guide).addClass('user-guide-panel-minimized');
                    $(scope.channels).switchClass('channel-panel', 'channel-panel-max', 500, 'easeInOutQuad');
                    scope.$apply(scope.showCloseButton());
                });
            }
        };
    }]);
}(angular.module('app')));
