'use strict';

if(!process.env.MONGO_PWD) {
    console.log('MongoDB password not set! Exiting...');
    process.exit(1);
}

module.exports = {
    environment: 'staging',
    cleanup: [],
    port: 3000,
    db: 'mongodb://localhost/yiptv',
    url: 'https://staging.yiptv.net/',
    imageUrl: 'https://staging.yiptv.net/img/',
    secretToken: 'yip#tv@staging#346',
    ruleEngineRecurrence: '0 0 0 * * *',
    contactUsEmailList: 'achinth@yiptv.com, bashkaran@yiptv.com',
    cloudSpongeDomainKey: '5FLQG2YJF2SGQ2JY4GCH',
    cancelSubscriptionForTrialUsers: true,
    complimentarySignUpUrl: 'https://staging.yiptv.net/sign-up/complimentary/',
    freeSideApiKey: '',
    freeSideUrl: '',
    aioApiUrl: '',
    aioPortalUrl: '',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePackages: [{'packageid' : 1}, {'packageid' : 66}, {'packageid' : 27}],
    aioPaidPackages: [{'packageid' : 1}, {'packageid' : 66}, {'packageid' : 62}, {'packageid' : 27}]
};
