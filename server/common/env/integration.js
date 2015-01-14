'use strict';

if(!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'integration',
    cleanup: ['Account', 'User', 'ContactUs', 'Visitor'],
    port: 3000,
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
    url: 'https://int.yiptv.net/',
    imageUrl: 'http://int.yiptv.net/img/',
    secretToken: 'yip#tv@int#428',
    contactUsEmailList: 'achinth@yiptv.com, bashkaran@yiptv.com',
    cloudSpongeDomainKey: 'BNDQ7QY3HH38QG45E3P8',
    aioUrl: 'http://yiptv.net',
    freeSideApiKey: 'yip-freeside-dev',
    freeSideUrl: 'http://209.18.77.105:8008/',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePackages: [{'packageid' : 27}, {'packageid' : 62}],
    aioPaidPackages: [{'packageid' : 1}, {'packageid' : 27}, {'packageid' : 62}]
};
