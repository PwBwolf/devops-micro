describe('directive: access-level', function() {
    var elm, scope, userService, compile;

    beforeEach(module('app'));

    var userRoles = {
        admin: {
            bitMask: 4,
            title:"admin"
        },
        anon: {
            bitMask: 1,
            title: "anon"
        },
        superAdmin: {
            bitMask: 8,
            title: "superAdmin"
        },
        user: {
            bitMask: 2,
            title: "user"
        }
    };

    function bindElementToScope(element) {
        elm = angular.element(element);
        compile(elm)(scope);
        scope.$digest();
    }

    beforeEach(inject(function ($rootScope, $compile, userSvc) {
        scope = $rootScope;
        scope.accessLevels = {
            admin:{
                bitMask: 12
            },
            anon:{
                bitMask: 1
            },
            public:{
                bitMask: 15
            },
            superAdmin: {
                bitMask: 8
            },
            user: {
                bitMask: 14
            }
        };
        userService = userSvc;
        userService.user = {
            role: userRoles.anon
        };
        compile = $compile;
    }));

    describe('element with access-level super admin', function () {
        it('should be hidden if the user is not super admin', function () {
            bindElementToScope('<div access-level="accessLevels.superAdmin"></div>');
            for (var role in userRoles) {
                userService.user.role = userRoles[role];
                scope.$digest();
                if (role !== 'superAdmin') {
                    expect(elm.css('display')).toEqual('none');
                }
                else {
                    expect(elm.css('display')).toEqual('');
                }
            }
        });
    });

    describe('element with access-level admin', function () {
        it('should be hidden if the user is not admin or super admin', function () {
            bindElementToScope('<div access-level="accessLevels.admin"></div>');
            for (var role in userRoles) {
                userService.user.role = userRoles[role];
                scope.$digest();
                if (role !== 'admin' && role !== 'superAdmin') {
                    expect(elm.css('display')).toEqual('none');
                }
                else {
                    expect(elm.css('display')).toEqual('');
                }
            }
        });
    });

    describe('element with access-level user', function () {
        it('should be hidden if the user is anon', function () {
            bindElementToScope('<div access-level="accessLevels.user"></div>');
            for (var role in userRoles) {
                userService.user.role = userRoles[role];
                scope.$digest();
                if (role === 'anon') {
                    expect(elm.css('display')).toEqual('none');
                }
                else {
                    expect(elm.css('display')).toEqual('');
                }
            }
        });
    });

    describe('element with access-level anon', function () {
        it('should be hidden if the user is not anonymous', function () {
            bindElementToScope('<div access-level="accessLevels.anon"></div>');
            for(var role in userRoles) {
                userService.user.role = userRoles[role];
                scope.$digest();
                if(role !== 'anon') {
                    expect(elm.css('display')).toEqual('none');
                }
                else{
                    expect(elm.css('display')).toEqual('');
                }
            }
        })
    });

});

