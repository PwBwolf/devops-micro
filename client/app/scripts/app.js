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
    var language = window.navigator.language.toLowerCase();
    //$translateProvider.useLocalStorage();
    $translateProvider.preferredLanguage(language);
    $translateProvider.fallbackLanguage('en-us');
    $translateProvider.use(language);
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
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsController'
      })
      .when('/payments', {
        templateUrl: 'views/payments.html',
        controller: 'SettingsController'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'SubscriptionListController'
      })
      .when('/view/{:channelId}', {
        templateUrl: 'views/channel.html',
        controller: 'ChannelController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
