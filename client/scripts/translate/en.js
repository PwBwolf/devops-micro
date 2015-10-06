(function (app) {
    'use strict';

    app.config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('en', {
            CHANGE_CREDIT_CARD_BILLING_INFO: 'Enter your new credit card details. If you need help call',
            CHANGE_CREDIT_CARD_CARD_NAME: 'Name on Credit Card',
            CHANGE_CREDIT_CARD_CARD_NAME_REQUIRED: 'Enter name as on your credit card',
            CHANGE_CREDIT_CARD_ADDRESS: 'Billing Address',
            CHANGE_CREDIT_CARD_ADDRESS_REQUIRED: 'Enter address as on your credit card',
            CHANGE_CREDIT_CARD_CITY: 'City',
            CHANGE_CREDIT_CARD_CITY_REQUIRED: 'Enter city as on your credit card',
            CHANGE_CREDIT_CARD_STATE: 'State',
            CHANGE_CREDIT_CARD_STATE_REQUIRED: 'Enter state as on your credit card',
            CHANGE_CREDIT_CARD_STATE_LOAD_ERROR: 'Error loading state list',
            CHANGE_CREDIT_CARD_STATE_SELECT: 'Select One',
            CHANGE_CREDIT_CARD_CARD_NUMBER: 'Credit Card Number',
            CHANGE_CREDIT_CARD_CARD_NUMBER_REQUIRED: 'Enter your credit card number',
            CHANGE_CREDIT_CARD_CARD_NUMBER_ERROR: 'Enter a valid credit card number',
            CHANGE_CREDIT_CARD_CVV: 'CVV (3 Digit Security Code)',
            CHANGE_CREDIT_CARD_CVV_REQUIRED: 'Enter your CVV',
            CHANGE_CREDIT_CARD_CARD_NUMBER_CVV_ERROR: 'Enter a valid CVV',
            CHANGE_CREDIT_CARD_EXPIRY_DATE: 'Expiration Date (MM/YY)',
            CHANGE_CREDIT_CARD_EXPIRY_DATE_REQUIRED: 'Enter your card expiration date',
            CHANGE_CREDIT_CARD_EXPIRY_DATE_INVALID: 'Enter a valid card expiration date',
            CHANGE_CREDIT_CARD_ZIP_CODE: 'Zip Code',
            CHANGE_CREDIT_CARD_ZIP_CODE_REQUIRED: 'Enter zip code as on your credit card',
            CHANGE_CREDIT_CARD_ZIP_CODE_INVALID: 'Enter a valid zip code',
            CHANGE_CREDIT_CARD_CARD_NAME_INVALID: 'Enter a valid name',
            CHANGE_CREDIT_CARD_ADDRESS_INVALID: 'Enter a valid address',
            CHANGE_CREDIT_CARD_CITY_INVALID: 'Enter a valid city',
            CHANGE_CREDIT_CARD_SUBMIT_BUTTON: 'Submit',
            CHANGE_CREDIT_CARD_SUCCESS: 'Your credit card has been changed successfully',
            CHANGE_CREDIT_CARD_FAILED: 'Unable to change your credit card. Please contact customer support at',
            CHANGE_CREDIT_CARD_PROBLEM: 'Having trouble changing your credit card? Contact customer support at',
            CHANGE_CREDIT_CARD_ACCESS_ERROR: 'You cannot change your credit card. Please contact customer support at',
            CHANGE_CREDIT_CARD_PAYMENT_ERROR: 'We were unable to process payment on your card. Please check your credit card information.',
            CHANGE_CREDIT_CARD_FREE_USER_ERROR: 'Trial users cannot add a credit card to their account',
            CHANGE_CREDIT_CARD_COMP_USER_ERROR: 'Complimentary users cannot add a credit card to their account',
            CHANGE_CREDIT_CARD_ACCOUNT_REFRESH_ERROR: 'Please close and re-open the YipTV application browser window',
            CHANGE_PASSWORD_CURRENT_PASSWORD: 'Current password',
            CHANGE_PASSWORD_NEW_PASSWORD: 'New password',
            CHANGE_PASSWORD_CONFIRM_PASSWORD: 'Confirm new password',
            CHANGE_PASSWORD_BUTTON: 'Submit',
            CHANGE_PASSWORD_CURRENT_PASSWORD_REQUIRED: 'Enter your current password',
            CHANGE_PASSWORD_NEW_PASSWORD_REQUIRED: 'Enter new password',
            CHANGE_PASSWORD_NEW_PASSWORD_NOT_COMPLEX: 'Password needs to be at least 6 characters, contain 1 uppercase letter and 1 number',
            CHANGE_PASSWORD_NEW_PASSWORD_SAME: 'New Password cannot be the same as the current password',
            CHANGE_PASSWORD_CONFIRM_PASSWORD_REQUIRED: 'Confirm your password',
            CHANGE_PASSWORD_CONFIRM_PASSWORD_NO_MATCH: 'Passwords do not match',
            CHANGE_PASSWORD_ERROR: 'Error occurred while changing the password',
            CHANGE_PASSWORD_INCORRECT_PASSWORD: 'Current Password entered is incorrect',
            CHANGE_PASSWORD_SUCCESS: 'Your password has been changed successfully',
            CHANNEL_GUIDE_ON_NOW: 'On Now: ',
            CHANNEL_GUIDE_LOAD_ERROR: 'Error loading channel guide',
            COMP_SIGN_UP_HEADING: 'Sign Up',
            COMP_SIGN_UP_MESSAGE: 'Sign up for your complimentary YipTV account.',
            COMP_SIGN_UP_VERIFYING: 'Verifying...',
            COMP_SIGN_UP_CODE_EXPIRED: 'Your invitation code is either invalid or has expired!',
            COMP_SIGN_UP_FIRST_NAME: 'First Name',
            COMP_SIGN_UP_FIRST_NAME_REQUIRED: 'Enter your first name',
            COMP_SIGN_UP_LAST_NAME_REQUIRED: 'Enter your last name',
            COMP_SIGN_UP_FIRST_NAME_INVALID: 'Enter a valid first name',
            COMP_SIGN_UP_LAST_NAME_INVALID: 'Enter a valid last name',
            COMP_SIGN_UP_EMAIL: 'Email',
            COMP_SIGN_UP_TELEPHONE: 'Telephone',
            COMP_SIGN_UP_TELEPHONE_INVALID: 'Enter a valid US telephone number',
            COMP_SIGN_UP_TELEPHONE_REQUIRED: 'Enter your telephone number',
            COMP_SIGN_UP_LAST_NAME: 'Last Name',
            COMP_SIGN_UP_EMAIL_INVALID: 'Enter a valid email address',
            COMP_SIGN_UP_EMAIL_EXISTS: 'You already have an account with us. Please sign in.',
            COMP_SIGN_UP_EMAIL_REQUIRED: 'Enter your email address',
            COMP_SIGN_UP_PASSWORD: 'Password',
            COMP_SIGN_UP_PASSWORD_INFO: '(Please use 6 characters or more and at least one number and one capital letter)',
            COMP_SIGN_UP_PASSWORD_REQUIRED: 'Enter your password',
            COMP_SIGN_UP_PASSWORD_NOT_COMPLEX: 'Password needs to be at least 6 characters, contain 1 uppercase letter and 1 number',
            COMP_SIGN_UP_CONFIRM_PASSWORD: 'Confirm Password',
            COMP_SIGN_UP_CONFIRM_PASSWORD_REQUIRED: 'Confirm your password',
            COMP_SIGN_UP_CONFIRM_PASSWORD_NO_MATCH: 'Passwords do not match',
            COMP_SIGN_UP_TERMS_OF_USE: 'Terms of Use',
            COMP_SIGN_UP_AND: 'and',
            COMP_SIGN_UP_SUBMIT_BUTTON: 'Sign Up',
            COMP_SIGN_UP_FORM_INVALID: 'There was a problem with the information you entered in one or more sections of the form above. Please review your entries and click “Sign Up” again.',
            COMP_SIGN_UP_HAVE_ACCOUNT: 'Already have an account?',
            COMP_SIGN_UP_SIGN_IN: 'Sign In',
            COMP_SIGN_UP_EMAIL_SMS_SUBSCRIPTION: 'Please send me updates via text message and email',
            COMP_SIGN_UP_DISCLAIMER: 'I agree to the YipTV',
            COMP_SIGN_UP_DISCLAIMER_END: '',
            COMP_SIGN_UP_DISCLAIMER_REQUIRED: 'In order to use YipTV services you need to accept our Terms of Use and Privacy Policy',
            COMP_SIGN_UP_PRIVACY_POLICY: 'Privacy Policy',
            COMP_SIGN_UP_USER_EXISTS: 'This email is already registered with YipTV. Please use another email address.',
            COMP_SIGN_UP_FAILED: 'User sign up failed. Please contact customer support at',
            COMP_SIGN_UP_PROBLEM: 'Having trouble signing up? Contact customer support at',
            CONTACT_US_HEADING: 'Contact Us',
            CONTACT_US_NAME: 'Name',
            CONTACT_US_INTEREST: 'Interest',
            CONTACT_US_INTEREST_SELECT: 'Select One',
            CONTACT_US_INTEREST_INVESTOR: 'Become a YipTV investor',
            CONTACT_US_INTEREST_TECHNICAL: 'Technical Support',
            CONTACT_US_INTEREST_BILLING: 'Billing Support',
            CONTACT_US_EMAIL: 'Email',
            CONTACT_US_TELEPHONE: 'Telephone',
            CONTACT_US_TELEPHONE_INVALID: 'Enter a valid US telephone number',
            CONTACT_US_DETAILS: 'How can we assist you?',
            CONTACT_US_COUNTRY: 'Country',
            CONTACT_US_COUNTRY_SELECT: 'Select One',
            CONTACT_US_COUNTRY_REQUIRED: 'Select your country',
            CONTACT_US_SUBMIT_BUTTON: 'Submit',
            CONTACT_US_NAME_REQUIRED: 'Enter your name',
            CONTACT_US_INTEREST_REQUIRED: 'Enter your interest type',
            CONTACT_US_EMAIL_REQUIRED: 'Enter your email address',
            CONTACT_US_EMAIL_INVALID: 'Enter a valid email address',
            CONTACT_US_DETAILS_REQUIRED: 'Tell us how we can help you?',
            CONTACT_US_TELEPHONE_REQUIRED: 'Enter your telephone number',
            CONTACT_US_ERROR: 'Error submitting your request',
            CONTACT_US_COUNTRY_LOAD_ERROR: 'Error loading country list',
            CONTACT_US_SUCCESS_HEADING: 'Contact Us',
            CONTACT_US_SUCCESS_MESSAGE: 'Your request has been submitted successfully.',
            FORGOT_PASSWORD_HEADING: 'Forgot Password',
            FORGOT_PASSWORD_EMAIL: 'Enter your email and we will send a link to reset your password',
            FORGOT_PASSWORD_BUTTON: 'Submit',
            FORGOT_PASSWORD_EMAIL_INVALID: 'Enter a valid email address',
            FORGOT_PASSWORD_EMAIL_REQUIRED: 'Enter your email address',
            FORGOT_PASSWORD_ERROR: 'Error sending reset password link. Please contact customer support at',
            FORGOT_PASSWORD_SUCCESS_HEADING: 'Forgot Password',
            FORGOT_PASSWORD_SUCCESS_MESSAGE: 'Password reset link and instructions have been sent to your email address',
            FREE_SIGN_UP_HEADING: 'My YipTV Free Membership',
            FREE_SIGN_UP_MESSAGE: 'No trial periods, no catches, just free TV.',
            FREE_SIGN_UP_BULLET1: '17 FREE Live International Channels',
            FREE_SIGN_UP_BULLET2: 'Plus - 9 Bonus Channels for 7 Days (including beIN SPORTS and HolaTV)',
            FREE_SIGN_UP_BULLET3: 'No Credit Cards, Contract or Cable plans required',
            FREE_SIGN_UP_BULLET4: 'Keep your FREE Membership or upgrade and get 70+ channels - its up to you!',
            FREE_SIGN_UP_FIRST_NAME: 'First Name',
            FREE_SIGN_UP_FIRST_NAME_REQUIRED: 'Enter your first name',
            FREE_SIGN_UP_LAST_NAME_REQUIRED: 'Enter your last name',
            FREE_SIGN_UP_FIRST_NAME_INVALID: 'Enter a valid first name',
            FREE_SIGN_UP_LAST_NAME_INVALID: 'Enter a valid last name',
            FREE_SIGN_UP_EMAIL: 'Email',
            FREE_SIGN_UP_TELEPHONE: 'Telephone',
            FREE_SIGN_UP_TELEPHONE_INVALID: 'Enter a valid US telephone number',
            FREE_SIGN_UP_TELEPHONE_REQUIRED: 'Enter your telephone number',
            FREE_SIGN_UP_LAST_NAME: 'Last Name',
            FREE_SIGN_UP_EMAIL_INVALID: 'Enter a valid email address',
            FREE_SIGN_UP_EMAIL_EXISTS: 'You already have an account with us. Please sign in.',
            FREE_SIGN_UP_EMAIL_REQUIRED: 'Enter your email address',
            FREE_SIGN_UP_PASSWORD: 'Password',
            FREE_SIGN_UP_PASSWORD_INFO: '(Please use 6 characters or more and at least one number and one capital letter)',
            FREE_SIGN_UP_PASSWORD_REQUIRED: 'Enter your password',
            FREE_SIGN_UP_PASSWORD_NOT_COMPLEX: 'Password needs to be at least 6 characters, contain 1 uppercase letter and 1 number',
            FREE_SIGN_UP_CONFIRM_PASSWORD: 'Confirm Password',
            FREE_SIGN_UP_CONFIRM_PASSWORD_REQUIRED: 'Confirm your password',
            FREE_SIGN_UP_CONFIRM_PASSWORD_NO_MATCH: 'Passwords do not match',
            FREE_SIGN_UP_TERMS_OF_USE: 'Terms of Use',
            FREE_SIGN_UP_AND: 'and',
            FREE_SIGN_UP_SUBMIT_BUTTON: 'Start My Free Membership',
            FREE_SIGN_UP_FORM_INVALID: 'There was a problem with the information you entered in one or more sections of the form above. Please review your entries and click “Start My Free Membership” again.',
            FREE_SIGN_UP_HAVE_ACCOUNT: 'Already have an account?',
            FREE_SIGN_UP_SIGN_IN: 'Sign In',
            FREE_SIGN_UP_EMAIL_SMS_SUBSCRIPTION: 'Please send me updates via text message and email',
            FREE_SIGN_UP_DISCLAIMER: 'I agree to the YipTV',
            FREE_SIGN_UP_DISCLAIMER_END: '',
            FREE_SIGN_UP_DISCLAIMER_REQUIRED: 'In order to use YipTV services you need to accept our Terms of Use and Privacy Policy',
            FREE_SIGN_UP_PRIVACY_POLICY: 'Privacy Policy',
            FREE_SIGN_UP_USER_EXISTS: 'This email is already registered with YipTV. Please use another email address.',
            FREE_SIGN_UP_FAILED: 'User sign up failed. Please contact customer support at',
            FREE_SIGN_UP_PROBLEM: 'Having trouble signing up? Contact customer support at',
            FREE_SIGN_UP_SUCCESS_HEADING: 'Thank You - Welcome to YipTV!',
            FREE_SIGN_UP_SUCCESS_SUB_HEADING: 'Let\'s get started!',
            FREE_SIGN_UP_SUCCESS_LINE1: 'Congratulations, you are now a <span class="bolder-text">YipTV Free Member!</span> Just one quick thing before you start watching:',
            FREE_SIGN_UP_SUCCESS_LINE2: '<span class="bolder-text">Please confirm your email address by clicking the link in the email we sent you.</span>',
            FREE_SIGN_UP_SUCCESS_LINE3_PART1: 'You can watch right in your PC or iOS web browser, smart TV or internet connected device. If you have questions about how to watch on your device, please visit our',
            FREE_SIGN_UP_SUCCESS_LINE3_PART2: 'or call customer support at:',
            FREE_SIGN_UP_SUCCESS_FAQS: 'FAQs',
            FREE_SIGN_UP_SUCCESS_LINE4: 'Download our FREE app and watch YipTV live on your mobile',
            FREE_SIGN_UP_SUCCESS_LINE5: 'Your Free Membership Includes:',
            FREE_SIGN_UP_SUCCESS_BULLET1: '17 FREE Live International Channels',
            FREE_SIGN_UP_SUCCESS_BULLET2: 'Plus - 9 Bonus Channels for 7 Days (including beIN SPORTS and HolaTV)',
            FREE_SIGN_UP_SUCCESS_BULLET3: 'Watch on 2 devices',
            FREE_SIGN_UP_SUCCESS_BULLET4: 'Keep your <span class="bolder-text">FREE Membership</span> as long as you like or upgrade and get 70+ channels - its up to you!',
            FREE_SIGN_UP_SUCCESS_QUESTIONS: 'Questions? Call Customer Care at',
            INDEX_TOP: 'Top ^',
            INDEX_OTHER_LANGUAGE: 'Español',
            INDEX_SIGN_IN: 'Sign In',
            INDEX_OK_BUTTON: 'OK',
            INDEX_YES_BUTTON: 'Yes',
            INDEX_NO_BUTTON: 'No',
            INDEX_CONTACT_NUMBER: 'Call us toll free: <a href=\'tel:+18559194788\'>855-919-4788</a>',
            INDEX_SOCIAL_MEDIA: '<a target="_blank" href="https://www.facebook.com/pages/Yiptv/670093559720356?fref=ts"><img src="images/facebook.png" alt=""/></a><a target="_blank" href="https://twitter.com/YipTV"><img src="images/twitter.png" alt=""/></a>',
            INDEX_COPYRIGHT: 'Copyright ® 2012-2015 YipTV. User of the YipTV service and this web site constitutes acceptance of our terms of use and privacy policy.',
            MAIN_ERROR_APP_CONFIG: 'Error fetching application configuration',
            MAIN_SIGN_OUT_CONFIRMATION: 'Are you sure you want to sign out of YipTV?',
            MAIN_LANGUAGE_CHANGE_SAVE_CHECK: 'Do you want to change your preferred language to ',
            MAIN_LANGUAGE_CHANGE_SAVE_SUCCESS: 'Language preference saved successfully',
            MAIN_LANGUAGE_CHANGE_SAVE_ERROR: 'Unable to change your language preference. Please contact customer support at',
            NOT_FOUND_HEADING: 'Page Not Found',
            NOT_FOUND_MESSAGE: 'The page you are looking for does not exist.',
            PLAYER_ON_NOW: 'On Now: ',
            PLAYER_TIME: 'Time: ',
            PLAYER_NOT_AVAILABLE: 'Not Available',
            PLAYER_DURATION: 'Duration: ',
            PLAYER_DESCRIPTION: 'Description: ',
            PLAYER_TITLE: 'Title: ',
            PLAYER_MINUTES: 'minutes',
            PLAYER_RESULTS: 'Results:',
            PLAYER_CHANNELS_FOUND: 'channel(s) found!',
            PLAYER_CATEGORIES: 'Categories',
            PLAYER_CLEAR_ALL: 'Clear All',
            PLAYER_GENRE: 'Genre',
            PLAYER_REGION: 'Region',
            PLAYER_AUDIENCE: 'Audience',
            PLAYER_LANGUAGE: 'Language',
            PLAYER_CHANNEL_FILTER: 'Channel Filter',
            PLAYER_CHANNEL_LOAD_ERROR: 'Error loading channel',
            PLAYER_CHANNEL_LIST_LOAD_ERROR: 'Error loading channel list',
            PLAYER_CHANNEL_GUIDE_LOAD_ERROR: 'Error loading channel guide',
            PLAYER_PROMO_CHANNEL_LIST_LOAD_ERROR: 'Error loading promo channel list',
            PREFERENCES_PREFERRED_LANGUAGE: 'Select your preferred language',
            PREFERENCES_PREFERRED_LANGUAGE_REQUIRED: 'Select your preferred language',
            PREFERENCES_SMS_SUBSCRIPTION: 'Send me updates via text message',
            PREFERENCES_EMAIL_SUBSCRIPTION: 'Send me updates via email',
            PREFERENCES_SUBMIT_BUTTON: 'Submit',
            PREFERENCES_FETCH_ERROR: 'Unable to fetch your preferences. Please contact customer support at',
            PREFERENCES_SAVE_ERROR: 'Unable to save your preferences. Please contact customer support at',
            PREFERENCES_SAVED: 'Your preferences have been saved successfully.',
            RAF_HEADING: 'Refer a friend',
            RAF_MESSAGE: 'Spread the word about YipTV to all of your friends and everybody gets FREE TV. For each one of your friends who sign up as a new customer, you’ll each get a month FREE. Invite them all to join because the offer is unlimited!',
            RAF_FINE_PRINT: '<sup>*</sup>If you (the "Referrer") refer another person (the "Referree") to YIPTV and the Referree completes a valid registration process for a subscription, the Referrer will receive a credit for one-month of their monthly service fee and the Referree will receive a credit for one-month  their monthly service fee (up to $14.99 of credit, per month) if and after the Referree has maintained a paid subscription with YipTV for sixty-one (61) consecutive days. Credit excludes additional charges, including, but not limited to, premium services or features. Cancellation by either Referrer or Referree before sixty-one (61) consecutive days from the date Referree subscribes to YipTV will result in the loss of and/or chargeback of associated credits. In the event that the Referrer or Referree has a balance due, then a credit will be applied. Credits earned have an equivalent non-cash value of one month of service, regardless of past or future subscription price changes to the service. If the customer cancels service with referral credits remaining, than those credits, if any, are forfeited. Credit has no cash value, is nonrefundable and nontransferable. Certain types of referrals, including, but not limited to, referring yourself or someone living in the same residence as you, are prohibited. Offer, prices and charges are subject to change without notice. Other terms and conditions may apply. See terms of use for more information. Void where prohibited. Offer cannot be combined and is subject to restrictions and limitations.',
            RAF_MY_EMAIL: 'My Email',
            RAF_EMAIL_REQUIRED: 'Enter your email address',
            RAF_EMAIL_INVALID: 'Enter a valid email address',
            RAF_IMPORT_CONTACT_LIST: 'Import My Contact List',
            RAF_LOADING: 'Loading...',
            RAF_OR: 'or',
            RAF_ENTER_FRIENDS_EMAIL: 'Enter Friends\' Email Addresses Separated By Commas',
            RAF_SEND_INVITE: 'Send Invite',
            RAF_EMAIL_SEND_ERROR: 'Unable to send YipTV invites to your friends',
            RAF_EMAIL_LIST_REQUIRED: 'Enter at least a single email address',
            RAF_EMAIL_LIST_INVALID: 'One or more email addresses are invalid',
            RAF_SUCCESS_HEADING: 'Refer a friend',
            RAF_SUCCESS_MESSAGE: 'We have sent an invite to your friends',
            REDIRECT_MESSAGE: 'Redirecting...',
            RESEND_VERIFICATION_HEADING: 'Resend Verification Email',
            RESEND_VERIFICATION_EMAIL: 'Enter your email and we will send a link to verify your account',
            RESEND_VERIFICATION_EMAIL_INVALID: 'Enter a valid email address',
            RESEND_VERIFICATION_EMAIL_REQUIRED: 'Enter your email address',
            RESEND_VERIFICATION_BUTTON: 'Submit',
            RESEND_VERIFICATION_SUCCESS_HEADING: 'Resend Verification Email',
            RESEND_VERIFICATION_SUCCESS_MESSAGE: 'We have sent you the account verification link. Please check your email.',
            RESEND_VERIFICATION_USER_ERROR: 'Account not found or account already activated',
            RESEND_VERIFICATION_ERROR: 'Error sending account verification link. Please contact customer support at',
            RESET_PASSWORD_HEADING: 'Reset Password',
            RESET_PASSWORD_NEW_PASSWORD: 'New Password',
            RESET_PASSWORD_CONFIRM_PASSWORD_REQUIRED: 'Confirm your password',
            RESET_PASSWORD_CONFIRM_PASSWORD: 'Confirm Password',
            RESET_PASSWORD_NEW_PASSWORD_NOT_COMPLEX: 'Password needs to be at least 6 characters, contain 1 uppercase letter and 1 number',
            RESET_PASSWORD_NEW_PASSWORD_REQUIRED: 'Enter your password',
            RESET_PASSWORD_CONFIRM_PASSWORD_NO_MATCH: 'Passwords do not match',
            RESET_PASSWORD_BUTTON: 'Submit',
            RESET_PASSWORD_USER_ERROR: 'Unable to change your password. Please contact customer support at',
            RESET_PASSWORD_CODE_ERROR: 'The reset password link has expired and is no longer valid',
            RESET_PASSWORD_SUCCESS_HEADING: 'Reset Password',
            RESET_PASSWORD_SUCCESS_MESSAGE: 'Your password has been changed successfully.',
            SIGN_IN_HEADING: 'Welcome back to YipTV. Login below to watch your favorite shows.',
            SIGN_IN_SUB_HEADING: 'Not registered yet? Click <a style="color:#A03269" class="underline-text" href="/sign-up/free">here to sign up</a> and start watching now!',
            SIGN_IN_EMAIL: 'Email',
            SIGN_IN_EMAIL_REQUIRED: 'Enter your email address',
            SIGN_IN_EMAIL_INVALID: 'Enter a valid email address',
            SIGN_IN_PASSWORD: 'Password',
            SIGN_IN_PASSWORD_REQUIRED: 'Enter your password',
            SIGN_IN_SUBMIT_BUTTON: 'Sign In',
            SIGN_IN_FORGOT_PASSWORD: 'Forgot Password?',
            SIGN_IN_RESET_PASSWORD: 'Reset Password',
            SIGN_IN_NOT_REGISTERED: 'Not Registered Yet?',
            SIGN_IN_SIGN_UP: 'Sign Up',
            SIGN_IN_FAILED_NOT_VERIFIED: 'Sign In failed as your account has not been verified yet',
            SIGN_IN_FAILED: 'Sign In failed',
            SIGN_IN_NO_VERIFICATION_EMAIL: 'Did not receive verification email?',
            SIGN_IN_RESEND_VERIFICATION: 'Request Again',
            SIGN_IN_UPGRADE_SUBSCRIPTION: 'You need to sign in before you can upgrade to premium membership.',
            SIGN_UP_SUB_HEADING: 'My YipTV Premium Membership',
            SIGN_UP_QUESTIONS: 'Questions? Call Customer Care at',
            SIGN_UP_ORDER_SUMMARY: 'Order Summary - Premium Membership',
            SIGN_UP_BULLET1: '70+ live international <span style="text-decoration: underline">channels</span>',
            SIGN_UP_BULLET2: 'Includes viewing on 5 devices',
            SIGN_UP_BULLET3: 'No Contract - cancel anytime',
            SIGN_UP_ITEM1: 'First Month Premium Membership:',
            SIGN_UP_AMOUNT1: '$14.99',
            SIGN_UP_ITEM2: 'Taxes & hidden fees:',
            SIGN_UP_AMOUNT2: '$0.00',
            SIGN_UP_ITEM_TOTAL: 'Total monthly charge:',
            SIGN_UP_AMOUNT_TOTAL: '$14.99',
            SIGN_UP_FIRST_NAME: 'First Name',
            SIGN_UP_FIRST_NAME_REQUIRED: 'Enter your first name',
            SIGN_UP_LAST_NAME_REQUIRED: 'Enter your last name',
            SIGN_UP_FIRST_NAME_INVALID: 'Enter a valid first name',
            SIGN_UP_LAST_NAME_INVALID: 'Enter a valid last name',
            SIGN_UP_CARD_NAME_INVALID: 'Enter a valid name',
            SIGN_UP_ADDRESS_INVALID: 'Enter a valid address',
            SIGN_UP_CITY_INVALID: 'Enter a valid city',
            SIGN_UP_EMAIL: 'Email',
            SIGN_UP_TELEPHONE: 'Phone',
            SIGN_UP_TELEPHONE_INVALID: 'Enter a valid US telephone number',
            SIGN_UP_TELEPHONE_REQUIRED: 'Enter your telephone number',
            SIGN_UP_LAST_NAME: 'Last Name',
            SIGN_UP_EMAIL_INVALID: 'Enter a valid email address',
            SIGN_UP_EMAIL_EXISTS: 'You already have an account with us. Please sign in.',
            SIGN_UP_EMAIL_REQUIRED: 'Enter your email address',
            SIGN_UP_PASSWORD: 'Password',
            SIGN_UP_PASSWORD_INFO: '(Please use 6 characters or more and at least one number and one capital letter)',
            SIGN_UP_PASSWORD_REQUIRED: 'Enter your password',
            SIGN_UP_PASSWORD_NOT_COMPLEX: 'Password needs to be at least 6 characters, contain 1 uppercase letter and 1 number',
            SIGN_UP_CONFIRM_PASSWORD: 'Confirm Password',
            SIGN_UP_CONFIRM_PASSWORD_REQUIRED: 'Confirm your password',
            SIGN_UP_CONFIRM_PASSWORD_NO_MATCH: 'Passwords do not match',
            SIGN_UP_BILLING_INFO: 'Billing Information',
            SIGN_UP_ACCOUNT_INFO: 'Account Information',
            SIGN_UP_CARD_NAME: 'Name on Credit Card',
            SIGN_UP_CARD_NAME_REQUIRED: 'Enter name as on your credit card',
            SIGN_UP_ADDRESS: 'Billing Address',
            SIGN_UP_ADDRESS_REQUIRED: 'Enter address as on your credit card',
            SIGN_UP_CITY: 'City',
            SIGN_UP_CITY_REQUIRED: 'Enter city as on your credit card',
            SIGN_UP_STATE: 'State',
            SIGN_UP_STATE_REQUIRED: 'Enter state as on your credit card',
            SIGN_UP_STATE_LOAD_ERROR: 'Error loading state list',
            SIGN_UP_STATE_SELECT: 'Select One',
            SIGN_UP_CARD_NUMBER: 'Credit Card Number',
            SIGN_UP_CARD_NUMBER_REQUIRED: 'Enter your credit card number',
            SIGN_UP_CARD_NUMBER_ERROR: 'Enter a valid credit card number',
            SIGN_UP_CVV: 'CVV (3 digit security code)',
            SIGN_UP_CVV_REQUIRED: 'Enter your CVV',
            SIGN_UP_CARD_NUMBER_CVV_ERROR: 'Enter a valid CVV',
            SIGN_UP_EXPIRY_DATE: 'Expiration Date (MM/YY)',
            SIGN_UP_EXPIRY_DATE_REQUIRED: 'Enter your card expiration date',
            SIGN_UP_EXPIRY_DATE_INVALID: 'Enter a valid card expiration date',
            SIGN_UP_ZIP_CODE: 'Zip Code',
            SIGN_UP_ZIP_CODE_REQUIRED: 'Enter zip code as on your credit card',
            SIGN_UP_ZIP_CODE_INVALID: 'Enter a valid zip code',
            SIGN_UP_TERMS_OF_USE: 'Terms of Use',
            SIGN_UP_AND: 'and',
            SIGN_UP_SUBMIT_BUTTON: 'Start My Premium Membership',
            SIGN_UP_EMAIL_SMS_SUBSCRIPTION: 'Please send me updates via text message and email',
            SIGN_UP_DISCLAIMER: 'I agree to the YipTV',
            SIGN_UP_DISCLAIMER_END: '',
            SIGN_UP_DISCLAIMER_REQUIRED: 'In order to use YipTV services you need to accept our Terms of Use and Privacy Policy',
            SIGN_UP_PRIVACY_POLICY: 'Privacy Policy',
            SIGN_UP_FORM_INVALID: 'There was a problem with the information you entered in one or more sections of the form above. Please review your entries and click “Start My Premium Membership” again.',
            SIGN_UP_USER_EXISTS: 'This email is already registered with YipTV. Please use another email address.',
            SIGN_UP_FAILED: 'User sign up failed. Please contact customer support at',
            SIGN_UP_PROBLEM: 'Having trouble signing up? Contact Customer support at:',
            SIGN_UP_SUCCESS_HEADING: 'Welcome to Premium Membership!',
            SIGN_UP_SUCCESS_SUB_HEADING: 'Let\'s get started!',
            SIGN_UP_SUCCESS_LINE1: 'Congratulations, you are now a <span class="bolder-text">YipTV Premium Member!</span> Just one quick thing before you start watching:',
            SIGN_UP_SUCCESS_LINE2: '<span class="bolder-text">Please confirm your email address by clicking the link in the email we sent you.</span>',
            SIGN_UP_SUCCESS_LINE3_PART1: 'You can watch right in your PC or iOS web browser, smart TV or internet connected device. If you have questions about how to watch on your device, please visit our',
            SIGN_UP_SUCCESS_LINE3_PART2: 'or call customer support at:',
            SIGN_UP_SUCCESS_FAQS: 'FAQs',
            SIGN_UP_SUCCESS_LINE4: 'Download our FREE app and watch YipTV live on your mobile',
            SIGN_UP_SUCCESS_LINE5: 'Your Premium Membership Includes:',
            SIGN_UP_SUCCESS_BULLET1: '70+ FREE Live International Channels',
            SIGN_UP_SUCCESS_BULLET2: 'More and more channels being added for Premium Members',
            SIGN_UP_SUCCESS_BULLET3: 'Share with family on up to 5 devices',
            SIGN_UP_SUCCESS_BULLET4: 'Refer a friend to Premium Membership and you each get a FREE month of YipTV!',
            SIGN_UP_SUCCESS_QUESTIONS: 'Questions? Call Customer Care at',
            SIGN_UP_SUCCESS_LOGIN_HEADING: 'Welcome to Premium Membership!',
            SIGN_UP_SUCCESS_LOGIN_SUB_HEADING: 'Let\'s get started!',
            SIGN_UP_SUCCESS_LOGIN_LINE1: 'Congratulations, you are now a <span class="bolder-text">YipTV Premium Member!</span>',
            SIGN_UP_SUCCESS_LOGIN_LINE2_PART1: 'You can watch right in your PC or iOS web browser, smart TV or internet connected device. If you have questions about how to watch on your device, please visit our',
            SIGN_UP_SUCCESS_LOGIN_LINE2_PART2: 'or call customer support at:',
            SIGN_UP_SUCCESS_LOGIN_FAQS: 'FAQs',
            SIGN_UP_SUCCESS_LOGIN_LINE3: 'Download our FREE app and watch YipTV live on your mobile',
            SIGN_UP_SUCCESS_LOGIN_LINE4: 'Your Premium Membership Includes:',
            SIGN_UP_SUCCESS_LOGIN_BULLET1: '70+ FREE Live International Channels',
            SIGN_UP_SUCCESS_LOGIN_BULLET2: 'More and more channels being added for Premium Members',
            SIGN_UP_SUCCESS_LOGIN_BULLET3: 'Share with family on up to 5 devices',
            SIGN_UP_SUCCESS_LOGIN_BULLET4: 'Refer a friend to Premium Membership and you each get a FREE month of YipTV!',
            SIGN_UP_SUCCESS_LOGIN_QUESTIONS: 'Questions? Call Customer Care at',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_HEADING: 'PROBLEM PROCESSING YOUR PAYMENT',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_LINE1: 'We had a problem processing your credit card information. The good news is that you are now a <span class="bolder-text">Free Member</span> and once you <span class="bolder-text">click on the link in the verification email</span> we sent you, you can start watching live TV for FREE!',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_LINE2: 'To complete your <span class="bolder-text">Premium Membership</span> and get access to 70+ channels, please follow these steps:',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_BULLET1: 'Click the verification link in the email we just sent you',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_BULLET2: 'Login to your account',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_BULLET3: 'Click on the <span class="bolder-text">Upgrade to Premium Membership</span> button',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_LINE3_PART1: 'If you prefer, call Customer Care at:',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_LINE3_PART2: 'and we will be happy to assist you.',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_LOGIN_HEADING: 'PROBLEM PROCESSING YOUR PAYMENT',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_LOGIN_LINE1: 'Sorry, we had a problem processing your credit card information. To complete your <span class="bolder-text">Premium Membership</span> and get access to 70+ channels, please follow these steps:',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_LOGIN_BULLET1: 'Make sure you are <a class="bolder-text" href="/sign-in">Logged In</a> to your account',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_LOGIN_BULLET2: 'Click on the <span class="bolder-text">Upgrade to Premium Membership</span> button an re-submit your Credit card information',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_LOGIN_LINE2_PART1: 'If you prefer, call Customer Care at:',
            SIGN_UP_SUCCESS_PAYMENT_FAILURE_LOGIN_LINE2_PART2: 'and we will be happy to assist you.',
            UPGRADE_SUBSCRIPTION_MESSAGE: 'You are upgrading to a paid account. Your credit card will be charged $14.99 every month. You can cancel your subscription any time by going to Account > Cancel Subscription.',
            UPGRADE_SUBSCRIPTION_BILLING_INFO: 'Enter your credit card details. If you need help call',
            UPGRADE_SUBSCRIPTION_CARD_NAME: 'Name on Credit Card',
            UPGRADE_SUBSCRIPTION_CARD_NAME_REQUIRED: 'Enter name as on your credit card',
            UPGRADE_SUBSCRIPTION_ADDRESS: 'Billing Address',
            UPGRADE_SUBSCRIPTION_ADDRESS_REQUIRED: 'Enter address as on your credit card',
            UPGRADE_SUBSCRIPTION_CITY: 'City',
            UPGRADE_SUBSCRIPTION_CITY_REQUIRED: 'Enter city as on your credit card',
            UPGRADE_SUBSCRIPTION_STATE: 'State',
            UPGRADE_SUBSCRIPTION_STATE_REQUIRED: 'Enter state as on your credit card',
            UPGRADE_SUBSCRIPTION_STATE_LOAD_ERROR: 'Error loading state list',
            UPGRADE_SUBSCRIPTION_STATE_SELECT: 'Select One',
            UPGRADE_SUBSCRIPTION_CARD_NUMBER: 'Credit Card Number',
            UPGRADE_SUBSCRIPTION_CARD_NUMBER_REQUIRED: 'Enter your credit card number',
            UPGRADE_SUBSCRIPTION_CARD_NUMBER_ERROR: 'Enter a valid credit card number',
            UPGRADE_SUBSCRIPTION_CVV: 'CVV (3 digit security code)',
            UPGRADE_SUBSCRIPTION_CVV_REQUIRED: 'Enter your CVV',
            UPGRADE_SUBSCRIPTION_CARD_NUMBER_CVV_ERROR: 'Enter a valid CVV',
            UPGRADE_SUBSCRIPTION_EXPIRY_DATE: 'Expiration Date (MM/YY)',
            UPGRADE_SUBSCRIPTION_EXPIRY_DATE_REQUIRED: 'Enter your card expiration date',
            UPGRADE_SUBSCRIPTION_EXPIRY_DATE_INVALID: 'Enter a valid card expiration date',
            UPGRADE_SUBSCRIPTION_ZIP_CODE: 'Zip Code',
            UPGRADE_SUBSCRIPTION_ZIP_CODE_REQUIRED: 'Enter zip code as on your credit card',
            UPGRADE_SUBSCRIPTION_ZIP_CODE_INVALID: 'Enter a valid zip code',
            UPGRADE_SUBSCRIPTION_CARD_NAME_INVALID: 'Enter a valid name',
            UPGRADE_SUBSCRIPTION_ADDRESS_INVALID: 'Enter a valid address',
            UPGRADE_SUBSCRIPTION_CITY_INVALID: 'Enter a valid city',
            UPGRADE_SUBSCRIPTION_SUBMIT_BUTTON: 'Upgrade',
            UPGRADE_SUBSCRIPTION_FAILED: 'Upgrade subscription failed. Please contact customer support at',
            UPGRADE_SUBSCRIPTION_PAYMENT_FAILED: 'Unable to charge your card. Please check your card details and click "Upgrade" again.',
            UPGRADE_SUBSCRIPTION_PROBLEM: 'Having trouble upgrading? Contact customer support at',
            UPGRADE_SUBSCRIPTION_ACCOUNT_REFRESH_ERROR: 'Please close and re-open the YipTV application browser window',
            UPGRADE_SUBSCRIPTION_ALREADY_UPGRADED: 'Cannot upgrade subscription as you are already a paid user.',
            UPGRADE_SUBSCRIPTION_COMP_ACTIVE_USER: 'Cannot upgrade subscription as you have a complimentary subscription.',
            USER_HOME_OTHER_LANGUAGE: 'Español',
            USER_HOME_SIGN_OUT: 'Sign Out',
            USER_HOME_PROFILE: 'Profile',
            USER_HOME_ACCOUNT: 'Account',
            USER_HOME_PREFERENCES: 'Preferences',
            USER_HOME_CHANGE_PASSWORD: 'Change Password',
            USER_HOME_USER_INFO: 'User Info',
            USER_HOME_UPGRADE_SUBSCRIPTION: 'Upgrade to Premium Membership',
            USER_HOME_CANCEL_SUBSCRIPTION: 'Cancel Subscription',
            USER_HOME_CHANGE_CREDIT_CARD: 'Change Credit Card',
            USER_HOME_UPGRADE_SUBSCRIPTION_SUCCESS: 'Congrats! You have been upgraded to a paid user.',
            USER_HOME_CANCEL_SUBSCRIPTION_CONFIRMATION: 'Are you sure you want to cancel your subscription?',
            USER_HOME_CANCEL_SUBSCRIPTION_SUCCESS: 'Your subscription has been successfully canceled',
            USER_HOME_CANCEL_SUBSCRIPTION_FAILURE: 'Cancel subscription failed. Please contact customer support at',
            USER_HOME_CANCEL_SUBSCRIPTION_ACCOUNT_REFRESH_ERROR: 'Please close and re-open the YipTV application browser window',
            USER_HOME_CANCEL_ON: 'Your YipTV subscription has been canceled. Your service will continue until the end of your current billing cycle ',
            USER_INFO_FIRST_NAME: 'First Name',
            USER_INFO_FIRST_NAME_REQUIRED: 'Enter your first name',
            USER_INFO_LAST_NAME_REQUIRED: 'Enter your last name',
            USER_INFO_FIRST_NAME_INVALID: 'Enter a valid first name',
            USER_INFO_LAST_NAME_INVALID: 'Enter a valid last name',
            USER_INFO_TELEPHONE: 'Phone',
            USER_INFO_TELEPHONE_INVALID: 'Enter a valid US telephone number',
            USER_INFO_TELEPHONE_REQUIRED: 'Enter your telephone number',
            USER_INFO_LAST_NAME: 'Last Name',
            USER_INFO_SUBMIT_BUTTON: 'Update',
            USER_INFO_UPDATE_SUCCESS: 'User information updated successfully',
            USER_INFO_UPDATE_FAILURE: 'Error updating user information',
            USER_INFO_ACCOUNT_REFRESH_ERROR: 'Please close and re-open the YipTV application browser window',
            VERIFY_USER_HEADING_SUCCESS: 'Account Verified',
            VERIFY_USER_HEADING_ERROR: 'Error',
            VERIFY_USER_MESSAGE_SUCCESS: 'Your account has been successfully verified. You can sign into YipTV using the Sign In button above.',
            VERIFY_USER_MESSAGE_ERROR: 'Unable to verify your account or account is already verified. Please contact customer support at',
            WP_URL_FAQS: 'index.php/en/faqs/',
            WP_URL_PRIVACY_POLICY: 'index.php/en/privacy-policy/',
            WP_URL_TOUS: 'index.php/en/terms-of-service/'
        });
    }]);
}(angular.module('app')));
