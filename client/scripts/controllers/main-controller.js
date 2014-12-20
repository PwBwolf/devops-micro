(function (app) {
    'use strict';

    app.controller('mainCtrl', ['_', 'appSvc', 'userSvc', 'tokenSvc', 'loggerSvc', 'webStorage', '$scope', '$translate', '$location', '$route', '$window', '$filter', function (_, appSvc, userSvc, tokenSvc, loggerSvc, webStorage, $scope, $translate, $location, $route, $window, $filter) {

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
                loggerSvc.logError($filter('translate')('MAIN_ERROR_APP_CONFIG') || 'Error fetching application configuration');
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
            userSvc.getAioToken(function(response) {
                $window.open($scope.appConfig.aioUrl + '/app/login.php?username=' + response.username + '&sso_token=' + response.sso_token);
            }, function() {
                loggerSvc.logError($filter('translate')('MAIN_ERROR_AIO_SSO') || 'Unable to open video portal');
            });
        };
    }]);
}(angular.module('app')));
