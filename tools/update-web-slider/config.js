'use strict';

module.exports = {
    imageWidth: 1350,
    imageHeight: 640,
    imageSize: 512000, // 500kB,
    imageType: 'image/jpeg',
    db: {
        development: 'mongodb://localhost/yiptv',
        integration: 'mongodb://yipUser:y1ptd3v@int.yiptv.net/yiptv',
        test: 'mongodb://yipUser:y1ptd3v@test.yiptv.net/yiptv',
        production: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@10.100.10.4/yiptv',
        staging: ''
    }
};
