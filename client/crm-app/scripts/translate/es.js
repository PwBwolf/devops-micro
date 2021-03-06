(function (app) {
    'use strict';

    app.config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('es', {
            CHANGE_PASSWORD_HEADING: 'Cambia Tu Contraseña',
            CHANGE_PASSWORD_CURRENT_PASSWORD: 'Contrasena actual',
            CHANGE_PASSWORD_NEW_PASSWORD: 'Contrasena nueva',
            CHANGE_PASSWORD_CONFIRM_PASSWORD: 'Confirme contrasena nueva',
            CHANGE_PASSWORD_BUTTON: 'Presentar',
            CHANGE_PASSWORD_CURRENT_PASSWORD_REQUIRED: 'Introduzca su contrasena actual',
            CHANGE_PASSWORD_NEW_PASSWORD_REQUIRED: 'Introduzca contrasena nueva',
            CHANGE_PASSWORD_NEW_PASSWORD_NOT_COMPLEX: 'Contrasena debe tener al menos 6 caracteres, 1 letra mayuscula y 1 numero',
            CHANGE_PASSWORD_NEW_PASSWORD_SAME: 'Contrasena nueva no puede ser la misma contrasena actual',
            CHANGE_PASSWORD_CONFIRM_PASSWORD_REQUIRED: 'Confirme su contrasena',
            CHANGE_PASSWORD_CONFIRM_PASSWORD_NO_MATCH: 'Contrasenas no coinciden',
            CHANGE_PASSWORD_ERROR: 'Se produjo un error al cambiar la contrasena',
            CHANGE_PASSWORD_INCORRECT_PASSWORD: 'Contrasena introducida es incorrecta',
            CHANGE_PASSWORD_SUCCESS: 'Su contrasena ha sido cambiada con exito',
            INDEX_TOP: 'Superior ^',
            INDEX_OTHER_LANGUAGE: 'English',
            INDEX_SIGN_OUT: 'Desconectar',
            INDEX_OK_BUTTON: 'Okay',
            INDEX_YES_BUTTON: 'Sí',
            INDEX_NO_BUTTON: 'No',
            INDEX_COPYRIGHT: 'Derechos de Autor ® 2012-2016 YIPTV. Uso de el servicio de YIPTV y de esta pagina web constituye aceptación de nuestros términos de uso y póliza de privacidad.',
            MAIN_ERROR_APP_CONFIG: 'Error frente configuracion de la aplicacion',
            MAIN_SIGN_OUT_CONFIRMATION: 'Seguro que deseas salir de YipTV?',
            MAIN_LANGUAGE_CHANGE_SAVE_CHECK: 'Desea cambiar su idioma preferido a',
            MAIN_LANGUAGE_CHANGE_SAVE_SUCCESS: 'Preferencia de idioma guardado con exito',
            MAIN_LANGUAGE_CHANGE_SAVE_ERROR: 'Error al cambiar su preferencia de idioma. Por favor pongase en contacto con servicio al cliente',
            NOT_FOUND_HEADING: 'Pagina no disponible',
            NOT_FOUND_MESSAGE: 'La pagina que usted busca no existe',
            SIGN_IN_HEADING: 'YipTV CRM',
            SIGN_IN_EMAIL: 'Dirección de correo electrónico',
            SIGN_IN_EMAIL_REQUIRED: 'Introduzca su direccion de correo electronico',
            SIGN_IN_EMAIL_INVALID: 'Introduzca una dirreccion de correo electronico valida',
            SIGN_IN_PASSWORD: 'Contraseña',
            SIGN_IN_PASSWORD_REQUIRED: 'Introduzca su contrasena',
            SIGN_IN_SUBMIT_BUTTON: 'Iniciar sesion',
            SIGN_IN_FAILED: 'Ingresa fracasada',
            USER_HOME_HEADING: 'Bienvenido a YipTV CRM',
            USER_HOME_MANAGE_CRM_USERS: 'Administrar usuarios de CRM',
            USER_HOME_MANAGE_SUBSCRIBERS: 'Administrar Suscriptores',
            USER_HOME_REPORTS: 'Ver Informes',
            USER_HOME_CHANGE_MY_PASSWORD: 'Cambiar Mi Contraseña',
            USER_HOME_MANAGE_CHANNELS: 'Administración de Canales'
        });
    }]);
}(angular.module('app')));
