'use strict';

angular.module('YipTV')
  .controller('SessionController', function ($scope, $location, Page, Session) {
    switch ($location.path()) {
      case '/signup':
        Page.title = "Sign Up"; // TODO Localise this
        break;
      case '/signin':
        Page.title = "Sign In"; // TODO Localise this
        break;
      case '/forgot-password':
        Page.title = "Forgot Password";  // TODO Localise this
        break;
      case '/reset-password':
        Page.title = 'Reset Password';  // TODO Localise this
        break;
    }
  });
