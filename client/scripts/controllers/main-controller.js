(function (app) {
    'use strict';

    app.controller('mainCtrl', ['appSvc', 'loggerSvc', 'webStorage', '$scope', '$translate', '$location', function (appSvc, loggerSvc, webStorage, $scope, $translate, $location) {
        activate();

        function activate() {
            appSvc.getAppConfig().success(function (response) {
                $scope.appConfig = response;
            }).error(function () {
                loggerSvc.logError('Error fetching application config');
            });
            loadLanguage();
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

