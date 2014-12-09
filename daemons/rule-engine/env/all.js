var path = require('path');
var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
    root: rootPath,
    email: {
        host: 'mail.yiptv.com',
        port: 587,
        user: 'noreply',
        password: 'Sept_25*',
        fromEmail: 'noreply@yiptv.com',
        fromName: 'YipTV'
    },
    factProviders: {},
    postProcessors: {},
    reminderEmailSubject: {
        en: 'Your YipTV subscription ends {0}!',
        es: 'SYour YipTV subscription ends {0}!'
    },
    reminderEmailBody: {
        en: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#e4e7ea; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f2f2f2"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png"/></td><td><span style="font-weight:bold;font-size:36px;vertical-align:middle;font-family:Verdana">YipTV</span></td></tr></table> </td></tr><tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1}{2},</p><br/> <p>We sincerely hope that you have been enjoying YipTV\'s premium channels for the {3}. We would like to take this opportunity to thank you again for signing up with us. </p><p>We are also pleased to bring to you our <b><i>Refer A Friend</i></b> program where you can earn free months when you refer your friends to join YipTV!<sup>*</sup></p></td></tr><tr style="background-color:#eeeeee"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br/><br/> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p></td></tr></table> </td></tr></table>',
        es: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#e4e7ea; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f2f2f2"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png"/></td><td><span style="font-weight:bold;font-size:36px;vertical-align:middle;font-family:Verdana">YipTV</span></td></tr></table> </td></tr><tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1}{2},</p><br/> <p>SWe sincerely hope that you have been enjoying YipTV\'s premium channels for the {3}. We would like to take this opportunity to thank you again for signing up with us. </p><p>SWe are also pleased to bring to you our <b><i>Refer A Friend</i></b> program where you can earn free months when you refer your friends to join YipTV!<sup>*</sup></p></td></tr><tr style="background-color:#eeeeee"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> SPlease do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br/><br/> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p></td></tr></table> </td></tr></table>'
    }
};
