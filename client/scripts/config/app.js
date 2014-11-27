(function () {
    'use strict';

    angular.module('app', [
        'ngSanitize', 'ngRoute', 'ngAnimate',
        'pascalprecht.translate', 'webStorageModule'
    ]);
    angular.module('app').value('_', window._);
    angular.module('app').value('toastr', window.toastr);
}());
