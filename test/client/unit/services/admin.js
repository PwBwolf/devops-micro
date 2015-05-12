'use strict';

describe('Service: appSvc', function () {

    beforeEach(module('app'));

    var httpBackend,
        adminService,
        success, error;

    var mockCallBacks = {
        success: function (data) {
            if (data === undefined) {
                success = true;
            }
            else {
                success = data;
            }

        },
        error: function (err) {
            if (err === undefined) {
                error = true;
            }
            else {
                error = err;
            }
        }
    };

    beforeEach(inject(function (adminSvc, $httpBackend) {
        httpBackend = $httpBackend;
        adminService = adminSvc;
        success = null;
        error = null;
    }));

    it('getAllUsers', function () {
        it('should call success callback on success', function () {
            var response = adminService.getAllUsers();
            response.success(mockCallBacks.success).error(mockCallBacks.error);
            httpBackend.expect('GET', '/api/admin/get-all-users').respond(200);
            httpBackend.flush();
            expect(error).toBe(null);
            expect(success).toEqual(true);
        });

        it('should call error callback on error', function () {
            var response = adminService.getAllUsers();
            response.success(mockCallBacks.success).error(mockCallBacks.error);
            httpBackend.expect('GET', '/api/admin/get-all-users').respond(500);
            httpBackend.flush();
            expect(error).toBe(true);
            expect(success).toEqual(null);
        });
    });

    describe('getUserDetails', function () {
        var email = ' Varunv@Yiptv.com';
        var userDetails = {
            name: 'Varun',
            email: 'varunv@yiptv.com'
        };
        it('should call success callback on success', function () {
            var response = adminService.getUserDetails(email);
            response.success(mockCallBacks.success).error(mockCallBacks.error);
            httpBackend.expect('GET', '/api/admin/get-user-details?email=varunv@yiptv.com').respond(200, userDetails);
            httpBackend.flush();
            expect(error).toBe(null);
            expect(success).toEqual(userDetails);
        });

        it('should call error callback on error', function () {
            var response = adminService.getUserDetails(email);
            response.success(mockCallBacks.success).error(mockCallBacks.error);
            httpBackend.expect('GET', '/api/admin/get-user-details?email=varunv@yiptv.com').respond(500);
            httpBackend.flush();
            expect(error).toBe(true);
            expect(success).toBe(null);
        });
    });

    describe('getUserDetails', function () {
        var data = {
            newPassword: 'password',
            confirmPassword: 'password',
            currentPassword: 'oldPassword'
        };

        it('should call success callback on success', function () {
            var response = adminService.changePassword(data);
            response.success(mockCallBacks.success).error(mockCallBacks.error);
            httpBackend.expect('POST', '/api/admin/change-password', data).respond(200);
            httpBackend.flush();
            expect(error).toBe(null);
            expect(success).toBe(true);
        });

        it('should call error callback on error', function () {
            var response = adminService.changePassword(data);
            response.success(mockCallBacks.success).error(mockCallBacks.error);
            httpBackend.expect('POST', '/api/admin/change-password', data).respond(500);
            httpBackend.flush();
            expect(error).toBe(true);
            expect(success).toBe(null);
        });

        it('should call error callback on error(user not found)', function () {
            var response = adminService.changePassword(data);
            response.success(mockCallBacks.success).error(mockCallBacks.error);
            httpBackend.expect('POST', '/api/admin/change-password', data).respond(404, 'UserNotFound');
            httpBackend.flush();
            expect(error).toEqual('UserNotFound');
            expect(success).toBe(null);
        });
    });

});