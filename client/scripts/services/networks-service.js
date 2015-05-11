(function (app) {
    'use strict';

    app.factory('networksSvc', [function () {
        var networks = [
            {networkName: 'beIN Sports', networkId: 'images/channels-small/bein-sports.png', networkImage: 'images/channels-big/bein-sports.png', networkAlt: 'NETWORKS_BEIN_SPORTS', networkDescription1: 'NETWORKS_BEIN_SPORTS_DESC', networkDescription2: 'NETWORKS_BEIN_SPORTS_DESC_1', networkDescription3: 'NETWORKS_BEIN_SPORTS_DESC_2'},
            {networkName: 'beIN Sports Espanol', networkId: 'images/channels-small/bein-sports-espanol.png', networkImage: 'images/channels-big/bein-sports-espanol.png', networkAlt: 'NETWORKS_BEIN_SPORTS_ES', networkDescription1: 'NETWORKS_BEIN_SPORTS_ES_DESC', networkDescription2: 'NETWORKS_BEIN_SPORTS_ES_DESC_1', networkDescription3: 'NETWORKS_BEIN_SPORTS_ES_DESC_2'},
            {networkName: 'Canal Sur', networkId: 'images/channels-small/canal-sur.png', networkImage: 'images/channels-big/canal-sur.png', networkAlt: '', networkDescription1: 'NETWORKS_CANAL_SUR_DESC', networkDescription2: 'NETWORKS_CANAL_SUR_DESC_1'},
            {networkName: 'Maya TV', networkId: 'images/channels-small/maya-tv.png', networkImage: 'images/channels-big/maya-tv.png', networkAlt: '', networkDescription1: 'NETWORKS_MAYA_TV_DESC'},
            {networkName: 'Clubbing TV', networkId: 'images/channels-small/clubbing-tv.png', networkImage: 'images/channels-big/clubbing-tv.png', networkAlt: '', networkDescription1: 'NETWORKS_CLUBBING_TV_DESC'},
            {networkName: 'TyC Sports', networkId: 'images/channels-small/tyc-sports.png', networkImage: 'images/channels-big/tyc-sports.png', networkAlt: '', networkDescription1: 'NETWORKS_TYC_SPORTS_DESC', networkDescription2: 'NETWORKS_TYC_SPORTS_DESC_1', networkDescription3: 'NETWORKS_TYC_SPORTS_DESC_2', networkDescription4: 'NETWORKS_TYC_SPORTS_DESC_3'},
            {networkName: 'NTN 24', networkId: 'images/channels-small/ntn-24.png', networkImage: 'images/channels-big/ntn-24.png', networkAlt: '', networkDescription1: 'NETWORKS_NTN_24_DESC', networkDescription2: 'NETWORKS_NTN_24_DESC_1', networkDescription3: 'NETWORKS_NTN_24_DESC_2'},
            {networkName: 'Video Rola', networkId: 'images/channels-small/video-rola.png', networkImage: 'images/channels-big/video-rola.png', networkAlt: '', networkDescription1: 'NETWORKS_VIDEO_ROLA_DESC', networkDescription2: 'NETWORKS_VIDEO_ROLA_DESC_1'},
            {networkName: 'Canal America', networkId: 'images/channels-small/canal-america.png', networkImage: 'images/channels-big/canal-america.png', networkAlt: '', networkDescription1: 'NETWORKS_CANAL_AMER_DESC', networkDescription2: 'NETWORKS_CANAL_AMER_DESC_1', networkDescription3: 'NETWORKS_CANAL_AMER_DESC_2', networkDescription4: 'NETWORKS_CANAL_AMER_DESC_3'},
            {networkName: 'AZ Clic', networkId: 'images/channels-small/az-click.png', networkImage: 'images/channels-big/az-click.png', networkAlt: '', networkDescription1: 'NETWORKS_AZ_CLIC_DESC', networkDescription2: 'NETWORKS_AZ_CLIC_DESC_1', networkDescription3: 'NETWORKS_AZ_CLIC_DESC_2'},
            {networkName: 'AZCorazon', networkId: 'images/channels-small/az-corazon.png', networkImage: 'images/channels-big/az-corazon.png', networkAlt: '', networkDescription1: 'NETWORKS_AZ_CORAZON_DESC', networkDescription2: 'NETWORKS_AZ_CORAZON_DESC_1', networkDescription3: 'NETWORKS_AZ_CORAZON_DESC_2'},
            {networkName: 'RT Espanol', networkId: 'images/channels-small/rt-espanol.png', networkImage: 'images/channels-big/rt-espanol.png', networkAlt: '', networkDescription1: 'NETWORKS_RT_ES_DESC', networkDescription2: 'NETWORKS_RT_ES_DESC_1'},
            {networkName: 'RT News – English', networkId: 'images/channels-small/rt.png', networkImage: 'images/channels-big/rt.png', networkAlt: '', networkDescription1: 'NETWORKS_RT_DESC', networkDescription2: 'NETWORKS_RT_DESC_1'},
            {networkName: 'Tele Antioquia', networkId: 'images/channels-small/tele-antiquioa.png', networkImage: 'images/channels-big/tele-antiquioa.png', networkAlt: '', networkDescription1: 'NETWORKS_TELE_ANT_DESC', networkDescription2: 'NETWORKS_TELE_ANT_DESC_1'},
            {networkName: 'Canal Antiestres', networkId: 'images/channels-small/canal-antiestres.png', networkImage: 'images/channels-big/canal-antiestres.png', networkAlt: '', networkDescription1: 'NETWORKS_CANAL_ANT_DESC', networkDescription2: 'NETWORKS_CANAL_ANT_DESC_1', networkDescription3: 'NETWORKS_CANAL_ANT_DESC_2'},
            {networkName: 'Tele Caribe', networkId: 'images/channels-small/tele-caribe.png', networkImage: 'images/channels-big/tele-caribe.png', networkAlt: '', networkDescription1: 'NETWORKS_TELE_CARIBE_DESC', networkDescription2: 'NETWORKS_TELE_CARIBE_DESC_1'},
            {networkName: 'El Cantinazo ', networkId: 'images/channels-small/cantinazo.png', networkImage: 'images/channels-big/cantinazo.png', networkAlt: '', networkDescription1: 'NETWORKS_EL_CANTINAZO_DESC', networkDescription2: 'NETWORKS_EL_CANTINAZO_DESC_1'},
            {networkName: 'Canal Tiempo', networkId: 'images/channels-small/et-canal-tiempo.png', networkImage: 'images/channels-big/et-canal-tiempo.png', networkAlt: '', networkDescription1: 'NETWORKS_CANAL_TIEMPO_DESC', networkDescription2: 'NETWORKS_CANAL_TIEMPO_DESC_1'},
            {networkName: 'Cosmovision', networkId: 'images/channels-small/cosmo-vision.png', networkImage: 'images/channels-big/cosmo-vision.png', networkAlt: 'www.cosmovision.tv', networkDescription1: 'NETWORKS_COSMOVISION_DESC', networkDescription2: 'NETWORKS_COSMOVISION_DESC_1'},
            {networkName: 'Canal TRo', networkId: 'images/channels-small/canal-tro.png', networkImage: 'images/channels-big/canal-tro.png', networkAlt: '', networkDescription1: 'NETWORKS_CANAL_TRO_DESC', networkDescription2: 'NETWORKS_CANAL_TRO_DESC_1', networkDescription3: 'NETWORKS_CANAL_TRO_DESC_2'},
            {networkName: 'TELESUR', networkId: 'images/channels-small/tele-sur.png', networkImage: 'images/channels-big/tele-sur.png', networkAlt: '', networkDescription1: 'NETWORKS_TELE_SUR_DESC', networkDescription2: 'NETWORKS_TELE_SUR_DESC_1', networkDescription3: 'NETWORKS_TELE_SUR_DESC_2'},
            {networkName: 'TVC LATINO', networkId: 'images/channels-small/tvc-latino.png', networkImage: 'images/channels-big/tvc-latino.png', networkAlt: '', networkDescription1: 'NETWORKS_TV_LATINO_DESC', networkDescription2: 'NETWORKS_TV_LATINO_DESC_1', networkDescription3: 'NETWORKS_TV_LATINO_DESC_2'},
            {networkName: 'TV Quisqueya', networkId: 'images/channels-small/tv-quisqueya.png', networkImage: 'images/channels-big/tv-quisqueya.png', networkAlt: '', networkDescription1: 'NETWORKS_TV_QUISQUEYA_DESC', networkDescription2: 'NETWORKS_TV_QUISQUEYA_DESC_1'},
            {networkName: 'Destinos TV', networkId: 'images/channels-small/destino.png', networkImage: 'images/channels-big/destino.png', networkAlt: '', networkDescription1: 'NETWORKS_DESTINOS_TV_DESC', networkDescription2: 'NETWORKS_DESTINOS_TV_DESC_1'},
            {networkName: 'TELE PACIFICO', networkId: 'images/channels-small/tele-pacifico.png', networkImage: 'images/channels-big/tele-pacifico.png', networkAlt: '', networkDescription1: 'NETWORKS_TELE_PACIFICO_DESC', networkDescription2: 'NETWORKS_TELE_PACIFICO_DESC_1', networkDescription3: 'NETWORKS_TELE_PACIFICO_DESC_2'},
            {networkName: 'Tele Formula', networkId: 'images/channels-small/tele-formula.png', networkImage: 'images/channels-big/tele-formula.png', networkAlt: '', networkDescription1: 'NETWORKS_TELE_FORMULA_DESC', networkDescription2: 'NETWORKS_TELE_FORMULA_DESC_1', networkDescription3: 'NETWORKS_TELE_FORMULA_DESC_2'},
            {networkName: 'TELE MEDELLIN', networkId: 'images/channels-small/medellin.png', networkImage: 'images/channels-big/medellin.png', networkAlt: '', networkDescription1: 'NETWORKS_TELE_MEDELLIN_DESC', networkDescription2: 'NETWORKS_TELE_MEDELLIN_DESC_1'},
            {networkName: 'MeioNorte', networkId: 'images/channels-small/meionorte.png', networkImage: 'images/channels-big/meionorte.png', networkAlt: '', networkDescription1: 'NETWORKS_MEIO_NORTE_DESC', networkDescription2: 'NETWORKS_MEIO_NORTE_DESC_1'},
            {networkName: 'YES', networkId: 'images/channels-small/yes.png', networkImage: 'images/channels-big/yes.png', networkAlt: '', networkDescription1: 'NETWORKS_YES_DESC', networkDescription2: 'NETWORKS_YES_DESC_1', networkDescription3: 'NETWORKS_YES_DESC_2', networkDescription4: 'NETWORKS_YES_DESC_3', networkDescription5: 'NETWORKS_YES_DESC_4'},
            {networkName: 'ZOOM', networkId: 'images/channels-small/zoom.png', networkImage: 'images/channels-big/zoom.png', networkAlt: '', networkDescription1: 'NETWORKS_ZOOM_DESC', networkDescription2: 'NETWORKS_ZOOM_DESC_1', networkDescription3: 'NETWORKS_ZOOM_DESC_2'},
            {networkName: 'Mi Gente', networkId: 'images/channels-small/mi-gente-tv.png', networkImage: 'images/channels-big/mi-gente-tv.png', networkAlt: '', networkDescription1: 'NETWORKS_MIGENTE_DESC', networkDescription2: 'NETWORKS_MIGENTE_DESC_1'},
            {networkName: 'JBN', networkId: 'images/channels-small/jbn.png', networkImage: 'images/channels-big/jbn.png', networkAlt: '', networkDescription1: 'NETWORKS_JBN_DESC', networkDescription2: 'NETWORKS_JBN_DESC_1', networkDescription3: 'NETWORKS_JBN_DESC_2'}
        ];

        var networkClasses = [
            {className: 'off'},
            {className: 'on'},
            {className: 'front'},
            {className: 'back'}
        ];

        return {
            getNetworks: function () {
                return networks;
            },

            getNetworkClasses: function () {
                return networkClasses;
            }
        };
    }]);
}(angular.module('app')));
