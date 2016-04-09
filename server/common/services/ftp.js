var Ftp = require('ftp');

exports.uploadFile = function (ftpOptions, localPath, remotePath, callback) {
    var ftp = new Ftp();
    ftp.connect(ftpOptions);
    ftp.on('ready', function () {
        ftp.put(localPath, remotePath, false, function (err) {
            ftp.end();
            callback(err);
        });
    });
    ftp.on('error', function (err) {
        ftp.end();
        callback(err);
    });
};
