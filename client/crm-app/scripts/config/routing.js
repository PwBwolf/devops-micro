(function (exports) {
    'use strict';

    var config = {
        roles: ['anon', 'csr', 'devOps', 'superUser'],
        accessLevels: {'public': '*', 'anon': ['anon'], 'user': ['csr', 'devOps', 'superUser'], 'csr': ['csr', 'superUser'], 'devOps': ['devOps', 'superUser'], 'superUser': ['superUser']}
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
            userRoles[roles[role]] = {bitMask: intCode, title: roles[role]};
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
                    accessLevels[level] = {bitMask: parseInt(resultBitMask, 2)};
                }
            } else {
                resultBitMask = 0;
                for (role in accessLevelDeclarations[level]) {
                    if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role])) {
                        resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask;
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
