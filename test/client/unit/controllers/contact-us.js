'use strict';

describe('Controller: contactUsCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        appService,
        httpBackend,
        location,
        loggerService;

    function initController() {
        controller('contactUsCtrl', {
            $scope: scope,
            appSvc: appService,
            loggerSvc: loggerService
        });
    }

    function initForm () {
        scope.form = {
            $valid: false,
            name: {
                $dirty: false
            },
            interest: {
                $dirty: false
            },
            email: {
                $dirty: false
            },
            telephone: {
                $dirty: false
            },
            details: {
                $dirty: false
            }
        };
        scope.mv = {
            name: 'Varun',
            interest: 'Submit a question',
            email: 'varunv@yiptv.com',
            telephone: '',
            details: 'I want to know about different subscriptions'
        };
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, appSvc, $httpBackend, $location, loggerSvc) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        appService = appSvc;
        loggerService = loggerSvc;
        location = $location;
        initController();
    }));

    it('should attach a list of the countries', function () {
        var countries = ['USA', 'Spain', 'Mexico', 'Canada', 'UK'];
        for(var i=0; i<5; i++) {
            httpBackend.when("GET", "/api/get-countries").respond(200, countries);
            initController();
            httpBackend.flush();
            expect(scope.countries.length).toBe(countries.length);
            expect(scope.mv.country).toBe('United States');
            countries.splice(0, 1);
        }
    });

    it('should log proper error message on error fetching the countries', function () {
        var errorResponses = [404, 401, 501];
        spyOn(loggerService,'logError');
        for(var i=0; i<3; i++) {
            httpBackend.when("GET", "/api/get-countries").respond(errorResponses[i], []);
            initController();
            httpBackend.flush();
            expect(scope.countries).toBe(undefined);
            expect(scope.mv).toBe(undefined);
            expect(loggerService.logError).toHaveBeenCalledWith('Error loading country list');
        }
    });

    it('should set the form dirty', function () {
        httpBackend.expect("GET", "/api/get-countries").respond(200, []);
        httpBackend.flush();
        initForm();
        scope.saveContactUs();
        expect(scope.form.name.$dirty).toBe(true);
        expect(scope.form.interest.$dirty).toBe(true);
        expect(scope.form.email.$dirty).toBe(true);
        expect(scope.form.telephone.$dirty).toBe(true);
        expect(scope.form.details.$dirty).toBe(true);
    });

    it('should send the contact us form data to server', function () {
        httpBackend.expect("GET", "/api/get-countries").respond(200, []);
        httpBackend.flush();
        initForm();
        scope.form.$valid = true;
        httpBackend.when("POST", '/api/save-contact-us').respond(200, []);
        scope.saveContactUs();
        httpBackend.flush();
        expect(scope.saving).toBe(false);
        expect(location.path()).toBe('/contact-us-success');
    });

    it('should log proper error message on save contact us form post error', function () {
        httpBackend.expect("GET", "/api/get-countries").respond(200, []);
        httpBackend.flush();
        initForm();
        scope.form.$valid = true;
        var errorResponses = [404, 401, 501];
        spyOn(loggerService,'logError');
        for(var i=0; i<3; i++) {
            httpBackend.when("POST", '/api/save-contact-us').respond(errorResponses[i], []);
            scope.saveContactUs();
            httpBackend.flush();
            expect(scope.saving).toBe(false);
            expect(location.path()).toBe('/');
            expect(loggerService.logError).toHaveBeenCalledWith('Error submitting your request');
        }
    });

});