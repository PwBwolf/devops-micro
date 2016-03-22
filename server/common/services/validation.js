'use strict';

var _ = require('lodash');
var config = require('../setup/config');

var nameRegex = config.regex.name;
var emailRegex = config.regex.email;
var addressRegex = config.regex.address;
var telephoneRegex = config.regex.telephone;
var usTelephoneInternational = config.regex.usTelephoneInternationalFormat;
var zipCodeRegex = config.regex.zipCode;
var cvv3Regex = /^\d{3}$/;
var cvv4Regex = /^\d{4}$/;

module.exports = {

    validateSignUpInputs: function (user) {
        if (!user.type || user.type.trim().length === 0) {
            return 'TypeRequired';
        }
        if (user.type !== 'free' && user.type !== 'paid' && user.type !== 'comp') {
            return 'TypeInvalid';
        }
        if (!user.firstName || user.firstName.trim().length === 0) {
            return 'FirstNameRequired';
        }
        if (user.firstName.trim().length > 20) {
            return 'FirstNameMaxLengthExceeded';
        }
        if (!nameRegex.test(user.firstName.trim())) {
            return 'FirstNameInvalid';
        }
        if (!user.lastName || user.lastName.trim().length === 0) {
            return 'LastNameRequired';
        }
        if (user.lastName.trim().length > 20) {
            return 'LastNameMaxLengthExceeded';
        }
        if (!nameRegex.test(user.lastName.trim())) {
            return 'LastNameInvalid';
        }
        if (!user.email || user.email.trim().length === 0) {
            return 'EmailRequired';
        }
        if (user.email.trim().length > 50) {
            return 'EmailMaxLengthExceeded';
        }
        if (!emailRegex.test(user.email.trim()) && !telephoneRegex.test(user.email.trim())) {
            return 'EmailInvalid';
        }
        if (!user.password || user.password.trim().length === 0) {
            return 'PasswordRequired';
        }
        if (user.password.length > 20) {
            return 'PasswordMaxLengthExceeded';
        }
        if (!isPasswordComplex(user.password)) {
            return 'PasswordInvalid';
        }
        if (user.confirmPassword && user.confirmPassword !== user.password) {
            return 'ConfirmPasswordInvalid';
        }
        if (!user.preferences || !user.preferences.defaultLanguage) {
            return 'DefaultLanguageRequired';
        }
        if (user.preferences.defaultLanguage !== 'en' && user.preferences.defaultLanguage !== 'es') {
            return 'DefaultLanguageInvalid';
        }
        if (typeof user.preferences.emailSmsSubscription !== 'boolean') {
            return 'EmailSmsSubscriptionInvalid';
        }
        if (user.type === 'comp' && (!user.code || user.code.trim().length === 0)) {
            return 'ComplimentaryCodeRequired';
        }
        if (user.type === 'paid') {
            if (!user.cardName || user.cardName.trim().length === 0) {
                return 'CardNameRequired';
            }
            if (user.cardName.length > 128) {
                return 'CardNameMaxLengthExceeded';
            }
            if (!nameRegex.test(user.cardName)) {
                return 'CardNameInvalid';
            }
            if (!user.cardNumber || user.cardNumber.trim().length === 0) {
                return 'CardNumberRequired';
            }
            if (user.cardNumber.length < 14) {
                return 'CardNumberMinimumLengthNotMet';
            }
            if (user.cardNumber.length > 16) {
                return 'CardNumberMaximumLengthExceeded';
            }
            if (!isCreditCard(user.cardNumber)) {
                return 'CardNumberInvalid';
            }
            if (!user.expiryDate || user.expiryDate.trim().length === 0) {
                return 'ExpiryDateRequired';
            }
            if (user.expiryDate.length > 7) {
                return 'ExpiryDateMaxLengthExceeded';
            }
            if (!isExpiryDate(user.expiryDate)) {
                return 'ExpiryDateInvalid';
            }
            if (!user.cvv || user.cvv.trim().length === 0) {
                return 'CvvRequired';
            }
            if (!isCvv(user.cvv, user.cardNumber)) {
                return 'CvvInvalid';
            }
            if (!user.address || user.address.trim().length === 0) {
                return 'AddressRequired';
            }
            if (user.address.length > 80) {
                return 'AddressMaxLengthExceeded';
            }
            if (!addressRegex.test(user.address)) {
                return 'AddressInvalid';
            }
            if (!user.city || user.city.trim().length === 0) {
                return 'CityRequired';
            }
            if (user.city.length > 80) {
                return 'CityMaxLengthExceeded';
            }
            if (!addressRegex.test(user.city)) {
                return 'CityInvalid';
            }
            if (!user.state || user.state.trim().length === 0) {
                return 'StateRequired';
            }
            if (user.state.length > 2) {
                return 'StateMaxLengthExceeded';
            }
            if (!isState(user.state)) {
                return 'StateInvalid';
            }
            if (!user.zipCode || user.zipCode.trim().length === 0) {
                return 'ZipCodeRequired';
            }
            if (user.zipCode.length > 5) {
                return 'ZipCodeMaxLengthExceeded';
            }
            if (!zipCodeRegex.test(user.zipCode)) {
                return 'ZipCodeInvalid';
            }
        }
        return null;
    },

    validateGetEmailSmsSubscriptionStatusInputs: function (email) {
        if (!email || email.trim().length === 0) {
            return 'EmailRequired';
        }
        if (!emailRegex.test(email.trim())) {
            return 'EmailInvalid';
        }
        return null;
    },

    validateSetEmailSmsSubscriptionStatusInputs: function (data) {
        if (!data.email || data.email.trim().length === 0) {
            return 'EmailRequired';
        }
        if (!emailRegex.test(data.email.trim())) {
            return 'EmailInvalid';
        }
        if (typeof data.emailSmsSubscription === 'undefined') {
            return 'EmailSmsSubscriptionInvalid';
        }
        if (typeof data.emailSmsSubscription !== 'undefined' && typeof data.emailSmsSubscription !== 'boolean') {
            return 'EmailSmsSubscriptionInvalid';
        }
        return null;
    },

    validateVerifyEmailInputs: function (email) {
        if (!email || email.trim().length === 0) {
            return 'EmailRequired';
        }
        if (!emailRegex.test(email.trim())) {
            return 'EmailInvalid';
        }
        return null;
    },

    validateVerifyMobileNumberInputs: function (mobileNumber) {
        if (!mobileNumber || mobileNumber.trim().length === 0) {
            return 'MobileNumberRequired';
        }
        if (!telephoneRegex.test(mobileNumber.trim())) {
            return 'MobileNumberInvalid';
        }
        return null;
    },

    isPasswordComplex: isPasswordComplex,

    isUsPhoneNumber: isUsPhoneNumber,

    isUsPhoneNumberInternationalFormat: isUsPhoneNumberInternationalFormat,

    getUsername: getUsername,

    getDbUsernameFromFreeSideUsername: getDbUsernameFromFreeSideUsername
};

function isPasswordComplex(password) {
    var hasUpperCase = /[A-Z]/.test(password);
    var hasNumbers = /\d/.test(password);
    var characterGroupCount = hasUpperCase + hasNumbers;
    return (password.length >= 6) && (characterGroupCount >= 2);
}

function isCreditCard(cardNumber) {
    if (/[^0-9]+/.test(cardNumber)) {
        return false;
    }
    if (parseInt(cardNumber) === 0) {
        return false;
    }
    if ((cardNumber.indexOf('34') === 0 || cardNumber.indexOf('37') === 0) && cardNumber.length !== 15) {
        return false;
    }
    if ((cardNumber.indexOf('4') === 0 || cardNumber.indexOf('51') === 0 || cardNumber.indexOf('52') === 0 || cardNumber.indexOf('53') === 0 || cardNumber.indexOf('54') === 0 || cardNumber.indexOf('55') === 0) && cardNumber.length !== 16) {
        return false;
    }
    if ((cardNumber.indexOf('35') === 0 || cardNumber.indexOf('6011') === 0 || cardNumber.indexOf('622') === 0 || cardNumber.indexOf('64') === 0 || cardNumber.indexOf('65') === 0) && cardNumber.length !== 16) {
        return false;
    }
    if ((cardNumber.indexOf('30') === 0 || cardNumber.indexOf('36') === 0 || cardNumber.indexOf('38') === 0 || cardNumber.indexOf('39') === 0) && (cardNumber.length !== 16 && cardNumber.length !== 14)) {
        return false;
    }
    var check = 0, number = 0, even = false;
    cardNumber = cardNumber.replace(/\D/g, '');
    for (var n = cardNumber.length - 1; n >= 0; n--) {
        var digit = cardNumber.charAt(n);
        number = parseInt(digit, 10);
        if (even) {
            if ((number *= 2) > 9) {
                number -= 9;
            }
        }
        check += number;
        even = !even;
    }
    return (check % 10) === 0;
}

function isExpiryDate(dateString) {
    if (!/^\d{2}\/\d{4}$/.test(dateString)) {
        return false;
    }
    var today = new Date();
    var parts = dateString.split('/');
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[1], 10);
    if (month === 0 || month > 12 || year < today.getFullYear() || year > 2099) {
        return false;
    }
    if (year === today.getFullYear()) {
        return month >= today.getMonth() + 1;
    }
    return true;
}

function isCvv(cvv, cardNumber) {
    if (cardNumber.indexOf('34') === 0 || cardNumber.indexOf('37') === 0) {
        return cvv4Regex.test(cvv);
    } else {
        return cvv3Regex.test(cvv);
    }
}

function isState(state) {
    var states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
    return _.indexOf(states, state) >= 0;
}

function isUsPhoneNumber(number) {
    return telephoneRegex.test(number);
}

function isUsPhoneNumberInternationalFormat(number) {
    return usTelephoneInternational.test(number);
}

function getUsername(value) {
    if (isUsPhoneNumber(value.trim())) {
        value = '1' + value.replace(/[\. -]+/g, '');
    }
    return value.trim().toLowerCase();
}

function getDbUsernameFromFreeSideUsername(username) {
    if (endsWith(username, 'yiptv.ws') || endsWith(username, 'yiptv.us')) {
        return username.split('_')[0];
    } else {
        return username.toLowerCase();
    }
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
