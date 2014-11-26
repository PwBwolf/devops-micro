(function (app) {
    'use strict';

    app.directive('isEmailUnique', ['userSvc', function (userSvc) {
        return {
            require: 'ngModel',
            restrict: 'A',

            link: function (scope, element, attrs, ctrl) {
                element.on('blur', function () {
                    if (element.val()) {
                        scope.$apply(function () {
                            userSvc.isUsernameUnique(
                                element.val(),
                                function (data) {
                                    ctrl.$setValidity('isEmailUnique', ('true' === data));
                                    return element.val();
                                },
                                function () {
                                    ctrl.$setValidity('isEmailUnique', false);
                                    return element.val();
                                });
                        });
                    }
                });
            }
        };
    }]);
}(angular.module('app')));
