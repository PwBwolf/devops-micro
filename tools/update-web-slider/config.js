'use strict';

module.exports = {
    imageWidth: 1350,
    imageHeight: 640,
    imageSize: 307200, // 300kB,
    imageType: 'image/jpeg',
    db: {
        development: 'mongodb://localhost/yiptv',
        integration: 'mongodb://yipUser:y1ptd3v@172.16.10.8/yiptv',
        test: 'mongodb://yipUser:y1ptd3v@172.16.10.11/yiptv',
        production: 'mongodb://yipUser:' + process.env.MONGO_PWD + '@10.100.10.4/yiptv',
        staging: ''
    }
};
