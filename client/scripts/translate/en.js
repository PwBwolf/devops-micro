(function (app) {
    'use strict';

    app.config(['$translateProvider', function($translateProvider) {
        $translateProvider.translations('en', {
            OTHER_LANGUAGE: 'Español',
            SIGN_IN: 'Sign In',
            SIGN_UP: 'Sign Up'
        });

    }]);
}(angular.module('app')));


