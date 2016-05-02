'use strict';

module.exports = {
    environment: 'development',
    webAppClientPath: '/client/web-app',
    crmClientPath: '/client/crm-app',
    webAppPort: 3000,
    apiServerPort: 4000,
    crmAppPort: 5000,
    email: {
        host: '172.16.10.6',
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
    db: 'mongodb://yipUser:y1ptd3v@localhost/yiptv',
    url: 'http://localhost:3000/',
    imageUrl: 'https://app.int.yiptv.net/images/',
    secretToken: 'yip#tv@dev#712',
    contactUsEmailList: 'achinth@yiptv.com',
    cloudSpongeDomainKey: 'LJZY53MYH2K7YQKX3TZD',
    complimentarySignUpUrl: 'http://localhost:3000/sign-up/complimentary/',
    refundPeriodInDays: 3,
    wordPressUrl: 'https://int.yiptv.net/live-tv/',
    metaDataRetrievalRecurrence: '0 0 2 * * *',
    checkPhoneNumberExists: true,
    twilioMobileType: ['mobile', 'voip'],
    emailSmsProcessorRecurrence: '0 * * * * *',
    subscriptionProcessorRecurrence: '0 * * * * *',
    cjReportProcessorRecurrence: '0 * * * * *',
    cjReports: {
        financeEmailAddress: 'achinth@yiptv.com',
        ftpPort: 21,
        ftpHost: '172.16.10.8',
        ftpUsername: 'devtest',
        ftpPassword: 'yiptv123',
        ftpPath: '/'
    },
    freeSideKeyEmailDomain: 'dev.yiptv.ws',
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
    cmsApiUrl: 'https://cmsint.yiptv.net'
};
