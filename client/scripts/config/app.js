(function () {
    'use strict';

    angular.module('app', [
        'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ngAnimate'
    ]);
    angular.module('app').value('_', window._);
    angular.module('app').value('toastr', window.toastr);
}());
