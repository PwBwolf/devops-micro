'use strict';

if (!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Please set the MONGO_PWD environment variable. Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'production',
    port: 3000,
    merchantPort: 4000,
    notificationPort: 5000,
    email: {
        host: 'prod.yiptv.com',
        port: 25,
        fromEmail: 'noreply@yiptv.com',
        fromName: 'YipTV'
    },
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@10.100.10.4/yiptv',
    merchantDb: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@10.100.10.4/merchant',
    url: 'https://yiptv.com/',
    homeUrl: 'https://www.yiptv.com/',
    imageUrl: 'https://yiptv.com/images/',
    secretToken: 'yip#tv@prod#848',
    ruleEngineRecurrence: '0 0 0 * * *',
    contactUsEmailList: 'support@yiptv.com',
    cloudSpongeDomainKey: 'GMQU3G2VW72CLFRVWS2N',
    cancelSubscriptionForTrialUsers: true,
    complimentarySignUpUrl: 'https://yiptv.com/sign-up/complimentary/',
    refundPeriodInDays: 3,
    cmsUrl: 'http://www.yiptv.com/live-tv/',
    freeSideSelfServiceApiUrl: 'http://10.100.10.15:8080/',
    freeSideFreePremiumUserPackageParts: [0],
    freeSidePaidUserPackageParts: [0],
    freeSideComplimentaryUserPackageParts: [0],
    freeSidePaidBasicPackagePart: 0,
    freeSidePremiumPackagePart: 0,
    aioGuestAccountList: ['yiptv-guest-1', 'yiptv-guest-2', 'yiptv-guest-3'],
    aioApiUrl: 'http://10.100.10.102',
    aioPortalUrl: 'http://content.yiptv.com',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePremiumUserPackages: [{'packageid': 1}, {'packageid': 76}, {'packageid': 74}],
    aioFreeUserPackages: [{'packageid': 1}, {'packageid': 76}],
    aioPaidUserPackages: [{'packageid': 1}, {'packageid': 76}, {'packageid': 74}, {'packageid': 75}],
    aioComplimentaryUserPackages: [{'packageid': 1}, {'packageid': 76}, {'packageid': 74}, {'packageid': 75}]
};
