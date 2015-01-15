'use strict';

if(!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'production',
    cleanup: [],
    port: 3000,
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@10.100.10.4/yiptv',
    url: 'https://yiptv.com/',
    imageUrl: 'http://yiptv.com/img/',
    secretToken: 'yip#tv@prod#848',
    contactUsEmailList: 'tribs@yiptv.com, carmen@yiptv.com',
    cloudSpongeDomainKey: 'GMQU3G2VW72CLFRVWS2N',
    aioUrl: 'http://content.yiptv.com',
    freeSideApiKey: 'yip-freeside-prod',
    freeSideUrl: 'http://10.100.10.15:8008/',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePackages: [{'packageid' : 1}, {'packageid' : 66}, {'packageid' : 27}],
    aioPaidPackages: [{'packageid' : 1}, {'packageid' : 66}, {'packageid' : 62}, {'packageid' : 27}]
};
