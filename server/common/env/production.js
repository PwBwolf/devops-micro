'use strict';

if(!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Please set the MONGO_PWD environment variable. Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'production',
    cleanup: [],
    port: 3000,
    merchantPort: 4000,
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@10.100.10.4/yiptv',
    merchantDb: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@10.100.10.4/merchant',
    url: 'https://yiptv.com/',
    imageUrl: 'https://yiptv.com/img/',
    secretToken: 'yip#tv@prod#848',
    ruleEngineRecurrence: '0 0 0 * * *',
    contactUsEmailList: 'support@yiptv.com',
    cloudSpongeDomainKey: 'GMQU3G2VW72CLFRVWS2N',
    cancelSubscriptionForTrialUsers: true,
    complimentarySignUpUrl: 'https://yiptv.com/sign-up/complimentary/',
    freeSideApiKey: 'yip-freeside-prod',
    freeSideUrl: 'http://10.100.10.15:8008/',
    aioGuestAccountList: ['yiptv-guest-1', 'yiptv-guest-2', 'yiptv-guest-3'],
    aioApiUrl: 'http://10.100.10.102',
    aioPortalUrl: 'http://content.yiptv.com',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePackages: [{'packageid' : 1}, {'packageid' : 66}, {'packageid' : 27}],
    aioPaidPackages: [{'packageid' : 1}, {'packageid' : 66}, {'packageid' : 62}, {'packageid' : 27}]
};
