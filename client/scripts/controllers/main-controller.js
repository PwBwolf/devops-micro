(function (app) {
    'use strict';

    app.controller('mainCtrl', ['_', 'appSvc', 'userSvc', 'tokenSvc', 'loggerSvc', 'webStorage', '$scope', '$translate', '$location', '$route', '$window', function (_, appSvc, userSvc, tokenSvc, loggerSvc, webStorage, $scope, $translate, $location, $route, $window) {

        $scope.user = userSvc.user;
        $scope.userRoles = userSvc.userRoles;
        $scope.accessLevels = userSvc.accessLevels;

        activate();

        function activate() {
            loadUserProfile();
            getAppConfig();
            loadLanguage();
            configSeo();
        }

        function getAppConfig() {
            appSvc.getAppConfig().success(function (response) {
                $scope.appConfig = response;
                $scope.showHeader = true;
            }).error(function () {
                loggerSvc.logError('Error fetching application config');
                $scope.showHeader = false;
            });
        }

        function loadUserProfile() {
            var routeList = ['/verify-user', '/reset-password'];
            if(_.contains(routeList, $location.path())) {
                tokenSvc.clearToken();
            } else {
                userSvc.getUserProfile(function () {
                    $route.reload();
                }, function () {
                    $route.reload();
                });
            }
        }

        function configSeo() {
            $scope.currentRoute = $location.path();
        }

        function loadLanguage() {
            var userLang = window.navigator.language || window.navigator.userLanguage;
            var language = $location.search().lang || webStorage.local.get('language') || userLang.split('-')[0] || 'en';
            $translate.use(language);
            webStorage.local.add('language', language);
            $scope.language = language;
        }

        $scope.changeLanguage = function () {
            var currentLanguage = $translate.use();
            var newLanguage = currentLanguage === 'en' ? 'es' : 'en';
            $translate.use(newLanguage);
            webStorage.local.add('language', newLanguage);
            $scope.language = newLanguage;
        };

        $scope.openAio = function() {
            $window.open($scope.appConfig.aioUrl);
        };
    }]);
}(angular.module('app')));
