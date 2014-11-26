(function (app) {
    'use strict';

    app.config(['$translateProvider', function($translateProvider) {
        $translateProvider.translations('en', {
            INDEX_OTHER_LANGUAGE: 'Español',
            INDEX_SIGN_IN: 'Sign In',
            INDEX_SIGN_UP: 'Sign Up',
            INDEX_MY_ACCOUNT: 'My Account',
            INDEX_OUR_COMPANY: 'Our Company',
            INDEX_ABOUT_US: 'About Us',
            INDEX_LEADERSHIP: 'Leadership',
            INDEX_SUPPORT: 'Support',
            INDEX_TERMS_OF_USE: 'Terms of Use',
            INDEX_PRIVACY_POLICY: 'Privacy Policy',
            INDEX_CONTACT_US: 'Contact Us',
            INDEX_CONNECT_WITH_US: 'Connect With Us',
            INDEX_DISCLAIMER: 'Use of the YipTV service and this Web site constitutes acceptance of our ',
            HOME_UNLIMITED_CHANNELS: 'Unlimited Channels',
            HOME_MONTH: 'month',
            HOME_WATCH_LIVE: 'Watch live news, sports & events from around the world',
            HOME_WATCH_ANY_DEVICE: 'Watch on your TV, Tablet, Phone PC, Game System and more.',
            HOME_NO_CONTRACTS: 'No Contracts, Cancel Any Time',
            HOME_WATCH_ANY_SCREEN: 'Watch on any screen, anywhere, any time.',
            HOME_NO_CABLE_BOX: 'No cable box needed. No bulky dish on the roof. Yip TV plays your channels through your broadband Internet connection.',
            HOME_JOIN_REVOLUTION: '>> Join the revolution',
            HOME_TESTIMONIALS: 'Testimonials',
            HOME_TESTIMONIAL_1: '1 Lorem ipsum dolor sit amet, te nusquam epicurei intellegebat vix. Qui id probo conceptam consetetur. Tale delicata no pro. Cum an habemus definitiones, utinam scripta quaeque cu pri, diam graecis corpora an sit. Dissentiunt accommodare instructior ea usu.',
            HOME_TESTIMONIAL_2: '2 Lorem ipsum dolor sit amet, te nusquam epicurei intellegebat vix. Qui id probo conceptam consetetur. Tale delicata no pro. Cum an habemus definitiones, utinam scripta quaeque cu pri, diam graecis corpora an sit. Dissentiunt accommodare instructior ea usu.',
            HOME_TESTIMONIAL_3: '3 Lorem ipsum dolor sit amet, te nusquam epicurei intellegebat vix. Qui id probo conceptam consetetur. Tale delicata no pro. Cum an habemus definitiones, utinam scripta quaeque cu pri, diam graecis corpora an sit. Dissentiunt accommodare instructior ea usu.',
            SIGN_IN_HEADING: 'Sign In',
            SIGN_IN_EMAIL: 'Email',
            SIGN_IN_EMAIL_REQUIRED: 'Enter your email',
            SIGN_IN_EMAIL_INVALID: 'Enter a valid email',
            SIGN_IN_PASSWORD: 'Password',
            SIGN_IN_PASSWORD_REQUIRED: 'Enter your password',
            SIGN_IN_SUBMIT_BUTTON: 'Sign In',
            SIGN_IN_FORGOT_PASSWORD: 'Forgot Password?',
            SIGN_IN_NOT_REGISTERED: 'Not Registered Yet?',
            SIGN_IN_SIGN_UP: 'Sign Up',
            TERMS_OF_USE_HEADING: 'Terms of Use',
            PRIVACY_POLICY_HEADING: 'Privacy Policy',
            LEADERSHIP_HEADING: 'Leadership',
            ABOUT_US_HEADING: 'About Us',
            CONTACT_US_HEADING: 'Contact Us'

        });
    }]);
}(angular.module('app')));
