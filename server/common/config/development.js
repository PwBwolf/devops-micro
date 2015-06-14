'use strict';

module.exports = {
    environment: 'development',
    cleanup: ['Account', 'User', 'ContactUs', 'Visitor'],
    port: 3000,
    merchantPort: 4000,
    email: {
        host: '172.16.10.6',
        port: 25,
        fromEmail: 'noreply@yiptv.com',
        fromName: 'YipTV'
    },
    db: 'mongodb://yipUser:y1ptd3v@localhost/yiptv',
    merchantDb: 'mongodb://yipUser:y1ptd3v@localhost/merchant',
    url: 'http://localhost:3000/',
    imageUrl: 'http://localhost:3000/images/',
    secretToken: 'yip#tv@dev#712',
    ruleEngineRecurrence: '0 * * * * *',
    contactUsEmailList: 'achinth@yiptv.com',
    cloudSpongeDomainKey: 'LJZY53MYH2K7YQKX3TZD',
    cancelSubscriptionForTrialUsers: true,
    complimentarySignUpUrl: 'http://localhost:3000/sign-up/complimentary/',
    refundPeriodInDays: 3,
    blogUrl: 'http://int.yiptv.net/blog/',
    freeSideApiKey: 'yip-freeside-dev',
    freeSideBackOfficeApiUrl: 'http://172.16.10.5:8008/',
    freeSideSelfServiceApiUrl: 'http://172.16.10.5:8080/',
    freeSideFreePackagePart: 6,
    freeSidePaidPackagePart: 4,
    freeSideComplimentaryPackagePart: 6,
    aioGuestAccountList: ['yiptv-guest-1', 'yiptv-guest-2', 'yiptv-guest-3'],
    aioApiUrl: 'http://172.16.10.100',
    aioPortalUrl: 'http://209.18.77.106',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePackages: [{'packageid': 1}, {'packageid': 66}, {'packageid': 27}],
    aioPaidPackages: [{'packageid': 1}, {'packageid': 66}, {'packageid': 62}, {'packageid': 27}]
};
