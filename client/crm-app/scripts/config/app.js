(function () {
    'use strict';

    angular.module('app', [
        'ngSanitize', 'ngRoute', 'ngAnimate',
        'pascalprecht.translate', 'webStorageModule', 'ui.bootstrap'
    ]);
    angular.module('app').value('_', window._);
    angular.module('app').value('toastr', window.toastr);
    angular.module('app').constant('$', $);

    angular.module('app').run(function () {
        FastClick.attach(document.body);
    });

}());
