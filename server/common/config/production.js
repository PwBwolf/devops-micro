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
    url: 'https://app.yiptv.com/',
    imageUrl: 'https://app.yiptv.com/images/',
    secretToken: 'yip#tv@prod#848',
    ruleEngineRecurrence: '0 0 0 * * *',
    contactUsEmailList: 'support@yiptv.com',
    cloudSpongeDomainKey: 'GMQU3G2VW72CLFRVWS2N',
    complimentarySignUpUrl: 'https://app.yiptv.com/sign-up/complimentary/',
    refundPeriodInDays: 3,
    wordPressUrl: 'https://www.yiptv.com/live-tv/',
    metaDataRetrievalRecurrence: '0 0 2 * * *',
    freeSideSelfServiceApiUrl: 'http://10.100.10.15:8080/',
    freeSideFreePremiumUserPackageParts: [6, 9],
    freeSideFreeUserPackageParts: [6],
    freeSidePaidUserPackageParts: [6, 9, 3],
    freeSideComplimentaryUserPackageParts: [8],
    freeSideFreePackagePart: 6,
    freeSidePaidBasicPackagePart: 3,
    freeSidePremiumPackagePart: 9,
    freeSideComplimentaryPackagePart: 8,
    aioGuestAccountList: ['yiptv-guest-1', 'yiptv-guest-2', 'yiptv-guest-3'],
    aioApiUrl: 'http://10.100.10.102',
    aioPortalUrl: 'http://content.yiptv.com',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePremiumUserPackages: [{'packageid': 1}, {'packageid': 78}, {'packageid': 79}],
    aioFreeUserPackages: [{'packageid': 1}, {'packageid': 78}],
    aioPaidUserPackages: [{'packageid': 1}, {'packageid': 78}, {'packageid': 79}, {'packageid': 80}],
    aioComplimentaryUserPackages: [{'packageid': 1}, {'packageid': 78}, {'packageid': 79}, {'packageid': 80}],
    aioDunning5DayPackages: [{'packageid': 1}, {'packageid': 78}, {'packageid': 80}]
};
