(function (app) {
    'use strict';

    app.config(['$translateProvider', function($translateProvider) {
        var language = window.navigator.language.split('-')[0] || 'en';
        $translateProvider.preferredLanguage(language);
        $translateProvider.fallbackLanguage('en');

    }]);
}(angular.module('app')));


