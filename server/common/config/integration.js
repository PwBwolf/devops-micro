'use strict';

if (!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'integration',
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
        email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        name: /^[a-zA-Z0-9\s\-,.']+$/,
        address: /^[a-zA-Z0-9\s\-!@#$%&\(\)\+;:'",.\?/=\[\]<>]+$/,
        telephone: /^[2-9]{1}[0-9]{2}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
        usTelephoneInternationalFormat: /^\d{11}$/,
        zipCode: /^\d{5}$/
    },
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
    url: 'https://app.int.yiptv.net/',
    imageUrl: 'https://app.int.yiptv.net/images/',
    secretToken: 'yip#tv@int#428',
    ruleEngineRecurrence: '0 0 0 * * *',
    contactUsEmailList: 'achinth@yiptv.com, bashkaran@yiptv.com',
    cloudSpongeDomainKey: 'BNDQ7QY3HH38QG45E3P8',
    complimentarySignUpUrl: 'https://app.int.yiptv.net/sign-up/complimentary/',
    refundPeriodInDays: 3,
    wordPressUrl: 'https://int.yiptv.net/live-tv/',
    metaDataRetrievalRecurrence: '0 0 2 * * *',
    checkPhoneNumberExists: true,
    twilioMobileType: ['mobile', 'voip'],
    freeSideSelfServiceApiUrl: 'http://172.16.10.5:8080/',
    freeSideBackOfficeApiUri: 'http://172.16.10.5:8008/',
    freeSideSecret: 'yip-freeside-dev',
    freeSideFreePremiumUserPackageParts: [17, 18],
    freeSideFreeUserPackageParts: [17],
    freeSidePaidUserPackageParts: [17, 18, 16],
    freeSideComplimentaryUserPackageParts: [15],
    freeSideFreePackagePart: 17,
    freeSidePaidBasicPackagePart: 16,
    freeSidePremiumPackagePart: 18,
    freeSideComplimentaryPackagePart: 15,
    cmsApiUrl: 'http://172.16.10.108'
};
