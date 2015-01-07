'use strict';

describe('Controller: referAFriendCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        appService,
        httpBackend,
        location,
        loggerService;

    function mockReferAFriendForm() {
        scope.form = {
            $valid: false,
            email: {
                $dirty: false
            },
            emailList: {
                $dirty: false
            }
        };
    }

    function mockModelView() {
        scope.mv = {
            email: 'varunv@yiptv.com',
            emailList: 'achinth@yiptv.com, vivek@yiptv.com'
        };
    }

    beforeEach(module(function ($provide, $filterProvider) {
        //translate filter mock
        function translateFilterMock(value) {
            switch (value) {
                case 'RAF_EMAIL_SEND_ERROR':
                    return 'Unable to send YipTV invites to your friends';
                default:
                    return '';
            }
        }

        $provide.value('translate', translateFilterMock);

        $filterProvider.register('translate', function (translate) {
            return function (text) {
                return translate(text);
            };
        });

    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, appSvc, $httpBackend, $location, loggerSvc) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        appService = appSvc;
        loggerService = loggerSvc;
        location = $location;
        scope.user = {
            email: 'varun@yiptv.com'
        };
        controller('referAFriendCtrl', {
            $scope: scope,
            appSvc: appService,
            loggerSvc: loggerService
        });
    }));

    describe('sendRafEmails', function () {

        it('should set the form dirty if the form is invalid', function () {
            mockReferAFriendForm();
            scope.sendRafEmails();
            expect(scope.form.email.$dirty).toBe(true);
            expect(scope.form.emailList.$dirty).toBe(true);
        });

        it('should redirect to success page on successful submission of form', function () {
            mockReferAFriendForm();
            mockModelView();
            scope.form.$valid = true;
            scope.sendRafEmails();
            expect(scope.saving).toBe(true);
            httpBackend.when('POST', '/api/send-raf-emails').respond(200);
            httpBackend.flush();
            expect(scope.saving).toBe(false);
            expect(location.path()).toBe('/refer-a-friend-success');
        });

        it('should show appropriate error message on form submit error', function () {
            spyOn(loggerService, 'logError');
            mockReferAFriendForm();
            mockModelView();
            scope.form.$valid = true;
            scope.sendRafEmails();
            expect(scope.saving).toBe(true);
            httpBackend.when('POST', '/api/send-raf-emails').respond(500);
            httpBackend.flush();
            expect(loggerService.logError).toHaveBeenCalledWith('Unable to send YipTV invites to your friends');
            expect(scope.saving).toBe(false);
            expect(location.path()).toBe('/');
        });

    });

    describe('onUserChanged', function () {
        it('should show appropriate error message on form submit error', function () {
            scope.user.email = 'achinth@yiptv.com';
            scope.$broadcast('UserChanged');
            expect(scope.mv.email).toEqual('achinth@yiptv.com');
        });
    });

});
