(function (app) {
    'use strict';

    app.controller('mainCtrl', ['appSvc', 'loggerSvc', '$scope', '$translate', 'webStorage', function (appSvc, loggerSvc, $scope, $translate, webStorage) {
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
            var language = webStorage.local.get('language');
            if (language) {
                $translate.use(language);
            }
        }

        $scope.changeLanguage = function() {
            var currentLanguage = $translate.use();
            var newLanguage = currentLanguage == 'en' ? 'es' : 'en';
            $translate.use(newLanguage);
            webStorage.local.add('language', newLanguage);
        };
    }]);
}(angular.module('app')));

