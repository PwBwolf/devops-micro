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

    utcDateString: function (date) {
        return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate());
    },

    utcDateTime: function (date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }
};
