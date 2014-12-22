(function (app) {
    'use strict';

    app.directive('sameAs', [function () {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: '=sameAs'
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.sameAs = function(modelValue) {
                    return modelValue === scope.otherModelValue;
                };

                scope.$watch('otherModelValue', function() {
                    ngModel.$validate();
                });
            }
        };
    }]);
}(angular.module('app')));
