(function (app) {
    'use strict';

    app.directive('isSignUpAllowed', ['userSvc', function (userSvc) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {

                function validate(viewValue) {
                    ctrl.$setValidity('isSignUpAllowed', true);
                    userSvc.isSignUpAllowed(
                        element.val(), attrs.isSignUpAllowed,
                        function (data) {
                            ctrl.$setValidity('isSignUpAllowed', data);
                        },
                        function () {
                            ctrl.$setValidity('isSignUpAllowed', false);
                        }
                    );
                    return viewValue;
                }

                ctrl.$parsers.push(validate);
                element.bind('blur', validate);
            }
        };
    }]);
}(angular.module('app')));
