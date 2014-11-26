(function (app) {
    'use strict';

    app.controller('mainCtrl', ['appSvc', 'userSvc', 'loggerSvc', 'webStorage', '$scope', '$translate', '$location', '$route', function (appSvc, userSvc, loggerSvc, webStorage, $scope, $translate, $location, $route) {

        $scope.user = userSvc.user;
        $scope.userRoles = userSvc.userRoles;
        $scope.accessLevels = userSvc.accessLevels;

        activate();

        function activate() {
            getAppConfig();
            loadUserProfile();
            loadLanguage();
        }

        function getAppConfig() {
            appSvc.getAppConfig().success(function (response) {
                $scope.appConfig = response;
            }).error(function () {
                loggerSvc.logError('Error fetching application config');
            });
        }

        function loadUserProfile() {
            userSvc.getUserProfile(function () {
                $route.reload();
            }, function () {
                $route.reload();
            });
        }

        function loadLanguage() {
            $scope.currentRoute = $location.path();
            var language = $location.search().lang || webStorage.local.get('language');
            if (language) {
                $translate.use(language);
            }
        }

        $scope.changeLanguage = function() {
            var currentLanguage = $translate.use();
            var newLanguage = currentLanguage === 'en' ? 'es' : 'en';
            $translate.use(newLanguage);
            webStorage.local.add('language', newLanguage);
        };
    }]);
}(angular.module('app')));
