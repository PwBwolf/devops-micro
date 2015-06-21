(function (app) {
    'use strict';

    app.config(['$translateProvider', function($translateProvider) {
        $translateProvider.preferredLanguage('en');
        $translateProvider.fallbackLanguage('en');

    }]);
}(angular.module('app')));
