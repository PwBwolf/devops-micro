'use strict';

if (!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'test',
    webAppClientPath: '/client/web-app',
    crmClientPath: '/client/crm-app',
    webAppPort: 3000,
    apiServerPort: 4000,
    crmAppPort: 5000,
    email: {
        host: 'dev.yiptv.com',
        port: 25,
        fromEmail: 'noreply@yiptv.com',
        fromName: 'YipTV'
    },
    regex: {
        email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\u00C0-\u017F\-0-9]+\.)+[a-zA-Z\u00C0-\u017F]{2,}))$/,
        name: /^[a-zA-Z\u00C0-\u017F0-9\s\-,.']+$/,
        address: /^[a-zA-Z\u00C0-\u017F0-9\s\-!@#$%&\(\)\+;:'",.\?/=\[\]<>]+$/,
        telephone: /^[2-9]{1}[0-9]{2}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
        zipCode: /^\d{5}$/
    },
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
    url: 'https://app.test.yiptv.net/',
    imageUrl: 'https://app.test.yiptv.net/images/',
    secretToken: 'yip#tv@test#275',
    ruleEngineRecurrence: '0 0 0 * * *',
    contactUsEmailList: 'achinth@yiptv.com, bashkaran@yiptv.com',
    cloudSpongeDomainKey: 'KT5XZEDX6A32PFZCKZ3Y',
    complimentarySignUpUrl: 'https://app.test.yiptv.net/sign-up/complimentary/',
    refundPeriodInDays: 3,
    wordPressUrl: 'https://test.yiptv.net/live-tv/',
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
    useAio: false,
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
