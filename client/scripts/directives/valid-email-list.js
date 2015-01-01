(function (app) {
    'use strict';

    app.directive('validEmailList', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {

                ctrl.$parsers.unshift(function (emailList) {
                    var emails = emailList.split(',');
                    for (var i = 0; i < emails.length; i++) {
                        var isEmail = /^\w+([\+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emails[i].trim());
                        if (!isEmail) {
                            ctrl.$setValidity('validEmailList', false);
                            return emailList;
                        }
                    }
                    ctrl.$setValidity('validEmailList', true);
                    return emailList;
                });
            }
        };
    }]);
}(angular.module('app')));
