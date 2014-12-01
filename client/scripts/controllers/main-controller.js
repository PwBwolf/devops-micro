(function (app) {
    'use strict';

    app.controller('mainCtrl', ['_', 'appSvc', 'userSvc', 'tokenSvc', 'loggerSvc', 'webStorage', '$scope', '$translate', '$location', '$route', function (_, appSvc, userSvc, tokenSvc, loggerSvc, webStorage, $scope, $translate, $location, $route) {

        $scope.user = userSvc.user;
        $scope.userRoles = userSvc.userRoles;
        $scope.accessLevels = userSvc.accessLevels;

        activate();

        function activate() {
            getAppConfig();
            loadUserProfile();
            loadLanguage();
            configSeo();
        }

        function getAppConfig() {
            var routeList = ['/verify-user', '/reset-password'];
            if(_.contains(routeList, $location.path())) {
                tokenSvc.clearToken();
            }
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

        function configSeo() {
            $scope.currentRoute = $location.path();
        }

        function loadLanguage() {
            var language = $location.search().lang || webStorage.local.get('language') || 'en';
            $translate.use(language);
            $scope.language = language;
        }

        $scope.changeLanguage = function () {
            var currentLanguage = $translate.use();
            var newLanguage = currentLanguage === 'en' ? 'es' : 'en';
            $translate.use(newLanguage);
            webStorage.local.add('language', newLanguage);
            $scope.language = newLanguage;
        };
    }]);
}(angular.module('app')));
