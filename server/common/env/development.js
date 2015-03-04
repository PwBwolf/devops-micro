'use strict';

module.exports = {
    freePreviewTime: 30000,
    environment: 'development',
    cleanup: ['Account', 'User', 'ContactUs', 'Visitor'],
    port: 3000,
    db: 'mongodb://localhost/yiptv',
    url: 'http://localhost:3000/',
    imageUrl: 'http://localhost:3000/img/',
    secretToken: 'yip#tv@dev#712',
    ruleEngineRecurrence: '* * * * * *',
    contactUsEmailList: 'achinth@yiptv.com, vivek@yiptv.com, varunv@yiptv.com',
    cloudSpongeDomainKey: 'LJZY53MYH2K7YQKX3TZD',
    freeSideApiKey: 'yip-freeside-dev',
    freeSideUrl: 'http://172.16.10.5:8008/',
    aioGuestAccountList: ['yiptv-guest-1', 'yiptv-guest-2', 'yiptv-guest-3'],
    aioApiUrl: 'http://172.16.10.100',
    aioPortalUrl: 'http://209.18.77.106',
    aioUserPin: '1234',
    aioApiKey: '10bf5e4e05b1fe32f9c88e1355fd30e40549041e5',
    aioFreePackages: [{'packageid' : 1}, {'packageid' : 66}, {'packageid' : 27}],
    aioPaidPackages: [{'packageid' : 1}, {'packageid' : 66}, {'packageid' : 62}, {'packageid' : 27}]
};
