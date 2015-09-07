'use strict';

module.exports = {
    environment: 'development',
    clientPath: '/client_old',
    port: 3000,
    merchantPort: 4000,
    notificationPort: 5000,
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
    complimentarySignUpUrl: 'http://localhost:3000/sign-up/complimentary/',
    refundPeriodInDays: 3,
    wordPressUrl: 'https://int.yiptv.net/live-tv/',
    metaDataRetrievalRecurrence: '0 0 2 * * *',
    freeSideSelfServiceApiUrl: 'http://172.16.10.5:8080/',
    freeSideFreePremiumUserPackageParts: [17, 18],
    freeSideFreeUserPackageParts: [17],
    freeSidePaidUserPackageParts: [17, 18, 16],
    freeSideComplimentaryUserPackageParts: [15],
    freeSideFreePackagePart: 17,
    freeSidePaidBasicPackagePart: 16,
    freeSidePremiumPackagePart: 18,
    freeSideComplimentaryPackagePart: 15,
    aioGuestAccountList: ['yiptv-guest-1', 'yiptv-guest-2', 'yiptv-guest-3'],
    aioApiUrl: 'http://172.16.10.100',
    aioPortalUrl: 'http://209.18.77.106',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePremiumUserPackages: [{'packageid': 1}, {'packageid': 76}, {'packageid': 74}],
    aioFreeUserPackages: [{'packageid': 1}, {'packageid': 76}],
    aioPaidUserPackages: [{'packageid': 1}, {'packageid': 76}, {'packageid': 74}, {'packageid': 75}],
    aioComplimentaryUserPackages: [{'packageid': 1}, {'packageid': 76}, {'packageid': 74}, {'packageid': 75}],
    aioDunning5DayPackages: [{'packageid': 1}, {'packageid': 76}, {'packageid': 75}]
};
