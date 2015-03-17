'use strict';

module.exports = {
    imageLength: 1350,
    imageHeight: 640,
    db: {
        development: 'mongodb://localhost/yiptv',
        integration: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
        test: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@localhost/yiptv',
        production: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@10.100.10.4/yiptv',
        staging: ''
    }
};
