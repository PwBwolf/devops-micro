(function (app) {
    'use strict';

    app.directive('jwplayer', [function () {
        return {
            restrict: 'EC',
            link: function (scope, element, attrs) {
                jwplayer(attrs.id).setup(scope.options);

                scope.$watch('options', function (options) {
                    jwplayer(attrs.id).remove();
                    jwplayer(attrs.id).setup(options);
                }, true);
            }


        };
    }]);
}(angular.module('app')));
