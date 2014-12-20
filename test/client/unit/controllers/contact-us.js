'use strict';

describe('Controller: contactUsCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var controller,
        scope,
        q,
        appService,
        loggerService,
        httpBackend,
        location,
        loggerSvc;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, appSvc, $httpBackend, $location) {
        scope = $rootScope.$new();
        controller = $controller;
        loggerService = {
            logError: function (message) {

            }
        };
        httpBackend = $httpBackend;
        appService = appSvc;
        location = $location;
    }));

    function setupController() {
        controller('contactUsCtrl', {
            $scope: scope,
            appSvc: appService
        });
    }

    it('should attach a list of the countries', function () {
        httpBackend.when("GET","/api/get-countries").respond(200,['USA', 'SPAIN']);
        setupController();
        httpBackend.flush();
        expect(scope.countries.length).toBe(2);
        expect(scope.mv.country).toBe('United States');
    });

    it('should send the form', function () {

        it('should set the form dirty', function () {
            setupController();
            scope.form.$valid = false;
            scope.saveContactUs();
            expect(scope.form.name.$dirty).toBe(true);
            expect(scope.form.interest.$dirty).toBe(true);
            expect(scope.form.email.$dirty).toBe(true);
            expect(scope.form.telephone.$dirty).toBe(true);
            expect(scope.form.details.$dirty).toBe(true);
        });

        it('should send the form data to server', function () {
            httpBackend.when("POST",'/api/save-contact-us').respond(200,[]);
            setupController();
            scope.form.$valid = true;
            scope.saveContactUs();
            expect(scope.saving).toBe(false);
            expect(location.path).toBe('/contact-us-success')
        });

    });

    /*it('should show appropriate error message on error', function () {
        httpBackend.when("GET","/api/get-countries").respond(404,[]);
        setupController();
        httpBackend.flush();
    });

    it('should show appropriate error message on error', function () {
        httpBackend.when("GET","/api/get-countries").respond(404,[]);
        setupController();
        httpBackend.flush();
    });*/

});