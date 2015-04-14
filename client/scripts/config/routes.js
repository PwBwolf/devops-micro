(function (app) {
    'use strict';

    app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        var access = routing.accessLevels,
            title = 'YipTV - Watch Live Internet TV & Spanish Channels Online',
            description = 'Watch over 100+ USA & Spanish TV shows and channels in variety of genres such as news, sports, lifestyle, and entertainment. Try it free.';

        $routeProvider.when('/',
            {
                title: title,
                description: description,
                templateUrl: 'views/home.html',
                controller: 'homeCtrl',
                access: access.anon
            })
            .when('/sign-in',
            {
                title: 'Log into Your Account - YipTV',
                description: 'Access your account by signing in and enjoy live TV streaming with your loved ones.',
                templateUrl: 'views/sign-in.html',
                controller: 'signInCtrl',
                access: access.anon
            })
            .when('/sign-up/paid',
            {
                title: 'Register for Live Internet TV Streaming - YipTV',
                description: 'Sign up for YipTV live internet tv streaming and enjoy 100+ domestic and worldwide channels online.',
                templateUrl: 'views/sign-up.html',
                controller: 'signUpCtrl',
                access: access.anon
            })
            .when('/sign-up/free',
            {
                title: title,
                description: description,
                templateUrl: 'views/free-sign-up.html',
                controller: 'freeSignUpCtrl',
                access: access.anon
            })
            .when('/sign-up/complimentary/:compCode',
            {
                title: title,
                description: description,
                templateUrl: 'views/complimentary-sign-up.html',
                controller: 'complimentarySignUpCtrl',
                access: access.anon
            })
            .when('/sign-up-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/sign-up-success.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/sign-up-success-login',
            {
                title: title,
                description: description,
                templateUrl: 'views/sign-up-success-login.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/invite/:referralCode',
            {
                title: title,
                description: description,
                templateUrl: 'views/redirect.html',
                controller: 'inviteCtrl',
                access: access.anon
            })
            .when('/verify-user',
            {
                title: title,
                description: description,
                templateUrl: 'views/verify-user.html',
                controller: 'verifyUserCtrl',
                access: access.anon
            })
            .when('/forgot-password',
            {
                title: title,
                description: description,
                templateUrl: 'views/forgot-password.html',
                controller: 'forgotPasswordCtrl',
                access: access.anon
            })
            .when('/forgot-password-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/forgot-password-success.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/reset-password',
            {
                title: title,
                description: description,
                templateUrl: 'views/reset-password.html',
                controller: 'resetPasswordCtrl',
                access: access.anon
            })
            .when('/reset-password-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/reset-password-success.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/resend-verification',
            {
                title: title,
                description: description,
                templateUrl: 'views/resend-verification.html',
                controller: 'resendVerificationCtrl',
                access: access.anon
            })
            .when('/resend-verification-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/resend-verification-success.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/user-home',
            {
                title: title,
                description: description,
                templateUrl: 'views/user-home.html',
                controller: 'userHomeCtrl',
                access: access.user
            })
            .when('/player-4872',
            {
                title: title,
                description: description,
                templateUrl: 'views/player.html',
                controller: 'playerCtrl',
                access: access.public
            })
            .when('/account',
            {
                title: title,
                description: description,
                templateUrl: 'views/account.html',
                controller: 'accountCtrl',
                access: access.user
            })
            .when('/preferences',
            {
                title: title,
                description: description,
                templateUrl: 'views/preferences.html',
                controller: 'preferencesCtrl',
                access: access.user
            })
            .when('/preferences-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/preferences-success.html',
                controller: 'commonCtrl',
                access: access.user
            })
            .when('/reactivate-subscription',
            {
                title: title,
                description: description,
                templateUrl: 'views/reactivate-subscription.html',
                controller: 'reactivateSubscriptionCtrl',
                access: access.user
            })
            .when('/reactivate-subscription-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/reactivate-subscription-success.html',
                controller: 'commonCtrl',
                access: access.user
            })

            .when('/cancel-subscription-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/cancel-subscription-success.html',
                controller: 'commonCtrl',
                access: access.user
            })
            .when('/upgrade-subscription',
            {
                title: title,
                description: description,
                templateUrl: 'views/upgrade-subscription.html',
                controller: 'upgradeSubscriptionCtrl',
                access: access.user
            })
            .when('/upgrade-subscription-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/upgrade-subscription-success.html',
                controller: 'commonCtrl',
                access: access.user
            })
            .when('/change-credit-card',
            {
                title: title,
                description: description,
                templateUrl: 'views/change-credit-card.html',
                controller: 'changeCreditCardCtrl',
                access: access.user
            })
            .when('/change-credit-card-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/change-credit-card-success.html',
                controller: 'commonCtrl',
                access: access.user
            })
            .when('/change-password',
            {
                title: title,
                description: description,
                templateUrl: 'views/change-password.html',
                controller: 'changePasswordCtrl',
                access: access.user
            })
            .when('/refer-a-friend',
            {
                title: 'Refer Friends and Get One Month Free Subscription - YipTV',
                description: 'Get one month free subscription of YipTV by referring your friend. Enjoy live internet TV streaming for free.',
                templateUrl: 'views/refer-a-friend.html',
                controller: 'referAFriendCtrl',
                access: access.public
            })
            .when('/refer-a-friend-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/refer-a-friend-success.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/change-password-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/change-password-success.html',
                controller: 'commonCtrl',
                access: access.user
            })
            .when('/about-us',
            {
                title: 'YipTV - Online TV Streaming Services',
                description: 'YipTV, Inc, is a privately held US-based online TV streaming services that provides low cost live internet TV. Enjoy with 100+ channels in multiple languages.',
                templateUrl: 'views/about-us.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/leadership',
            {
                title: 'YipTV Management and Board of Directors Team',
                description: 'YipTV has an experienced and highly qualified management team who are aware about customer needs and demands. Explore detailed information about our leadership.',
                templateUrl: 'views/leadership.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/media',
            {
                title: 'YipTV in Press Release and News',
                description: 'Explore YipTV news in press release and media. Read all news from a single place.',
                templateUrl: 'views/media.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/press-release-1',
            {
                title: title,
                description: description,
                templateUrl: 'views/press-release-1.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/faq',
            {
                title: 'Frequently Asked Questions - YipTV',
                description: 'Get instant reply of your questions with YipTV FAQ section. Email or call us for further questions.',
                templateUrl: 'views/faq.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/contact-us',
            {
                title: 'YipTV Contact Information',
                description: 'Do you have any questions? Contact us by submitting inquiry form. You can also call or email us.',
                templateUrl: 'views/contact-us.html',
                controller: 'contactUsCtrl',
                access: access.public
            })
            .when('/contact-us-success',
            {
                title: title,
                description: description,
                templateUrl: 'views/contact-us-success.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/privacy-policy',
            {
                title: 'Privacy Policy - YipTV',
                description: 'Explore privacy policy of YipTV, USA based internet TV streaming services.',
                templateUrl: 'views/privacy-policy.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/terms-of-use',
            {
                title: 'Terms of Use & Services - YipTV',
                description: 'Explore terms of use and services of YipTV, an online internet TV streaming service.',
                templateUrl: 'views/terms-of-use.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/customer-support',
            {
                title: title,
                description: description,
                templateUrl: 'views/customer-support.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/admin',
            {
                title: title,
                description: description,
                templateUrl: 'views/admin.html',
                controller: 'commonCtrl',
                access: access.admin
            })
            .when('/admin/all-users',
            {
                title: title,
                description: description,
                templateUrl: 'views/all-users.html',
                controller: 'allUsersCtrl',
                access: access.admin
            })
            .when('/admin/user-details',
            {
                title: title,
                description: description,
                templateUrl: 'views/user-details.html',
                controller: 'userDetailsCtrl',
                access: access.admin
            })
            .when('/admin/change-password',
            {
                title: title,
                description: description,
                templateUrl: 'views/admin-change-password.html',
                controller: 'adminChangePasswordCtrl',
                access: access.admin
            })
            .when('/error',
            {
                title: title,
                description: description,
                templateUrl: 'views/error.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/under-construction',
            {
                title: title,
                description: description,
                templateUrl: 'views/under-construction.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/not-found',
            {
                title: title,
                description: description,
                templateUrl: 'views/not-found.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .otherwise(
            {
                redirectTo: '/not-found'
            });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(['$q', '$location', '$injector', function ($q, $location, $injector) {
            return {
                'responseError': function (response) {
                    if (response.config.url.toLowerCase().indexOf('/api') < 0 && (response.status === 401 || response.status === 403)) {
                        var userSvc = $injector.get('userSvc');
                        userSvc.clearUser();
                        $location.path('/sign-in');
                        $location.url($location.path());
                        return $q.reject(response);
                    } else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    }]);

    app.run(['_', '$rootScope', '$route', '$location', '$http', 'userSvc', 'tokenSvc', function (_, $rootScope, $route, $location, $http, userSvc, tokenSvc) {
        $rootScope.$on('$routeChangeSuccess', function (newVal, oldVal) {
            if (oldVal !== newVal) {
                document.title = $route.current.title;
                $rootScope.meta = {description: $route.current.description};
            }
        });

        $rootScope.$on('$routeChangeStart', function (event, next) {

            if (!$rootScope.profileCallCompleted) {
                var routeList = ['/verify-user', '/reset-password', '/invite'];
                if (_.contains(routeList, $location.path())) {
                    tokenSvc.clearToken();
                    $rootScope.profileCallCompleted = true;
                } else {
                    userSvc.getUserProfile(function () {
                        $rootScope.profileCallCompleted = true;
                        authRedirect();
                    }, function () {
                        $rootScope.profileCallCompleted = true;
                        authRedirect();
                    });
                }
            } else {
                authRedirect();
            }

            function authRedirect() {
                if (next.access && !userSvc.authorize(next.access)) {
                    if (userSvc.isSignedIn()) {
                        $location.path('/user-home');
                        $location.url($location.path());
                    } else {
                        $rootScope.redirectTo = $location.url();
                        $location.path('/sign-in');
                        $location.url($location.path());
                    }
                }
            }
        });
    }]);
}(angular.module('app')));
