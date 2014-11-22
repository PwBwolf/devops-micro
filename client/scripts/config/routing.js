(function (exports) {
    'use strict';

    var config = {
        roles: ['anon', 'user', 'admin', 'super-admin'],
        accessLevels: { 'public': '*', 'anon': ['anon'], 'user': ['user', 'admin', 'super-admin'], 'admin': ['admin', 'super-admin'], 'super-admin': ['super-admin'] }
    };

    exports.userRoles = buildRoles(config.roles);
    exports.accessLevels = buildAccessLevels(config.accessLevels, exports.userRoles);

    function buildRoles(roles) {
        var bitMask = '01',
            userRoles = {},
            role,
            intCode;
        for (role in roles) {
            intCode = parseInt(bitMask, 2);
            userRoles[roles[role]] = { bitMask: intCode, title: roles[role] };
            bitMask = (intCode << 1).toString(2);
        }
        return userRoles;
    }

    function buildAccessLevels(accessLevelDeclarations, userRoles) {
        var accessLevels = {},
            resultBitMask,
            role,
            level;

        for (level in accessLevelDeclarations) {
            if (typeof accessLevelDeclarations[level] === 'string') {
                if (accessLevelDeclarations[level] === '*') {
                    resultBitMask = '';
                    for (role in userRoles) {
                        resultBitMask += '1';
                    }
                    accessLevels[level] = { bitMask: parseInt(resultBitMask, 2) };
                } else {
                    // console.log('Access Control Error: Could not parse "' + accessLevelDeclarations[level] + '" as access definition for level "' + level + '"');
                }
            } else {
                resultBitMask = 0;
                for (role in accessLevelDeclarations[level]) {
                    if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role])) {
                        resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask;
                    } else {
                        // console.log('Access Control Error: Could not find role "' + accessLevelDeclarations[level][role] + '" in registered roles while building access for "' + level + '"');
                    }
                }
                accessLevels[level] = {
                    bitMask: resultBitMask
                };
            }
        }
        return accessLevels;
    }
}(typeof exports === 'undefined' ? routing = {} : exports));
