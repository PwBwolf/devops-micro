'use strict';

if (!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'test',
    cleanup: ['Account', 'User', 'ContactUs', 'Visitor'],
    port: 3000,
    merchantPort: 4000,
    email: {
        host: 'dev.yiptv.com',
        port: 25,
        fromEmail: 'noreply@yiptv.com',
        fromName: 'YipTV'
    },
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
    merchantDb: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/merchant',
    url: 'https://test.yiptv.net/',
    imageUrl: 'https://test.yiptv.net/images/',
    secretToken: 'yip#tv@test#275',
    ruleEngineRecurrence: '0 * * * * *',
    contactUsEmailList: 'achinth@yiptv.com, bashkaran@yiptv.com',
    cloudSpongeDomainKey: 'KT5XZEDX6A32PFZCKZ3Y',
    cancelSubscriptionForTrialUsers: true,
    complimentarySignUpUrl: 'https://test.yiptv.net/sign-up/complimentary/',
    refundPeriodInDays: 3,
    blogUrl: 'http://test.yiptv.net/live-tv/',
    freeSideApiKey: 'yip-freeside-dev',
    freeSideBackOfficeApiUrl: 'http://172.16.10.5:8008/',
    freeSideSelfServiceApiUrl: 'http://172.16.10.5:8080/',
    freeSideFreePackageNumber: 6,
    freeSidePaidPackageNumber: 4,
    freeSideComplimentaryPackageNumber: 6,
    aioGuestAccountList: ['yiptv-guest-1', 'yiptv-guest-2', 'yiptv-guest-3'],
    aioApiUrl: 'http://172.16.10.100',
    aioPortalUrl: 'http://209.18.77.106',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePackages: [{'packageid': 1}, {'packageid': 66}, {'packageid': 27}],
    aioPaidPackages: [{'packageid': 1}, {'packageid': 66}, {'packageid': 62}, {'packageid': 27}]
};
