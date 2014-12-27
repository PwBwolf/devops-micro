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

    beforeEach(module(function ($provide, $filterProvider) {
        //translate filter mock
        function mockTranslateFilter(value) {
            switch (value) {
                case 'CONTACT_US_ERROR':
                    return 'Error submitting your request';
                    break;
                case 'CONTACT_US_COUNTRY_LOAD_ERROR':
                    return 'Error loading country list';
                    break;
                default:
                    return '';
            }
        }

        $provide.value('translate', mockTranslateFilter);

        $filterProvider.register('translate', function (translate) {
            return function (text) {
                return translate(text);
            };
        });

    }));

    function initController() {
        controller('contactUsCtrl', {
            $scope: scope,
            appSvc: appService,
            loggerSvc: loggerService
        });
    }

    function mockContactUsForm() {
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
    }

    function mockModelView() {
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

    it('should attach a list of the 5 countries', function () {
        var countries = ['USA', 'Spain', 'Mexico', 'Canada', 'UK'];
        httpBackend.when("GET", "/api/get-countries").respond(200, countries);
        initController();
        httpBackend.flush();
        expect(scope.countries.length).toBe(countries.length);
        expect(scope.mv.country).toBe('United States');
    });

    it('should attach a list of the 3 countries', function () {
        var countries = ['USA', 'Spain', 'Mexico'];
        httpBackend.when("GET", "/api/get-countries").respond(200, countries);
        initController();
        httpBackend.flush();
        expect(scope.countries.length).toBe(countries.length);
        expect(scope.mv.country).toBe('United States');
    });

    it('should attach a list of the 2 countries', function () {
        var countries = ['USA', 'Spain'];
        httpBackend.when("GET", "/api/get-countries").respond(200, countries);
        initController();
        httpBackend.flush();
        expect(scope.countries.length).toBe(countries.length);
        expect(scope.mv.country).toBe('United States');
    });


    it('should log appropriate error message on error fetching the countries', function () {
        spyOn(loggerService, 'logError');
        httpBackend.when("GET", "/api/get-countries").respond(500, []);
        initController();
        httpBackend.flush();
        expect(scope.countries).toBe(undefined);
        expect(scope.mv).toBe(undefined);
        expect(loggerService.logError).toHaveBeenCalledWith('Error loading country list');
    });

    it('should set the form dirty', function () {
        httpBackend.expect("GET", "/api/get-countries").respond(200, []);
        httpBackend.flush();
        mockContactUsForm();
        mockModelView();
        scope.saveContactUs();
        expect(scope.form.name.$dirty).toBe(true);
        expect(scope.form.interest.$dirty).toBe(true);
        expect(scope.form.email.$dirty).toBe(true);
        expect(scope.form.telephone.$dirty).toBe(true);
        expect(scope.form.details.$dirty).toBe(true);
    });

    it('should redirect to contact us success page on contact us form post success', function () {
        httpBackend.expect("GET", "/api/get-countries").respond(200, []);
        httpBackend.flush();
        mockContactUsForm();
        mockModelView();
        scope.form.$valid = true;
        httpBackend.when("POST", '/api/save-contact-us').respond(200, []);
        scope.saveContactUs();
        httpBackend.flush();
        expect(scope.saving).toBe(false);
        expect(location.path()).toBe('/contact-us-success');
    });

    it('should log appropriate error message on save contact us form post error', function () {
        httpBackend.expect("GET", "/api/get-countries").respond(200, []);
        httpBackend.flush();
        mockContactUsForm();
        mockModelView();
        scope.form.$valid = true;
        spyOn(loggerService, 'logError');
        httpBackend.when("POST", '/api/save-contact-us').respond(500, []);
        scope.saveContactUs();
        httpBackend.flush();
        expect(scope.saving).toBe(false);
        expect(location.path()).toBe('/');
        expect(loggerService.logError).toHaveBeenCalledWith('Error submitting your request');
    });

});