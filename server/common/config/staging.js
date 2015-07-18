'use strict';

if (!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'staging',
    port: 3000,
    merchantPort: 4000,
    notificationPort: 5000,
    email: {
        host: 'dev.yiptv.com',
        port: 25,
        fromEmail: 'noreply@yiptv.com',
        fromName: 'YipTV'
    },
    db: 'mongodb://localhost/yiptv',
    merchantDb: 'mongodb://localhost/merchant',
    url: 'https://staging.yiptv.net/',
    homeUrl: 'https://staging.yiptv.net/',
    imageUrl: 'https://staging.yiptv.net/images/',
    secretToken: 'yip#tv@staging#346',
    ruleEngineRecurrence: '0 0 0 * * *',
    contactUsEmailList: 'achinth@yiptv.com, bashkaran@yiptv.com',
    cloudSpongeDomainKey: '5FLQG2YJF2SGQ2JY4GCH',
    cancelSubscriptionForTrialUsers: true,
    complimentarySignUpUrl: 'https://staging.yiptv.net/sign-up/complimentary/',
    refundPeriodInDays: 3,
    cmsUrl: '',
    freeSideSelfServiceApiUrl: '',
    freeSideFreePremiumUserPackageParts: [17, 18],
    freeSidePaidUserPackageParts: [17, 18, 16],
    freeSideComplimentaryUserPackageParts: [15],
    aioGuestAccountList: ['yiptv-guest-1', 'yiptv-guest-2', 'yiptv-guest-3'],
    aioApiUrl: '',
    aioPortalUrl: '',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePremiumUserPackages: [{'packageid': 1}, {'packageid': 27}, {'packageid': 76}, {'packageid': 74}],
    aioFreeUserPackages: [{'packageid': 1}, {'packageid': 27}, {'packageid': 76}],
    aioPaidUserPackages: [{'packageid': 1}, {'packageid': 27}, {'packageid': 76}, {'packageid': 74}, {'packageid': 75}],
    aioComplimentaryUserPackages: [{'packageid': 1}, {'packageid': 27}, {'packageid': 76}, {'packageid': 74}, {'packageid': 75}]
};
