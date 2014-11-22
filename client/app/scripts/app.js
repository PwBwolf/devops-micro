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
      .when('/signup', {
        templateUrl: 'views/sign_up.html',
        controller: 'SessionController'
      })
      .when('/signin', {
        templateUrl: 'views/sign_in.html',
        controller: 'SessionController'
      })
      .when('/forgot-password', {
        templateUrl: 'views/forgot_password.html',
        controller: 'SessionController'
      })
      .when('/reset-password', {
        templateUrl: 'views/reset_password.html',
        controller: 'SessionController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
