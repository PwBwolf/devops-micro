'use strict';

describe('Service: userSvc', function () {

    beforeEach(module('app'));

    var userService,
        httpBackend,
        success, error,
        tokenService;

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

    var accessLevels = {
        public: { bitMask: 15 },
        anon: { bitMask: 1 },
        user: { bitMask: 14 },
        admin: { bitMask: 12 },
        superAdmin: { bitMask: 8 }
    };

    var userRoles = { anon: { bitMask: 1, title: 'anon' },
        user: { bitMask: 2, title: 'user' },
        admin: { bitMask: 4, title: 'admin' },
        superAdmin: { bitMask: 8, title: 'superAdmin' } };

    beforeEach(inject(function (userSvc, $httpBackend, tokenSvc) {
        userService = userSvc;
        httpBackend = $httpBackend;
        tokenService = tokenSvc;
        success = null;
        error = null;
    }));

    describe('authorize', function () {

        it('should return bitwise and of currentUser.role.bitmask and accessLevel.bitmask', function () {
            var result = userService.authorize(accessLevels.public);
            expect(result).toEqual(accessLevels.public.bitMask & userService.user.role.bitMask);
            result = userService.authorize(accessLevels.anon);
            expect(result).toEqual(accessLevels.anon.bitMask & userService.user.role.bitMask);
            result = userService.authorize(accessLevels.user);
            expect(result).toEqual(accessLevels.user.bitMask & userService.user.role.bitMask);
            result = userService.authorize(accessLevels.admin);
            expect(result).toEqual(accessLevels.admin.bitMask & userService.user.role.bitMask);
            result = userService.authorize(accessLevels.superAdmin);
            expect(result).toEqual(accessLevels.superAdmin.bitMask & userService.user.role.bitMask);
        });

        it('should return bitwise and of role.bitmask and accessLevel.bitmask', function () {
            var result = userService.authorize(accessLevels.public, userRoles.user);
            expect(result).toEqual(accessLevels.public.bitMask & userRoles.user.bitMask);
            result = userService.authorize(accessLevels.anon, userRoles.user);
            expect(result).toEqual(accessLevels.anon.bitMask & userRoles.user.bitMask);
            result = userService.authorize(accessLevels.user, userRoles.user);
            expect(result).toEqual(accessLevels.user.bitMask & userRoles.user.bitMask);
            result = userService.authorize(accessLevels.admin, userRoles.user);
            expect(result).toEqual(accessLevels.admin.bitMask & userRoles.user.bitMask);
            result = userService.authorize(accessLevels.superAdmin, userRoles.user);
            expect(result).toEqual(accessLevels.superAdmin.bitMask & userRoles.user.bitMask);
        });

    });

    describe('isSignedIn', function () {

        var user = {
            id: 123,
            email: 'varunv@yiptv.com',
            role: { bitMask: 2, title: 'user' }
        };

        it('should return false if no user is passed as an argument', function () {
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

            user.role = userRoles.superAdmin;
            result = userService.isSignedIn(user);
            expect(result).toBe(true);
        });

    });

    describe('isEmailUnique', function () {
        var email = 'varunv@yiptv.com';

        it('should call success callback on success', function () {
            userService.isEmailUnique(email, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('GET', '/api/is-email-unique?email=' + email).respond(true);
            httpBackend.flush();
            expect(success).toEqual(true);
            expect(error).toBe(null);

            userService.isEmailUnique(email, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('GET', '/api/is-email-unique?email=' + email).respond(false);
            httpBackend.flush();
            expect(success).toEqual(false);
            expect(error).toBe(null);
        });

        it('should call error callback on error', function () {
            userService.isEmailUnique(email, mockCallBacks.success, mockCallBacks.error);
            httpBackend.when('GET', '/api/is-email-unique?email=' + email).respond(true);
            httpBackend.flush();
            expect(success).toEqual(true);
            expect(error).toBe(null);
        });

    });

    describe('signUp', function () {
        var userDetails = {
            firstName: 'Varun',
            lastName: 'Verma',
            email: 'varun@yiptv.com',
            password: 'password',
            confirmPassword: 'password',
            cardNumber: 1234567890,
            cvv: 123,
            expiryDate: 10/11/2014,
            zipCode: 12345
        };

        it('should call success callback on sign up success', function () {
            userService.signUp(userDetails, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/sign-up').respond(200);
            httpBackend.flush();
            expect(success).toBe(true);
            expect(error).toBe(null);
        });

        it('should call error callback on sign up error', function () {
            userService.signUp(userDetails, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/sign-up').respond(500, 'UserAlreadyExists');
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toEqual('UserAlreadyExists');
        });
    });

    describe('signIn', function () {

        it('should call error callback if the token is not returned on success', function () {
            var user = {
                email: 'varunv@yiptv.com',
                password: 'password'
            };
            httpBackend.when('POST', '/api/sign-in').respond(200, {});
            userService.signIn(user, mockCallBacks.success, mockCallBacks.error);
            httpBackend.flush();
            expect(error).toEqual(true);
            expect(success).toBe(null);
        });

        describe('if the token is returned on success', function () {
            var user = {
                email: 'varunv@yiptv.com',
                password: 'password',
                rememberMe: true
            };

            it('should call success callback if the user profile is returned by server', function () {
                spyOn(tokenService, 'setToken');
                expect(userService.user).toEqual({id: '', email: '', role: userRoles.anon, firstName: '', lastName: ''});
                userService.signIn(user, mockCallBacks.success, mockCallBacks.error);
                httpBackend.expect('POST', '/api/sign-in').respond(200, {token: 1234});
                httpBackend.expect('GET', '/api/get-user-profile').respond(200, {
                    id: 123,
                    email: 'varunv@yiptv.com',
                    role: 'user',
                    firstName: 'varun',
                    lastName: 'verma',
                    type: 'user',
                    referralCode: 123
                });
                httpBackend.flush();
                expect(tokenService.setToken).toHaveBeenCalledWith(true, 1234);
                expect(userService.user).toEqual({
                    id: 123,
                    email: 'varunv@yiptv.com',
                    role: { bitMask: 2, title: 'user' },
                    firstName: 'varun',
                    lastName: 'verma',
                    type: 'user',
                    referralCode: 123
                });
                expect(success).toEqual({
                    id: 123,
                    email: 'varunv@yiptv.com',
                    role: { bitMask: 2, title: 'user' },
                    firstName: 'varun',
                    lastName: 'verma',
                    type: 'user',
                    referralCode: 123
                });
                expect(error).toBe(null);
            });

            it('should call error callback on internal server error while fetching user profile', function () {
                spyOn(tokenService, 'setToken');
                expect(userService.user).toEqual({id: '', email: '', role: userRoles.anon, firstName: '', lastName: ''});
                userService.signIn(user, mockCallBacks.success, mockCallBacks.error);
                httpBackend.expect('POST', '/api/sign-in').respond(200, {token: 1234});
                httpBackend.expect('GET', '/api/get-user-profile').respond(500);
                httpBackend.flush();
                expect(tokenService.setToken).toHaveBeenCalledWith(true, 1234);
                expect(userService.user).toEqual({id: '', email: '', role: userRoles.anon, firstName: '', lastName: ''});
                expect(error).toEqual(true);
                expect(success).toBe(null);
            });

            it('should call error callback on 404 not found error while fetching user profile', function () {
                spyOn(tokenService, 'setToken');
                userService.signIn(user, mockCallBacks.success, mockCallBacks.error);
                httpBackend.expect('POST', '/api/sign-in').respond(200, {token: 1234});
                httpBackend.expect('GET', '/api/get-user-profile').respond(404);
                httpBackend.flush();
                expect(tokenService.setToken).toHaveBeenCalledWith(true, 1234);
                expect(userService.user).toEqual({id: '', email: '', role: userRoles.anon, firstName: '', lastName: ''});
                expect(error).toEqual(true);
                expect(success).toBe(null);
            });
        });
    });

    describe('signOut', function () {

        it('should call success callback on sign out success', function () {
            userService.signOut(mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST','/api/sign-out').respond(200);
            httpBackend.flush();
            expect(success).toBe(true);
            expect(error).toBe(null);
        });

        it('should call error callback on sign out error', function () {
            userService.signOut(mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST','/api/sign-out').respond(500);
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe(true);
        });

    });

    describe('clearUser', function () {

        it('should change the current user to no user', function () {
            userService.clearUser();
            expect(userService.user).toEqual({id: '', email: '', role: userRoles.anon, firstName: '', lastName: ''});
        });

        it('should clear the user token', function () {
            spyOn(tokenService, 'clearToken');
            userService.clearUser();
            expect(tokenService.clearToken).toHaveBeenCalled();
        });

    });

    describe('verifyUser', function () {
        var data = 12345;

        it('should call success callback on user verified success', function () {
            userService.verifyUser(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/verify-user').respond(200);
            httpBackend.flush();
            expect(success).toBe(true);
            expect(error).toBe(null);
        });

        it('should call error callback on user verified error', function () {
            userService.verifyUser(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/verify-user').respond(500);
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe(true);
        });

        it('should call error callback on user verified error (user not found)', function () {
            userService.verifyUser(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/verify-user').respond(404, 'UserNotFound');
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toEqual('UserNotFound');
        });

    });

    describe('forgotPassword', function () {
        var data = 'varun@yiptv.com';

        it('should call success callback on success', function () {
            userService.forgotPassword(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/forgot-password', {email: data}).respond(200);
            httpBackend.flush();
            expect(success).toBe(true);
            expect(error).toBe(null);
        });

        it('should call error callback on error', function () {
            userService.forgotPassword(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/forgot-password', {email: data}).respond(500);
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe(true);
        });

        it('should call error callback on error(user not found)', function () {
            userService.forgotPassword(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/forgot-password', {email: data}).respond(404, 'UserNotFound');
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe('UserNotFound');
        });

    });

    describe('resetPassword', function () {
        var data = {
            newPassword: 'newPassword'
        };

        it('should call success callback on success', function () {
            userService.resetPassword(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/reset-password', data).respond(200);
            httpBackend.flush();
            expect(success).toBe(true);
            expect(error).toBe(null);
        });

        it('should call error callback on error', function () {
            userService.resetPassword(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/reset-password', data).respond(500);
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe(true);
        });

        it('should call error callback on error(user not found)', function () {
            userService.resetPassword(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/reset-password', data).respond(404, 'UserNotFound');
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe('UserNotFound');
        });
    });

    describe('resetPassword', function () {
        var data = {
            currentPassword : 'Password',
            newPassword: 'newPassword'
        };

        it('should call success callback on success', function () {
            userService.changePassword(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/change-password', data).respond(200);
            httpBackend.flush();
            expect(success).toBe(true);
            expect(error).toBe(null);
        });

        it('should call error callback on error', function () {
            userService.changePassword(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/change-password', data).respond(500);
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe(true);
        });

        it('should call error callback on error(user not found)', function () {
            userService.changePassword(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/change-password', data).respond(404, 'UserNotFound');
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe('UserNotFound');
        });

        it('should call error callback on error(unauthorized)', function () {
            userService.changePassword(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/change-password', data).respond(401, 'Unauthorized');
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe('Unauthorized');
        });
    });

    describe('resendVerification', function () {
        var data = '/api/resend-verification';

        it('should call success callback on success', function () {
            userService.resendVerification(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/resend-verification', {email: data}).respond(200);
            httpBackend.flush();
            expect(success).toBe(true);
            expect(error).toBe(null);
        });

        it('should call error callback on error', function () {
            userService.resendVerification(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/resend-verification', {email: data}).respond(500);
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe(true);
        });

        it('should call error callback on error(user not found)', function () {
            userService.resendVerification(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/resend-verification', {email: data}).respond(404,'UserNotFound');
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe('UserNotFound');
        });

        it('should call error callback on error(user not found)', function () {
            userService.resendVerification(data, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('POST', '/api/resend-verification', {email: data}).respond(409, 'AccountActivated');
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe('AccountActivated');
        });
    });

    describe('checkResetCode', function () {
        var code = 123;
        it('should call success callback on success', function () {
            userService.checkResetCode(code, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('GET', '/api/check-reset-code?code='+ code).respond(200);
            httpBackend.flush();
            expect(success).toBe(true);
            expect(error).toBe(null);
        });

        it('should call error callback on error', function () {
            userService.checkResetCode(code, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('GET', '/api/check-reset-code?code='+ code).respond(500);
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe(true);
        });

        it('should call error callback on error(user not found)', function () {
            userService.checkResetCode(code, mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('GET', '/api/check-reset-code?code='+ code).respond(404, 'UserNotFound');
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe('UserNotFound');
        });

    });

    describe('getAioToken', function () {
        var aioToken = '123efg7';
        it('should call success callback on success', function () {
            userService.getAioToken(mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('GET', '/api/get-aio-token').respond(200, aioToken);
            httpBackend.flush();
            expect(success).toEqual(aioToken);
            expect(error).toBe(null);
        });

        it('should call error callback on error', function () {
            userService.getAioToken(mockCallBacks.success, mockCallBacks.error);
            httpBackend.expect('GET', '/api/get-aio-token').respond(500);
            httpBackend.flush();
            expect(success).toBe(null);
            expect(error).toBe(true);
        });

    });
});
