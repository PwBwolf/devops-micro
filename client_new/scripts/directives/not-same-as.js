(function (app) {
    'use strict';

    app.directive('notSameAs', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                otherModelValue: '=notSameAs'
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.notSameAs = function(modelValue) {
                    return modelValue !== scope.otherModelValue;
                };

                scope.$watch('otherModelValue', function() {
                    ngModel.$validate();
                });
            }
        };
    }]);
}(angular.module('app')));
