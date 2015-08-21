(function (app) {
    'use strict';

    app.directive('accessLevel', ['userSvc', function (userSvc) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var previousDisplay = element.css('display'),
                    userRole,
                    accessLevel;

                $scope.user = userSvc.user;

                $scope.$watch('user', function (user) {
                    if (user.role) {
                        userRole = user.role;
                    }
                    updateCss();
                }, true);

                $scope.$watch('profileCallCompleted', function () {
                    updateCss();
                }, true);

                attrs.$observe('accessLevel', function (al) {
                    if (al) {
                        accessLevel = $scope.$eval(al);
                    }
                    updateCss();
                });

                function updateCss() {
                    if (userRole && accessLevel && $scope.profileCallCompleted) {
                        if (!userSvc.authorize(accessLevel, userRole)) {
                            element.css('display', 'none');
                        } else {
                            element.css('display', previousDisplay);
                        }
                    } else {
                        element.css('display', 'none');
                    }
                }
            }
        };
    }]);
}(angular.module('app')));
