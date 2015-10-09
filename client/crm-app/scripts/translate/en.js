(function (app) {
    'use strict';

    app.config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('en', {
            CHANGE_PASSWORD_HEADING: 'Change Your Password',
            CHANGE_PASSWORD_CURRENT_PASSWORD: 'Current password',
            CHANGE_PASSWORD_NEW_PASSWORD: 'New password',
            CHANGE_PASSWORD_CONFIRM_PASSWORD: 'Confirm new password',
            CHANGE_PASSWORD_BUTTON: 'Submit',
            CHANGE_PASSWORD_CURRENT_PASSWORD_REQUIRED: 'Enter your current password',
            CHANGE_PASSWORD_NEW_PASSWORD_REQUIRED: 'Enter new password',
            CHANGE_PASSWORD_NEW_PASSWORD_NOT_COMPLEX: 'Password needs to be at least 6 characters, contain 1 uppercase letter and 1 number',
            CHANGE_PASSWORD_NEW_PASSWORD_SAME: 'New Password cannot be the same as the current password',
            CHANGE_PASSWORD_CONFIRM_PASSWORD_REQUIRED: 'Confirm your password',
            CHANGE_PASSWORD_CONFIRM_PASSWORD_NO_MATCH: 'Passwords do not match',
            CHANGE_PASSWORD_ERROR: 'Error occurred while changing the password',
            CHANGE_PASSWORD_INCORRECT_PASSWORD: 'Current Password entered is incorrect',
            CHANGE_PASSWORD_SUCCESS: 'Your password has been changed successfully',
            INDEX_TOP: 'Top ^',
            INDEX_OTHER_LANGUAGE: 'Español',
            INDEX_SIGN_OUT: 'Sign Out',
            INDEX_OK_BUTTON: 'OK',
            INDEX_YES_BUTTON: 'Yes',
            INDEX_NO_BUTTON: 'No',
            INDEX_COPYRIGHT: 'Copyright ® 2012-2015 YipTV. User of the YipTV service and this web site constitutes acceptance of our terms of use and privacy policy.',
            MAIN_ERROR_APP_CONFIG: 'Error fetching application configuration',
            MAIN_SIGN_OUT_CONFIRMATION: 'Are you sure you want to sign out of YipTV?',
            MAIN_LANGUAGE_CHANGE_SAVE_CHECK: 'Do you want to change your preferred language to ',
            MAIN_LANGUAGE_CHANGE_SAVE_SUCCESS: 'Language preference saved successfully',
            MAIN_LANGUAGE_CHANGE_SAVE_ERROR: 'Unable to change your language preference. Please contact customer support at',
            NOT_FOUND_HEADING: 'Page Not Found',
            NOT_FOUND_MESSAGE: 'The page you are looking for does not exist.',
            SIGN_IN_HEADING: 'YipTV CRM',
            SIGN_IN_EMAIL: 'Email',
            SIGN_IN_EMAIL_REQUIRED: 'Enter your email address',
            SIGN_IN_EMAIL_INVALID: 'Enter a valid email address',
            SIGN_IN_PASSWORD: 'Password',
            SIGN_IN_PASSWORD_REQUIRED: 'Enter your password',
            SIGN_IN_SUBMIT_BUTTON: 'Sign In',
            SIGN_IN_FAILED: 'Sign In failed',
            USER_HOME_HEADING: 'Welcome to YipTV CRM',
            USER_HOME_MANAGE_CRM_USERS: 'Manage CRM Users',
            USER_HOME_MANAGE_SUBSCRIBERS: 'Manage Subscribers',
            USER_HOME_REPORTS: 'Reports'
        });
    }]);
}(angular.module('app')));
