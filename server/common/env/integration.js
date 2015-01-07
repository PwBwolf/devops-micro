'use strict';

if(!process.env.MONGO_PWD) {
    console.log('Mongo password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'integration',
    port: 3000,
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
    url: 'https://int.yiptv.net/',
    imageUrl: 'http://int.yiptv.net/img/',
    secretToken: 'yip#tv@int#428',
    contactUsEmailList: 'achinth@yiptv.com, bashkaran@yiptv.com',
    cloudSpongeDomainKey: 'BNDQ7QY3HH38QG45E3P8',
    aioUrl: 'http://yiptv.net',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePackages: [{'packageid' : 27}, {'packageid' : 62}],
    aioUnlimitedPackages: [{'packageid' : 1}, {'packageid' : 27}, {'packageid' : 62}],
    yipFreePackageId: 1,
    yipUnlimitedPackageId: 2,
    cleanup: ['Account', 'User', 'ContactUs', 'Visitor']
};
