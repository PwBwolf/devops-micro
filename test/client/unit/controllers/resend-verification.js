'use strict';

describe('Controller: resendVerificationCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        httpBackend,
        location,
        loggerService;

    beforeEach(module(function($provide, $filterProvider) {
        //translate filter mock
        function mockTranslateFilter(value) {
            switch (value) {
                case 'RESEND_VERIFICATION_USER_ERROR':
                    return 'Account not found or account already activated';
                case 'RESEND_VERIFICATION_ERROR':
                    return 'Error sending account verification link';
                default:
                    return '';
            }
        }

        $provide.value('translate', mockTranslateFilter);

        $filterProvider.register('translate', function(translate){
            return function(text) {
                return translate(text);
            };
        });

    }));

    function mockResetVerificationForm () {
        scope.form = {
            $valid: false,
            email: {
                $dirty: false
            }
        };
    }

    function mockModelView() {
        scope.mv = {
            email: 'varunv@yiptv.com'
        };
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, userSvc, $httpBackend, $location, loggerSvc) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        loggerService = loggerSvc;
        location = $location;
        controller('resendVerificationCtrl', {
            $scope: scope,
            userSvc: userSvc,
            loggerSvc: loggerSvc
        });
    }));

});