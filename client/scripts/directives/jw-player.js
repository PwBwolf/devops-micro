(function (app) {
    'use strict';

    app.directive('jwPlayer', [function () {
        return {
            restrict: 'EC',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.setup, function (setup) {
                    //if(setup.file) {
                            jwplayer(attrs.id).remove();
                            jwplayer(attrs.id).setup(setup);
                    //}
                }, true);
            }
        };
    }]);
}(angular.module('app')));
