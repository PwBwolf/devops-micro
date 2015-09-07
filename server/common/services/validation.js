'use strict';

var _ = require('lodash');

var nameRegex = /^[a-zA-Z0-9\s\-,.']+$/;
var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var addressRegex = /^[a-zA-Z0-9\s\-!@#$%&\(\)\+;:'",.\?/=\[\]<>]+$/;
var telephoneRegex = /^[2-9]{1}[0-9]{2}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
var zipCodeRegex = /^\d{5}$/;
var cvvRegex = /^\d{3,4}$/;

module.exports = {

    validateSignUpInputs: function (user) {
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
        if (!emailRegex.test(user.email.trim())) {
            return 'EmailInvalid';
        }
        if (!user.telephone || user.telephone.trim().length === 0) {
            return 'TelephoneRequired';
        }
        if (user.telephone.trim().length > 12) {
            return 'TelephoneMaxLengthExceeded';
        }
        if (!telephoneRegex.test(user.telephone.trim())) {
            return 'TelephoneInvalid';
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
        if (user.type === 'comp' && (!user.code || user.code.trim().length === 0)) {
            return 'ComplimentaryCodeRequired';
        }
        if (user.type === 'paid') {
            if (!user.cardName || user.cardName.trim().length === 0) {
                return 'CardNameRequired';
            }
            if (user.cardName.trim().length > 128) {
                return 'CardNameMaxLengthExceeded';
            }
            if (!nameRegex.test(user.cardName.trim())) {
                return 'CardNameInvalid';
            }
            if (!user.cardNumber || user.cardNumber.trim().length === 0) {
                return 'CardNumberRequired';
            }
            if (user.cardNumber.trim().length > 19) {
                return 'CardNumberMaxLengthExceeded';
            }
            if (!isCreditCard(user.cardNumber)) {
                return 'CardNumberInvalid';
            }
            if (!user.expiryDate || user.expiryDate.trim().length === 0) {
                return 'ExpiryDateRequired';
            }
            if (user.expiryDate.trim().length > 7) {
                return 'ExpiryDateMaxLengthExceeded';
            }
            if (!isExpiryDate(user.expiryDate)) {
                return 'ExpiryDateInvalid';
            }
            if (!user.cvv || user.cvv.trim().length === 0) {
                return 'CvvRequired';
            }
            if (!cvvRegex.test(user.cvv.trim())) {
                return 'CvvInvalid';
            }
            if (!user.address || user.address.trim().length === 0) {
                return 'AddressRequired';
            }
            if (user.address.trim().length > 80) {
                return 'AddressMaxLengthExceeded';
            }
            if (!addressRegex.test(user.address.trim())) {
                return 'AddressInvalid';
            }
            if (!user.city || user.city.trim().length === 0) {
                return 'CityRequired';
            }
            if (user.city.trim().length > 80) {
                return 'CityMaxLengthExceeded';
            }
            if (!addressRegex.test(user.city.trim())) {
                return 'CityInvalid';
            }
            if (!user.state || user.state.trim().length === 0) {
                return 'StateRequired';
            }
            if (user.state.trim().length > 2) {
                return 'StateMaxLengthExceeded';
            }
            if (!isState(user.state)) {
                return 'StateInvalid';
            }
            if (!user.zipCode || user.zipCode.trim().length === 0) {
                return 'ZipCodeRequired';
            }
            if (user.zipCode.trim().length > 5) {
                return 'ZipCodeMaxLengthExceeded';
            }
            if (!zipCodeRegex.test(user.zipCode.trim())) {
                return 'ZipCodeInvalid';
            }
        }
        return null;
    }
};

function isPasswordComplex(password) {
    var hasUpperCase = /[A-Z]/.test(password);
    var hasNumbers = /\d/.test(password);
    var characterGroupCount = hasUpperCase + hasNumbers;
    return (password.length >= 6) && (characterGroupCount >= 2);
}

function isCreditCard(cardNumber) {
    if (/[^0-9-\s]+/.test(cardNumber)) {
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

function isState(state) {
    var states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
    return _.indexOf(states, state) >= 0;
}
