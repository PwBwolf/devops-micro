(function (app) {
    'use strict';

    app.config(['$translateProvider', function($translateProvider) {
        $translateProvider.preferredLanguage('en');
        $translateProvider.fallbackLanguage('en');
        // using escape instead of 'sanitize' because it will double encode UTF-8 and special characters
        // they will fix this in later release, so check again if you're upgrading angular-translate module.
        $translateProvider.useSanitizeValueStrategy('sanitizeParameters')
    }]);
}(angular.module('app')));
