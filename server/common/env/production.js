'use strict';

if(!process.env.MONGO_PWD) {
    console.log('Mongo Password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'production',
    port: 3000,
    db: 'mongodb://' + process.env.MONGO_PWD + 'localhost/yiptv',
    url: 'http://yiptv.com/',
    imageUrl: 'http://yiptv.com/img/',
    secretToken: 'yip#tv@prod#848',
    contactUsEmailList: 'tribs@yiptv.com, carmen@yiptv.com',
    cloudSpongDomainKey: 'NEED_TO_BUY',
    aioUrl: 'http://yiptv.net',
    aioApiKey: 'xxxx'
};
