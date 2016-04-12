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
        email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        name: /^[a-zA-Z0-9\s\-,.']+$/,
        address: /^[a-zA-Z0-9\s\-!@#$%&\(\)\+;:'",.\?/=\[\]<>]+$/,
        telephone: /^[2-9]{1}[0-9]{2}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
        usTelephoneInternationalFormat: /^\d{11}$/,
        zipCode: /^\d{5}$/
    },
    db: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
    url: 'https://app.test.yiptv.net/',
    imageUrl: 'https://app.test.yiptv.net/images/',
    secretToken: 'yip#tv@test#275',
    ruleEngineRecurrence: '0 0 0 * * *',
    contactUsEmailList: 'devteam@yiptv.com',
    cloudSpongeDomainKey: 'KT5XZEDX6A32PFZCKZ3Y',
    complimentarySignUpUrl: 'https://app.test.yiptv.net/sign-up/complimentary/',
    refundPeriodInDays: 3,
    wordPressUrl: 'https://test.yiptv.net/live-tv/',
    metaDataRetrievalRecurrence: '0 0 2 * * *',
    checkPhoneNumberExists: true,
    twilioMobileType: ['mobile', 'voip'],
    cjReportProcessorRecurrence: '0 0 5 * * *',
    cjReports: {
        financeEmailAddress: 'devteam@yiptv.com',
        ftpPort: 21,
        ftpHost: '172.16.10.8',
        ftpUsername: 'devtest',
        ftpPassword: 'yiptv123',
        ftpPath: '/'
    },
    freeSideKeyEmailDomain: 'yiptv.ws',
    freeSideSelfServiceApiUrl: 'http://172.16.10.5:8080/',
    freeSideBackOfficeApiUrl: 'http://172.16.10.5:8008/',
    freeSideSecretKey: 'yip-freeside-dev',
    freeSideFreePremiumUserPackageParts: [17, 18],
    freeSideFreeUserPackageParts: [17],
    freeSidePaidUserPackageParts: [17, 18, 16],
    freeSideComplimentaryUserPackageParts: [15],
    freeSideFreePackagePart: 17,
    freeSidePaidBasicPackagePart: 16,
    freeSidePremiumPackagePart: 18,
    freeSideComplimentaryPackagePart: 15,
    freeSideAgentNumbers: {'Internal': 1, 'IDT': 2, 'TRUCONN': 3, 'PERKSPOT': 4, 'NEXTJUMP': 5, 'CJ': 6, 'MGCJK': 7, 'AMAZON': 8, 'UBS': 9},
    cmsApiUrl: 'http://172.16.10.109'
};
