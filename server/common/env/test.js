'use strict';

if(!process.env.MONGO_PWD) {
    console.log('Mongo Password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'test',
    port: 3000,
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
    url: 'http://test.yiptv.net/',
    imageUrl: 'http://test.yiptv.net/img/',
    secretToken: 'yip#tv@test#275',
    contactUsEmailList: 'bashkaran@yiptv.com',
    cloudSpongeDomainKey: 'KT5XZEDX6A32PFZCKZ3Y',
    aioUrl: 'http://yiptv.net',
    aioApiKey: 'xxxx',
    cleanup: ['Account', 'User', 'ContactUs', 'Visitor']
};
