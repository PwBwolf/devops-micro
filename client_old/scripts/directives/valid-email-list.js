(function (app) {
    'use strict';

    app.directive('validEmailList', [function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {

                function validate(emailList) {
                    if(emailList) {
                        var emails = emailList.split(',');
                        for (var i = 0; i < emails.length; i++) {
                            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
                            var isEmail = regex.test(emails[i].trim());
                            if (!isEmail) {
                                ctrl.$setValidity('validEmailList', false);
                                return emailList;
                            }
                        }
                        ctrl.$setValidity('validEmailList', true);
                    } else {
                        ctrl.$setValidity('validEmailList', true);
                    }
                    return emailList;
                }

                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.unshift(validate);
            }
        };
    }]);
}(angular.module('app')));
