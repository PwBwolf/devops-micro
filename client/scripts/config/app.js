(function () {
    'use strict';

    angular.module('app', [
        'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ngAnimate'
    ]);
    angular.module('app').value('_', window._);
}());
