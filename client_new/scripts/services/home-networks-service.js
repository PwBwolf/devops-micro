(function (app) {
    'use strict';

    app.factory('homeNetworksSvc', [function () {
        var usrNtwrks = [
            {ntwrkNm: 'beIN Sports', ntwrkID: 'img/chnl_logos/live-tv-bein-sports.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0032_beIN-n.png', ntwrkAlt: 'NETWORKS_BEIN_SPORTS', ntwrkDesc: 'NETWORKS_BEIN_SPORTS_DESC', ntwrkDesc_1: 'NETWORKS_BEIN_SPORTS_DESC_1', ntwrkDesc_2: 'NETWORKS_BEIN_SPORTS_DESC_2'},
            {ntwrkNm: 'beIN Sports Espanol', ntwrkID: 'img/chnl_logos/live-tv-bein-sports-e.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0032_beIN-n.png', ntwrkAlt: 'NETWORKS_BEIN_SPORTS_ES', ntwrkDesc: 'NETWORKS_BEIN_SPORTS_ES_DESC', ntwrkDesc_1: 'NETWORKS_BEIN_SPORTS_ES_DESC_1', ntwrkDesc_2: 'NETWORKS_BEIN_SPORTS_ES_DESC_2'},
            {ntwrkNm: 'Canal Sur', ntwrkID: 'img/chnl_logos/live-tv-canal-sur.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0026_canal-sur.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_CANAL_SUR_DESC', ntwrkDesc_1: 'NETWORKS_CANAL_SUR_DESC_1'},
            {ntwrkNm: 'Maya TV', ntwrkID: 'img/chnl_logos/live-tv-maya-tv.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0019_maya-tv.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_MAYA_TV_DESC'},
            {ntwrkNm: 'Clubbing TV', ntwrkID: 'img/chnl_logos/live-tv-clubbing-tv.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0023_clubbing-tv.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_CLUBBING_TV_DESC'},
            {ntwrkNm: 'TyC Sports', ntwrkID: 'img/chnl_logos/live-tv-tyc-sports.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0005_tyc-sports.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_TYC_SPORTS_DESC', ntwrkDesc_1: 'NETWORKS_TYC_SPORTS_DESC_1', ntwrkDesc_2: 'NETWORKS_TYC_SPORTS_DESC_2', ntwrkDesc_3: 'NETWORKS_TYC_SPORTS_DESC_3'},
            {ntwrkNm: 'NTN 24', ntwrkID: 'img/chnl_logos/live-tv-ntn24.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0016_NTN24.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_NTN_24_DESC', ntwrkDesc_1: 'NETWORKS_NTN_24_DESC_1', ntwrkDesc_2: 'NETWORKS_NTN_24_DESC_2'},
            {ntwrkNm: 'Video Rola', ntwrkID: 'img/chnl_logos/live-tv-video-rola.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0004_Layer-1.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_VIDEO_ROLA_DESC', ntwrkDesc_1: 'NETWORKS_VIDEO_ROLA_DESC_1'},
            {ntwrkNm: 'Canal America', ntwrkID: 'img/chnl_logos/live-tv-america.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0028_America.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_CANAL_AMER_DESC', ntwrkDesc_1: 'NETWORKS_CANAL_AMER_DESC_1', ntwrkDesc_2: 'NETWORKS_CANAL_AMER_DESC_2', ntwrkDesc_3: 'NETWORKS_CANAL_AMER_DESC_3'},
            {ntwrkNm: 'AZ Clic', ntwrkID: 'img/chnl_logos/live-tv-azclick.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0031_azclick.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_AZ_CLIC_DESC', ntwrkDesc_1: 'NETWORKS_AZ_CLIC_DESC_1', ntwrkDesc_2: 'NETWORKS_AZ_CLIC_DESC_2'},
            {ntwrkNm: 'AZCorazon', ntwrkID: 'img/chnl_logos/live-tv-az-corazon.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0030_AZ-Corazon.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_AZ_CORAZON_DESC', ntwrkDesc_1: 'NETWORKS_AZ_CORAZON_DESC_1', ntwrkDesc_2: 'NETWORKS_AZ_CORAZON_DESC_2'},
            {ntwrkNm: 'RT Espanol', ntwrkID: 'img/chnl_logos/live-tv-rt-espaniol.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0014_RT-Esp.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_RT_ES_DESC', ntwrkDesc_1: 'NETWORKS_RT_ES_DESC_1'},
            {ntwrkNm: 'RT News – English', ntwrkID: 'img/chnl_logos/live-tv-rt.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0015_rt.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_RT_DESC', ntwrkDesc_1: 'NETWORKS_RT_DESC_1'},
            {ntwrkNm: 'Tele Antioquia', ntwrkID: 'img/chnl_logos/live-tv-tele-antiquia.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0013_teleantiquioa.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_TELE_ANT_DESC', ntwrkDesc_1: 'NETWORKS_TELE_ANT_DESC_1'},
            {ntwrkNm: 'Canal Antiestres', ntwrkID: 'img/chnl_logos/live-tv-canal-antiestres.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0027____-Canal-Antiestres-.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_CANAL_ANT_DESC', ntwrkDesc_1: 'NETWORKS_CANAL_ANT_DESC_1', ntwrkDesc_2: 'NETWORKS_CANAL_ANT_DESC_2'},
            {ntwrkNm: 'Tele Caribe', ntwrkID: 'img/chnl_logos/live-tv-telecarib.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0012_telecarib.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_TELE_CARIBE_DESC', ntwrkDec_1: 'NETWORKS_TELE_CARIBE_DESC_1'},
            {ntwrkNm: 'El Cantinazo ', ntwrkID: 'img/chnl_logos/live-tv-cantinanzo.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0024_cantinazo.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_EL_CANTINAZO_DESC', ntwrkDesc_1: 'NETWORKS_EL_CANTINAZO_DESC_1'},
            {ntwrkNm: 'Canal Tiempo', ntwrkID: 'img/chnl_logos/live-tv-et-canal-tempo.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0029_ET-Cnal-Tempo.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_CANAL_TIEMPO_DESC', ntwrkDesc_1: 'NETWORKS_CANAL_TIEMPO_DESC_1'},
            {ntwrkNm: 'Cosmovision', ntwrkID: 'img/chnl_logos/live-tv-cosmovision.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0022_cosmovision.png', ntwrkAlt: 'www.cosmovision.tv', ntwrkDesc: 'NETWORKS_COSMOVISION_DESC', ntwrkDesc_1: 'NETWORKS_COSMOVISION_DESC_1'},
            {ntwrkNm: 'Canal TRo', ntwrkID: 'img/chnl_logos/live-tv-canal-tro.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0025_canal-tro.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_CANAL_TRO_DESC', ntwrkDesc_1: 'NETWORKS_CANAL_TRO_DESC_1', ntwrkDesc_2: 'NETWORKS_CANAL_TRO_DESC_2'},
            {ntwrkNm: 'TELESUR', ntwrkID: 'img/chnl_logos/live-tv-telesur.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0009_Telesur.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_TELE_SUR_DESC', ntwrkDesc_1: 'NETWORKS_TELE_SUR_DESC_1', ntwrkDesc_2: 'NETWORKS_TELE_SUR_DESC_2'},
            {ntwrkNm: 'TVC LATINO', ntwrkID: 'img/chnl_logos/live-tv-tvc-latino.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0006_tvc-latino.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_TV_LATINO_DESC', ntwrkDesc_1: 'NETWORKS_TV_LATINO_DESC_1', ntwrkDesc_2: 'NETWORKS_TV_LATINO_DESC_2'},
            {ntwrkNm: 'TV Quisqueya', ntwrkID: 'img/chnl_logos/live-tv-tv-quisqueya.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0007_Quisqueya.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_TV_QUISQUEYA_DESC', ntwrkDesc_1: 'NETWORKS_TV_QUISQUEYA_DESC_1'},
            {ntwrkNm: 'Destinos TV', ntwrkID: 'img/chnl_logos/live-tv-destino.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0021_Destino.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_DESTINOS_TV_DESC', ntwrkDesc_1: 'NETWORKS_DESTINOS_TV_DESC_1'},
            {ntwrkNm: 'TELE PACIFICO', ntwrkID: 'img/chnl_logos/live-tv-telepacirco.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0010_telepacirco.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_TELE_PACIFICO_DESC', ntwrkDesc_1: 'NETWORKS_TELE_PACIFICO_DESC_1', ntwrkDesc_2: 'NETWORKS_TELE_PACIFICO_DESC_2'},
            {ntwrkNm: 'Tele Formula', ntwrkID: 'img/chnl_logos/live-tv-teleformula.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0000_Layer-3.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_TELE_FORMULA_DESC', ntwrkDesc_1: 'NETWORKS_TELE_FORMULA_DESC_1', ntwrkDesc_2: 'NETWORKS_TELE_FORMULA_DESC_2'},
            {ntwrkNm: 'TELE MEDELLIN', ntwrkID: 'img/chnl_logos/live-tv-medellin.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0011_medellin.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_TELE_MEDELLIN_DESC', ntwrkDesc_1: 'NETWORKS_TELE_MEDELLIN_DESC_1'},
            {ntwrkNm: 'MeioNorte', ntwrkID: 'img/chnl_logos/live-tv-meinorte.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0018_meinorte.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_MEIO_NORTE_DESC', ntwrkDesc_1: 'NETWORKS_MEIO_NORTE_DESC_1'},
            {ntwrkNm: 'YES', ntwrkID: 'img/chnl_logos/live-tv-yes.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0003_yes.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_YES_DESC', ntwrkDesc_1: 'NETWORKS_YES_DESC_1', ntwrkDesc_2: 'NETWORKS_YES_DESC_2', ntwrkDesc_3: 'NETWORKS_YES_DESC_3', ntwrkDesc_4: 'NETWORKS_YES_DESC_4'},
            {ntwrkNm: 'ZOOM', ntwrkID: 'img/chnl_logos/live-tv-zoom.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0002_zoom.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_ZOOM_DESC', ntwrkDesc_1: 'NETWORKS_ZOOM_DESC_1', ntwrkDesc_2: 'NETWORKS_ZOOM_DESC_2'},
            {ntwrkNm: 'Mi Gente', ntwrkID: 'img/chnl_logos/live-tv-mi-g-ente-tv.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0017_miGente-TV.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_MIGENTE_DESC', ntwrkDesc_1: 'NETWORKS_MIGENTE_DESC_1'},
            {ntwrkNm: 'JBN', ntwrkID: 'img/chnl_logos/live-tv-jbn.png', ntwrkImg: 'img/BigLogos/live-channels-big-_0020_JBN.png', ntwrkAlt: '', ntwrkDesc: 'NETWORKS_JBN_DESC', ntwrkDesc_1: 'NETWORKS_JBN_DESC_1', ntwrkDesc_2: 'NETWORKS_JBN_DESC_2'}
        ];

        var usrNtwrkClasses = [
            {className: 'off'},
            {className: 'on'},
            {className: 'front'},
            {className: 'back'}
        ];

        var usrNtwrkFctry = {};

        usrNtwrkFctry.getUsrNtwrks = function () {
            return usrNtwrks;
        };

        usrNtwrkFctry.getNtwrkClasses = function () {
            return usrNtwrkClasses;
        };

        return usrNtwrkFctry;
    }]);
}(angular.module('app')));
