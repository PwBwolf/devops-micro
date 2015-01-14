'use strict';

if(!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'production',
    cleanup: [],
    port: 3000,
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
    url: 'https://yiptv.com/',
    imageUrl: 'http://yiptv.com/img/',
    secretToken: 'yip#tv@prod#848',
    contactUsEmailList: 'tribs@yiptv.com, carmen@yiptv.com',
    cloudSpongeDomainKey: 'GMQU3G2VW72CLFRVWS2N',
    aioUrl: '',
    freeSideApiKey: '',
    freeSideUrl: '',
    aioUserPin: '1234',
    aioApiKey: '',
    aioFreePackages: [{'packageid' : 0}, {'packageid' : 0}, {'packageid' : 0}],
    aioPaidPackages: [{'packageid' : 0}, {'packageid' : 0}, {'packageid' : 0}, , {'packageid' : 0}]
};
