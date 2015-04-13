'use strict';

function pad(number) {
    var num = String(number);
    if (num.length === 1) {
        num = '0' + num;
    }
    return num;
}

module.exports = {
    isoDate: function (date) {
        return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) + 'T' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + 'Z';
    },

    utcDate: function (date) {
        return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate());
    }
};
