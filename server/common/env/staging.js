'use strict';

module.exports = {
    environment: 'staging',
    port: 3000,
    db: 'mongodb://localhost/yiptv',
    url: 'https://staging.yiptv.net/',
    imageUrl: 'https://staging.yiptv.net/img/',
    secretToken: 'yip#tv@staging#346',
    contactUsEmailList: 'achinth@yiptv.com, bashkaran@yiptv.com',
    cloudSpongeDomainKey: '5FLQG2YJF2SGQ2JY4GCH',
    aioUrl: 'http://yiptv.net',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePackages: [{'packageid' : 27}, {'packageid' : 62}],
    aioUnlimitedPackages: [{'packageid' : 1}, {'packageid' : 27}, {'packageid' : 62}],
    yipFreePackageId: 1,
    yipUnlimitedPackageId: 2,
    cleanup: ['Account', 'User', 'ContactUs', 'Visitor']
};
