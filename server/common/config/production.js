'use strict';

if (!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Please set the MONGO_PWD environment variable. Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'production',
    webAppClientPath: '/client/web-app',
    crmClientPath: '/client/crm-app',
    webAppPort: 3000,
    apiServerPort: 4000,
    crmAppPort: 5000,
    email: {
        host: 'prod.yiptv.com',
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
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@10.100.10.4/yiptv',
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
    checkPhoneNumberExists: true,
    twilioMobileType: ['mobile'],
    freeSideKeyEmailDomain: 'yiptv.us',
    freeSideSelfServiceApiUrl: 'http://10.100.10.21:8080/',
    freeSideBackOfficeApiUrl: 'http://10.100.10.21:8008/',
    freeSideSecretKey: 'yip-freeside-prod',
    freeSideFreePremiumUserPackageParts: [6, 9],
    freeSideFreeUserPackageParts: [6],
    freeSidePaidUserPackageParts: [6, 9, 10],
    freeSideComplimentaryUserPackageParts: [8],
    freeSideFreePackagePart: 6,
    freeSidePaidBasicPackagePart: 10,
    freeSidePremiumPackagePart: 9,
    freeSideComplimentaryPackagePart: 8,
    cmsApiUrl: 'http://10.100.10.109'
};
