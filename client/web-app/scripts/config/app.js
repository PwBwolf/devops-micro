(function () {
    'use strict';

    angular.module('app', [
        'ngSanitize', 'ngRoute', 'ngAnimate', 'pageslide-directive',
        'pascalprecht.translate', 'webStorageModule', 'angularPayments', 'ui.bootstrap'
    ]);
    angular.module('app').value('_', window._);
    angular.module('app').value('toastr', window.toastr);
    // basically a way to use jquery in angular
    angular.module('app').constant('$', $);

    angular.module('app').run(function () {
        FastClick.attach(document.body);
    });

}());

// This segment contains the old app.js contents

// var app = angular.module('app', [
//     'ngSanitize', 'ngRoute', 'ngAnimate', 'pageslide-directive',
//     'pascalprecht.translate', 'webStorageModule', 'angularPayments', 'ui.bootstrap'
//     ]);

// app.config([], function(){
//     app.value('_', window._)
//     app.value('toastr', window.toastr)
//     app.constant('$', $)
    
//     app.run(function(){
//         FastClick.attach(document.body)
//     })
// })

