(function (app) {
    'use strict';

    app.directive('isEmailUnique', ['userSvc', function (userSvc) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {

                function validate(viewValue) {
                    ctrl.$setValidity('isEmailUnique', true);
                    userSvc.isEmailUnique(
                        element.val(),
                        function (data) {
                            ctrl.$setValidity('isEmailUnique', data);
                        },
                        function () {
                            ctrl.$setValidity('isEmailUnique', false);
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
