(function (app) {
    'use strict';

    app.directive('saveVisitor', ['appSvc', function (appSvc) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                element.bind('blur', saveVisitor);

                function saveVisitor(viewValue) {
                    if (ctrl.$valid) {
                        appSvc.saveVisitor({email: element.val(), firstName: scope.$eval(attrs.firstName), lastName: scope.$eval(attrs.lastName)});
                    }
                    return viewValue;
                }
            }
        };
    }]);
}(angular.module('app')));
