'use strict';

if(!process.env.MONGO_PWD) {
    console.log('Mongo password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'integration',
    port: 3000,
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
    url: 'http://int.yiptv.net/',
    imageUrl: 'http://int.yiptv.net/img/',
    secretToken: 'yip#tv@int#428',
    contactUsEmailList: 'achinth@yiptv.com, vivek@yiptv.com',
    cloudSpongeDomainKey: 'BNDQ7QY3HH38QG45E3P8',
    aioUrl: 'http://yiptv.net',
    aioApiKey: 'xxxx',
    cleanup: ['Account', 'User', 'ContactUs', 'Visitor']
};
