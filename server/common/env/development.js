'use strict';

module.exports = {
    environment: 'development',
    port: 3000,
    db: 'mongodb://localhost/yiptv',
    url: 'http://localhost:3000/',
    imageUrl: 'http://localhost:3000/img/',
    secretToken: 'yip#tv@dev#712',
    contactUsEmailList: 'achinth@gmail.com, achinth@yiptv.com, varun@yiptv.com',
    cloudSpongeDomainKey: 'LJZY53MYH2K7YQKX3TZD',
    aioUrl: 'http://yiptv.net',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePackageId: 63,
    aioUnlimitedPackageId: 64,
    yipFreePackageId: 1,
    yipUnlimitedPackageId: 2,
    cleanup: ['Account', 'User', 'ContactUs', 'Visitor']
};
