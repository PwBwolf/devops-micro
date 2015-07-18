'use strict';

if (!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'integration',
    cleanup: ['Account', 'User', 'ContactUs', 'Visitor'],
    port: 3000,
    merchantPort: 4000,
    notificationPort: 5000,
    email: {
        host: 'dev.yiptv.com',
        port: 25,
        fromEmail: 'noreply@yiptv.com',
        fromName: 'YipTV'
    },
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
    merchantDb: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/merchant',
    url: 'https://int.yiptv.net/',
    homeUrl: 'https://int.yiptv.net/',
    imageUrl: 'http://int.yiptv.net/images/',
    secretToken: 'yip#tv@int#428',
    ruleEngineRecurrence: '0 0 0 * * *',
    contactUsEmailList: 'achinth@yiptv.com, bashkaran@yiptv.com',
    cloudSpongeDomainKey: 'BNDQ7QY3HH38QG45E3P8',
    cancelSubscriptionForTrialUsers: true,
    complimentarySignUpUrl: 'https://int.yiptv.net/sign-up/complimentary/',
    refundPeriodInDays: 3,
    cmsUrl: 'http://int.yiptv.net/blog/',
    freeSideSelfServiceApiUrl: 'http://172.16.10.5:8080/',
    freeSideFreeUserPackageParts: [17, 18],
    freeSidePaidUserPackageParts: [17, 18, 16],
    freeSideComplimentaryUserPackageParts: [15],
    aioGuestAccountList: ['yiptv-guest-1', 'yiptv-guest-2', 'yiptv-guest-3'],
    aioApiUrl: 'http://172.16.10.100',
    aioPortalUrl: 'http://209.18.77.106',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreeUserPackages: [{'packageid': 76}, {'packageid': 74}],
    aioPaidUserPackages: [{'packageid': 76}, {'packageid': 74}, {'packageid': 75}],
    aioComplimentaryUserPackages: [{'packageid': 76}, {'packageid': 74}, {'packageid': 75}]
};
