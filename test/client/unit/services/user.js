'use strict';

describe('Service: userSvc', function () {

    beforeEach(module('app'));

    var userService,
        httpBackend,
        success, error;

    var mockCallBacks = {
        success: function (data) {
            success = data;
        },
        error: function (err) {
            error = err;
        }
    };

    var accessLevels = {
        public: { bitMask: 15 },
        anon: { bitMask: 1 },
        user: { bitMask: 14 },
        admin: { bitMask: 12 },
        'super-admin': { bitMask: 8 }
    };

    var userRoles = { anon: { bitMask: 1, title: 'anon' },
        user: { bitMask: 2, title: 'user' },
        admin: { bitMask: 4, title: 'admin' },
        'super-admin': { bitMask: 8, title: 'super-admin' } };


    beforeEach(inject(function (userSvc, $httpBackend) {
        userService = userSvc;
        httpBackend = $httpBackend;
        success = null;
        error = null;
    }));

    describe('authorize', function () {

        it('should return bitwise and of currentUser.role.bitmask and accessLevel.bitmask', function() {
            var result = userService.authorize(accessLevels.public);
            expect(result).toEqual(accessLevels.public.bitMask & userService.user.role.bitMask);
            result = userService.authorize(accessLevels.anon);
            expect(result).toEqual(accessLevels.anon.bitMask & userService.user.role.bitMask);
            result = userService.authorize(accessLevels.user);
            expect(result).toEqual(accessLevels.user.bitMask & userService.user.role.bitMask);
            result = userService.authorize(accessLevels.admin);
            expect(result).toEqual(accessLevels.admin.bitMask & userService.user.role.bitMask);
            result = userService.authorize(accessLevels['super-admin']);
            expect(result).toEqual(accessLevels['super-admin'].bitMask & userService.user.role.bitMask);
        });

        it('should return bitwise and of role.bitmask and accessLevel.bitmask', function() {
            var result = userService.authorize(accessLevels.public, userRoles.user);
            expect(result).toEqual(accessLevels.public.bitMask & userRoles.user.bitMask);
            result = userService.authorize(accessLevels.anon, userRoles.user);
            expect(result).toEqual(accessLevels.anon.bitMask & userRoles.user.bitMask);
            result = userService.authorize(accessLevels.user, userRoles.user);
            expect(result).toEqual(accessLevels.user.bitMask & userRoles.user.bitMask);
            result = userService.authorize(accessLevels.admin, userRoles.user);
            expect(result).toEqual(accessLevels.admin.bitMask & userRoles.user.bitMask);
            result = userService.authorize(accessLevels['super-admin'], userRoles.user);
            expect(result).toEqual(accessLevels['super-admin'].bitMask & userRoles.user.bitMask);
        });

    });

    describe('isSignedIn', function () {

        var user = {
            id: 123,
            email: 'varunv@yiptv.com',
            role: { bitMask: 2, title: 'user' }
        };

        it('should return false if no user is passed as argument', function () {
            var result = userService.isSignedIn();
            expect(result).toBe(false);
        });

        it('should return false if user role is anon', function () {
            user.role = userRoles.anon;
            var result = userService.isSignedIn(user);
            expect(result).toBe(false);
        });

        it('should return true if user role is not anon', function () {
            user.role = userRoles.user;
            var result = userService.isSignedIn(user);
            expect(result).toBe(true);

            user.role = userRoles.admin;
            result = userService.isSignedIn(user);
            expect(result).toBe(true);

            user.role = userRoles['super-admin'];
            result = userService.isSignedIn(user);
            expect(result).toBe(true);
        });

    });

    describe('isEmailUnique', function () {
        var email = 'varunv@yiptv.com';

        it('should call success callback on success', function () {
            userService.isEmailUnique(email, mockCallBacks.success, mockCallBacks.error);
            httpBackend.when('GET', '/api/is-email-unique?email='+email).respond(true);
            httpBackend.flush();
            expect(success).toEqual(true);
            expect(error).toBe(null);
        });

        it('should call success callback if the email is unique', function () {
            userService.isEmailUnique(email, mockCallBacks.success, mockCallBacks.error);
            httpBackend.when('GET', '/api/is-email-unique?email='+email).respond(500, 'internal server error');
            httpBackend.flush();
            expect(error).toEqual('internal server error');
            expect(success).toBe(null);
        });

    });

});
