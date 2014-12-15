(function (app) {
    'use strict';

    app.directive('isEmailUnique', ['userSvc', function (userSvc) {
        return {
            require: 'ngModel',
            restrict: 'A',

            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.push(checkEmailUnique);
                element.bind('blur', checkEmailUnique);

                function checkEmailUnique(viewValue) {
                    ctrl.$setValidity('isEmailUnique', true);
                    if (ctrl.$valid) {
                        userSvc.isEmailUnique(
                            element.val(), scope.$eval(attrs.firstName), scope.$eval(attrs.lastName),
                            function (data) {
                                ctrl.$setValidity('isEmailUnique', data);
                            },
                            function () {
                                ctrl.$setValidity('isEmailUnique', false);
                            }
                        );
                    }
                    return viewValue;
                }
            }
        };


    }]);
}(angular.module('app')));
