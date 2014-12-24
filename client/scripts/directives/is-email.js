(function (app) {
    'use strict';

    app.directive('isEmail', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (email) {
                    var isEmail = /[\w-]+@([\w-]+\.)+[\w-]+/.test(email);
                    ctrl.$setValidity('isEmail', isEmail);
                    return email;
                });
            }
        };
    }]);
}(angular.module('app')));
