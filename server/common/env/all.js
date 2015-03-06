'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
    root: rootPath,
    email: {
        host: 'smtp.office365.com',
        port: 587,
        user: 'noreply@yiptv.com',
        password: 'Sept_25*',
        fromEmail: 'noreply@yiptv.com',
        fromName: 'YipTV'
    },
    factProviders: {},
    postProcessors: {},
    freePreviewTime: 120000,
    dummyCreditCard: '4242424242424242',
    contactUsEmailSubject: 'New Contact Us Request',
    contactUsEmailBody: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>New Contact Us Request</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="font-weight: bold">Name:</td> <td>{1}</td> </tr> <tr> <td style="font-weight: bold">Email:</td> <td>{2}</td> </tr> <tr> <td style="font-weight: bold">Telephone:&nbsp;</td> <td>{3}</td> </tr> <tr> <td style="font-weight: bold">Country:</td> <td>{4}</td> </tr> <tr> <td style="font-weight: bold">Interest:</td> <td>{5}</td> </tr> <tr> <td valign="top" style="font-weight: bold;vertical-align: text-top">Details:</td> <td>{6}</td> </tr> </table> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>',
    accountVerificationEmailSubject: {
        en: 'Welcome to YipTV',
        es: 'Bienvenido a YipTV'
    },
    accountVerificationEmailBody: {
        en: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>Welcome to YipTV. Please verify your YipTV account by clicking the button below. You will be able to use YipTV only after verifying your account. All future notifications will be sent to this email address.</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;color:#fff" href="{3}">Verify Account</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>Or click the link below:</p> <p><a href="{3}">{3}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>',
        es: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>Bienvenido a YipTV. Verifique su cuenta de YipTV haciendo clic en el botón debajo. Podrá usar YipTV solo después de verificar su cuenta. Todas las notificaciones futuras se enviarán a esta dirección de correo electrónico.</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;color:#fff" href="{3}">Verificar cuenta</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>O haga clic en el siguiente enlace:</p> <p><a href="{3}">{3}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> No responda este mensaje; se envió desde una dirección de correo electrónico no supervisada. Este es un mensaje de correo electrónico de servicio relacionado con su uso de YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>'
    },
    forgotPasswordEmailSubject: {
        en: 'Reset Password',
        es: 'Restablecer contraseña'
    },
    forgotPasswordEmailBody: {
        en: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>We received a request to reset the password for your account. If you made this request, click the button below. If you did not make this request you can ignore this email.</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;color:#fff" href="{3}">Reset Password</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>Or click the link below:</p> <p><a href="{3}">{3}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>',
        es: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>Recibimos una solicitud para restablecer la contraseña de su cuenta. Si realizó esta solicitud, haga clic en el siguiente botón. Si no realizó esta solicitud, puede ignorar este mensaje de correo electrónico.</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;color:#fff" href="{3}">Restablecer contraseña</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>O haga clic en el siguiente enlace:</p> <p><a href="{3}">{3}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> No responda este mensaje; se envió desde una dirección de correo electrónico no supervisada. Este es un mensaje de correo electrónico de servicio relacionado con su uso de YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>'
    },
    passwordChangedEmailSubject: {
        en: 'Password Changed',
        es: 'Contraseña cambiada'
    },
    passwordChangedEmailBody: {
        en: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>You recently changed the password associated with your YipTV account. If you did not make this change and believe your YipTV account has been compromised, please contact YipTV customer care.</p> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>',
        es: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>Recientemente cambió la contraseña asociada a su cuenta de YipTV. Si no realizó este cambio y cree que su cuenta de YipTV ha sido pirateada, comuníquese con el servicio de atención al cliente de YipTV.</p> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> No responda este mensaje; se envió desde una dirección de correo electrónico no supervisada. Este es un mensaje de correo electrónico de servicio relacionado con su uso de YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>'
    },
    referAFriendEmailSubject: 'YipTV is here!',
    referAFriendEmailBody: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>Hello,</p><br /> <p>I have subscribed to YipTV and I get unlimited TV channels for $14.99. Click the button below to join YipTV now!</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;color:#fff" href="{1}">Join YipTV</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>Or click the link below:</p> <p><a href="{1}">{1}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>',
    reminderEmailSubject: {
        en: 'Your YipTV free trial ends in {0} days!',
        es: '¡Su prueba gratuita de YipTV finaliza en {0} días!'
    },
    reminderEmailBody: {
        en: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>We sincerely hope that you have been enjoying YipTV\'s premium channels for the last {3} days. We would like to take this opportunity to thank you again for signing up with us. </p> <p>Pay a flat $14.99/mo and become a YipTV paid subscriber today to watch all YipTV channels! Click the button below to upgrade now!</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;cursor:pointer;color:#fff" href="{4}">Upgrade</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>Or click the link below:</p> <p><a href="{4}">{4}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>',
        es: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>Sinceramente esperamos que haya disfrutado de los canales premium de YipTV en los últimos {3} días. Nos gustaría aprovechar esta oportunidad para agradecerle nuevamente por haberse registrado con nosotros.</p> <p>Pague una tarifa fija de $14.99/mes y conviértase en un abonado de YipTV hoy mismo para poder disfrutar de todos los canales de YipTV. Haga clic en el botón debajo para actualizar su servicio ahora mismo.</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;cursor:pointer;color:#fff" href="{4}">Actualizar</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>O haga clic en el siguiente enlace:</p> <p><a href="{4}">{4}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> No responda este mensaje; se envió desde una dirección de correo electrónico no supervisada. Este es un mensaje de correo electrónico de servicio relacionado con su uso de YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>'
    },
    lastReminderEmailSubject: {
        en: 'Your YipTV free trial ends today!',
        es: '¡Su prueba gratuita de YipTV finaliza hoy!'
    },
    lastReminderEmailBody: {
        en: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>We sincerely hope that you have been enjoying YipTV\'s premium channels for the last 30 days. We would like to take this opportunity to thank you again for signing up with us. </p> <p>Pay a flat $14.99/mo and become a YipTV paid subscriber today to watch all YipTV channels! Click the button below to upgrade now!</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;cursor:pointer;color:#fff" href="{3}">Upgrade</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>Or click the link below:</p> <p><a href="{3}">{3}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>',
        es: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>Sinceramente esperamos que haya disfrutado de los canales premium de YipTV en los últimos 30 días. Nos gustaría aprovechar esta oportunidad para agradecerle nuevamente por haberse registrado con nosotros.</p> <p>Pague una tarifa fija de $14.99/mes y conviértase en un abonado de YipTV hoy mismo para poder disfrutar de todos los canales de YipTV. Haga clic en el botón debajo para actualizar su servicio ahora mismo.</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;cursor:pointer;color:#fff" href="{3}">Actualizar</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>O haga clic en el siguiente enlace:</p> <p><a href="{3}">{3}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> No responda este mensaje; se envió desde una dirección de correo electrónico no supervisada. Este es un mensaje de correo electrónico de servicio relacionado con su uso de YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>'
    },
    trialPeriodCompleteEmailSubject: {
        en: 'Your YipTV free trial has ended!',
        es: '¡Su prueba gratuita de YipTV ha finalizado!'
    },
    trialPeriodCompleteEmailBody: {
        en: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>Your YipTV free trial has ended! You can watch all YipTV channels for $14.99/mo. Click button below to upgrade now!</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;cursor:pointer;color:#fff" href="{3}">Upgrade</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>Or click the link below:</p> <p><a href="{3}">{3}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>',
        es: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>Su prueba gratuita de YipTV ha finalizado. Puede ver todos los canales de YipTV por $14.99/mes. Haga clic en el botón debajo para actualizar su servicio ahora mismo.</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;cursor:pointer;color:#fff" href="{3}">Actualizar</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>O haga clic en el siguiente enlace:</p> <p><a href="{3}">{3}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> No responda este mensaje; se envió desde una dirección de correo electrónico no supervisada. Este es un mensaje de correo electrónico de servicio relacionado con su uso de YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>'
    },
    reacquireUserEmailSubject: {
        en: 'We miss you at YipTV!',
        es: '¡Lo extrañamos en YipTV!'
    },
    reacquireUserEmailBody: {
        en: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png"/></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br/> <p>Your YipTV free trial ended yesterday and we miss you already! You can upgrade to a paid account by paying $14.99/mo and watch all YipTV channels. Click button below to upgrade now! </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;cursor:pointer;color:#fff" href="{3}">Upgrade</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>Or click the link below:</p> <p><a href="{3}">{3}</a></p><br/> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br/><br/> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>',
        es: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png"/></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br/> <p>¡Su prueba gratuita de YipTV finalizó ayer y ya lo extrañamos! Puede actualizar su servicio a una cuenta de prepago abonando $14.99/mes y disfrutar de todos los canales de YipTV. Haga clic en el botón debajo para actualizar su servicio ahora mismo. </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;cursor:pointer;color:#fff" href="{3}">Actualizar</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>O haga clic en el siguiente enlace:</p> <p><a href="{3}">{3}</a></p><br/> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> No responda este mensaje; se envió desde una dirección de correo electrónico no supervisada. Este es un mensaje de correo electrónico de servicio relacionado con su uso de YipTV. <br/><br/> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>'
    },
    cancellationNextDayEmailSubject : {
        en: 'We miss you at YipTV!',
        es: '¡Lo extrañamos en YipTV!'
    },
    cancellationNextDayEmailBody: {
        en: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png"/></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br/> <p>Your YipTV Subscription was cancelled yesterday and we miss you already! You can re-activate your account by clicking the button below. </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;cursor:pointer;color:#fff" href="{3}">Re-activate Subscription</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>Or click the link below:</p> <p><a href="{3}">{3}</a></p><br/> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of YipTV. <br/><br/> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>',
        es: '<table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; width:100%;height:100%"> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;color:#000;width:80%;font-size:14px;font-family:Verdana"> <tr style="background-color:#f4f1ec"> <td style="padding:10px"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td><img width="87" height="80" style="vertical-align:middle" title="YipTV" alt="YipTV" src="{0}logo.png" /></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>{1} {2},</p><br /> <p>Su suscripcion de YipTV fue cancelada ayer y lo extranamos! Usted puede reactivar su suscripcion haciendo clic en el boton de abajo.</p> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding:10px;border-radius:5px;border:1px solid #A03269;background-color:#A03269;font-family:Verdana;font-weight:bold"><a style="display:inline-block;text-decoration:none;color:#fff" href="{3}">Reactivar Suscripcion</a></td> </tr> </table> </td> </tr> <tr> <td style="width:90%;padding:20px 50px;color: #000;font-size:14px;font-family:Verdana;text-align:justify"> <p>O haga clic en el siguiente enlace:</p> <p><a href="{3}">{3}</a></p><br /> </td> </tr> <tr style="background-color:#f4f1ec"> <td align="center" style="padding:20px;font-family:Verdana;font-size: 12px"> No responda este mensaje; se envió desde una dirección de correo electrónico no supervisada. Este es un mensaje de correo electrónico de servicio relacionado con su uso de YipTV. <br /><br /> <p style="color:#808080">YipTV Inc., West Palm Beach, FL, USA</p> </td> </tr> </table> </td> </tr></table>'
    }
};
