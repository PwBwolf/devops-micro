(function (app) {
    'use strict';

    app.controller('mainCtrl', ['_', 'appSvc', 'userSvc', 'tokenSvc', 'loggerSvc', 'webStorage', '$rootScope', '$scope', '$translate', '$location', '$route', '$window', '$filter', function (_, appSvc, userSvc, tokenSvc, loggerSvc, webStorage, $rootScope, $scope, $translate, $location, $route, $window, $filter) {

        $scope.user = userSvc.user;
        $scope.userRoles = userSvc.userRoles;
        $scope.accessLevels = userSvc.accessLevels;

        activate();

        function activate() {
            getAppConfig();
            loadLanguage();
            configSeo();
        }

        function getAppConfig() {
            appSvc.getAppConfig().success(function (response) {
                $scope.appConfig = response;
                $scope.showHeader = true;
            }).error(function () {
                loggerSvc.logError($filter('translate')('MAIN_ERROR_APP_CONFIG'));
                $scope.showHeader = false;
            });
        }

        function configSeo() {
            $scope.currentRoute = $location.path();
        }

        function loadLanguage() {
            var userLang = $window.navigator.language || $window.navigator.userLanguage;
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

        $scope.openAio = function () {
            var aio = $window.open('', '_blank');
            userSvc.getAioToken(function (response) {
                aio.location.href = $scope.appConfig.aioUrl + '/app/login.php?username=' + response.username + '&sso_token=' + response.sso_token;
            }, function () {
                loggerSvc.logError($filter('translate')('MAIN_ERROR_AIO_SSO'));
            });
        };
    }]);
}(angular.module('app')));
