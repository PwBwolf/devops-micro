(function (app) {
    'use strict';

    app.config(['$translateProvider', function($translateProvider) {
        $translateProvider.translations('es', {
            OTHER_LANGUAGE: 'English',
            SIGN_IN: 'Registrarse',
            SIGN_UP: 'Registro'
        });

    }]);
}(angular.module('app')));


