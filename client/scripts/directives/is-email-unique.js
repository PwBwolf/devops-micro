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
            }
        };


    }]);
}(angular.module('app')));
