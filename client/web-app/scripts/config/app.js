(function () {
    'use strict';

    angular.module('app', [
        'ngSanitize', 'ngRoute', 'ngAnimate', 'pageslide-directive',
        'pascalprecht.translate', 'webStorageModule', 'angularPayments', 'ui.bootstrap', 'ks.ngScrollRepeat',
        'angulartics', 'angulartics.google.analytics', 'angulartics.google.tagmanager', 'infinite-scroll'
    ]);
    //angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);
    angular.module('app').value('_', window._);
    angular.module('app').value('toastr', window.toastr);
    angular.module('app').constant('$', $);


    angular.module('app').run(function () {
        FastClick.attach(document.body);

    });

}());
