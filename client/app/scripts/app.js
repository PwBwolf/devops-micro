'use strict';

angular.module('YipTV', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'pascalprecht.translate'
])
  // Translation configuration
  .config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: '/translation/',
      suffix: '.json'
    });
    //$translateProvider.useLocalStorage();
    $translateProvider.preferredLanguage(window.navigator.language);
    $translateProvider.fallbackLanguage('en-US');
    $translateProvider.use(window.navigator.language);
    //$translateProvider.rememberLanguage(true);
  })
  // Routing configuration
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: ''
      })
      .otherwise({
        redirectTo: '/'
      });
  });
