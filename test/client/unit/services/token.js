'use strict';

describe('Service: appSvc', function () {

    beforeEach(module('app'));

    var tokenService,
        webstorage,
        webStorageMock = {};

    beforeEach(module(function ($provide) {
        webStorageMock.session = jasmine.createSpyObj('webstorage.session', ['get', 'add', 'remove']);
        webStorageMock.local = jasmine.createSpyObj('webstorage.local', ['get', 'add', 'remove']);
        webStorageMock.session.data = {};
        webStorageMock.local.data = {};

        webStorageMock.session.get.and.callFake(function (key) {
            return webStorageMock.session.data[key];
        });
        webStorageMock.session.add.and.callFake(function (key, value) {
            webStorageMock.session.data[key] = value;
        });
        webStorageMock.session.remove.and.callFake(function (key) {
            return webStorageMock.session.data[key];
        });
        webStorageMock.local.get.and.callFake(function (key) {
            return webStorageMock.local.data[key];
        });
        webStorageMock.local.add.and.callFake(function (key, value) {
            webStorageMock.local.data[key] = value;
        });
        webStorageMock.local.remove.and.callFake(function (key) {
            return webStorageMock.local.data[key];
        });
        $provide.value('webStorage', webStorageMock);
    }));

    beforeEach(inject(function (tokenSvc, webStorage) {
        tokenService = tokenSvc;
        webstorage = webStorage;
    }));

    describe('setToken', function () {

        it('should clear the old token from session and local storage', function () {
            tokenService.setToken(true, 12345);
            expect(webstorage.local.remove).toHaveBeenCalledWith('token');
            expect(webstorage.session.remove).toHaveBeenCalledWith('token');
        });

        it('should set the new token in local storage if token is persistent', function () {
            tokenService.setToken(true, 12345);
            expect(webstorage.local.remove).toHaveBeenCalledWith('token');
            expect(webstorage.local.add).toHaveBeenCalledWith('token', 12345);
        });

        it('should set the new token in session storage if token is not persistent', function () {
            tokenService.setToken(false, 12345);
            expect(webstorage.session.remove).toHaveBeenCalledWith('token');
            expect(webstorage.session.add).toHaveBeenCalledWith('token', 12345);
        });

    });

    describe('clearToken', function () {
        it('should clear the token from session and local storage', function () {
            tokenService.clearToken();
            expect(webstorage.local.remove).toHaveBeenCalledWith('token');
            expect(webstorage.session.remove).toHaveBeenCalledWith('token');
        });
    });

    describe('getToken', function () {
        it('should return the token variable if the token variable is set', function () {
            tokenService.setToken(true, 12345);
            var token = tokenService.getToken();
            expect(webstorage.local.get).not.toHaveBeenCalled();
            expect(webstorage.session.get).not.toHaveBeenCalled();
            expect(token).toEqual(12345);
        });

        it('should return the token in session storage if the token variable is not set', function () {
            webstorage.session.add('token', 12345);
            var token = tokenService.getToken();
            expect(webstorage.session.get).toHaveBeenCalledWith('token');
            expect(webstorage.local.get).not.toHaveBeenCalled();
            expect(token).toEqual(12345);
        });

        it('should return the token in local storage if the token is not set in variable and session storage', function () {
            webstorage.local.add('token', 12345);
            var token = tokenService.getToken();
            expect(webstorage.local.get).toHaveBeenCalledWith('token');
            expect(token).toEqual(12345);
        });

        it('should return the undefined if the token is not set in variable and session storage and local storage', function () {
            var token = tokenService.getToken();
            expect(webstorage.local.get).toHaveBeenCalledWith('token');
            expect(token).toBe(undefined);
        });
    });

});
