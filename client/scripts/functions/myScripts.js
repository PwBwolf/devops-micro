(function (app) {
    'use strict';

    
    app.directive('resize', function ($window) {
	    return function ($scope, element, attr) {

	        var w = angular.element($window);
	        $scope.$watch(function () {
	            return {
	                'h': w.height(), 
	                'w': w.width()
	            };
	        }, function (newValue, oldValue) {
	            $scope.windowHeight = newValue.h;
	            $scope.windowWidth = newValue.w;

	            /*
	            scope.resizeWithOffset = function (offsetH) {
	            	                scope.$eval(attr.notifier);
	            	                return { 
	            	                    'height': (newValue.h - offsetH) + 'px'                    
	            	                };
	            	            };*/
	            

	        }, true);

	        w.bind('resize', function () {
	            $scope.$apply();
	        });
    	};
	})
	
	
	.factory('usrBnrsFctry', function () {
        var en_Bnrs = [
            {bnrID: '0001', bnrPath: 'img/pc/en/Hero_eng_beINSports.jpg', bnrPath_tblt: 'img/tblt/en/Hero_eng_beINSports.jpg', bnrPath_mbl: 'img/mbl/en/Hero_eng_beINSports.jpg'},
            {bnrID: '0002', bnrPath: 'img/pc/en/Hero_eng_download.jpg', bnrPath_tblt: 'img/tblt/en/Hero_eng_download.jpg', bnrPath_mbl: 'img/mbl/en/Hero_eng_download.jpg'},
            {bnrID: '0003', bnrPath: 'img/pc/en/Hero_eng_TryFee7psd.jpg', bnrPath_tblt: 'img/tblt/en/Hero_eng_TryFee7psd.jpg', bnrPath_mbl: 'img/mbl/en/Hero_eng_TryFee7psd.jpg'},
            {bnrID: '0004', bnrPath: 'img/pc/en/Hero_eng_unbeatablePrice.jpg', bnrPath_tblt: 'img/tblt/en/Hero_eng_unbeatablePrice.jpg', bnrPath_mbl: 'img/mbl/en/Hero_eng_unbeatablePrice.jpg'}
        ];

        var en_pc_Bnrs = [
            {bnrID: '0001', bnrPath: 'img/pc/en/Hero_eng_beINSports.jpg'},
            {bnrID: '0002', bnrPath: 'img/pc/en/Hero_eng_download.jpg'},
            {bnrID: '0003', bnrPath: 'img/pc/en/Hero_eng_TryFee7psd.jpg'},
            {bnrID: '0004', bnrPath: 'img/pc/en/Hero_eng_unbeatablePrice.jpg'}
        ];

        var en_tblt_Bnrs = [
            {bnrID: '0001', bnrPath: 'img/tblt/en/Hero_eng_beINSports.jpg'},
            {bnrID: '0002', bnrPath: 'img/tblt/en/Hero_eng_download.jpg'},
            {bnrID: '0003', bnrPath: 'img/tblt/en/Hero_eng_TryFee7psd.jpg'},
            {bnrID: '0004', bnrPath: 'img/tblt/en/Hero_eng_unbeatablePrice.jpg'}
        ];

        var en_mbl_Bnrs = [
            {bnrID: '0001', bnrPath: 'img/mbl/en/Hero_eng_beINSports.jpg'},
            {bnrID: '0002', bnrPath: 'img/mbl/en/Hero_eng_download.jpg'},
            {bnrID: '0003', bnrPath: 'img/mbl/en/Hero_eng_TryFee7psd.jpg'},
            {bnrID: '0004', bnrPath: 'img/mbl/en/Hero_eng_unbeatablePrice.jpg'}
        ];

        var sp_Bnrs = [
            {bnrID: '0001', bnrPath: 'img/pc/sp/Hero_esp_beINSports.jpg'},
            {bnrID: '0002', bnrPath: 'img/pc/sp/Hero_esp_download.jpg'},
            {bnrID: '0003', bnrPath: 'img/pc/sp/Hero_esp_TryFee7psd.jpg'},
            {bnrID: '0004', bnrPath: 'img/pc/sp/Hero_esp_unbeatablePrice.jpg'}
        ];

        var usrPrfrdChnls = [
            {chnl: 'img/chnl_img/Channels1.jpg'}, {chnl: 'img/chnl_img/Channels2.jpg'}, {chnl: 'img/chnl_img/Channels3.jpg'},
            {chnl: 'img/chnl_img/Channels4.jpg'}, {chnl: 'img/chnl_img/Channels5.jpg'}, {chnl: 'img/chnl_img/Channels6.jpg'},
            {chnl: 'img/chnl_img/Channels7.jpg'}, {chnl: 'img/chnl_img/Channels8.jpg'}, {chnl: 'img/chnl_img/Channels9.jpg'},
            {chnl: 'img/chnl_img/Channels10.jpg'}, {chnl: 'img/chnl_img/Channels11.jpg'}, {chnl: 'img/chnl_img/Channels12.jpg'},
            {chnl: 'img/chnl_img/Channels13.jpg'}, {chnl: 'img/chnl_img/Channels14.jpg'}, {chnl: 'img/chnl_img/Channels15.jpg'},
            {chnl: 'img/chnl_img/Channels16.jpg'}, {chnl: 'img/chnl_img/Channels17.jpg'}, {chnl: 'img/chnl_img/Channels18.jpg'},
            {chnl: 'img/chnl_img/Channels19.jpg'}, {chnl: 'img/chnl_img/Channels20.jpg'}, {chnl: 'img/chnl_img/Channels21.jpg'},
            {chnl: 'img/chnl_img/Channels22.jpg'}, {chnl: 'img/chnl_img/Channels23.jpg'}, {chnl: 'img/chnl_img/Channels24.jpg'},
            {chnl: 'img/chnl_img/Channels25.jpg'}, {chnl: 'img/chnl_img/Channels26.jpg'}, {chnl: 'img/chnl_img/Channels27.jpg'},
            {chnl: 'img/chnl_img/Channels28.jpg'}, {chnl: 'img/chnl_img/Channels29.jpg'}, {chnl: 'img/chnl_img/Channels30.jpg'},
            {chnl: 'img/chnl_img/Channels31.jpg'}, {chnl: 'img/chnl_img/Channels32.jpg'}
        ];

        var usrBnrFctry = {};
        usrBnrFctry.getEnTbltBnrs = function () {
            return en_tblt_Bnrs;
        };
        usrBnrFctry.getEnBnrs = function () {
            return en_Bnrs;
        };
        usrBnrFctry.getSpBnrs = function () {
            return sp_Bnrs;
        };

        usrBnrFctry.sendUsrData = function () {

        };
        return usrBnrFctry;
    })

        .factory('usrScrnsFctry', function () {
            var usrMnScrn = {mnView: 'img/friend-banner.jpg', mnChnl: 'img/apple-touch-icon.png'};
            var usrFavs = [
                {chnlID: 'img/chnl_img/Channels21.jpg', favScrn: 'img/chnl_prvws/natgeo.jpg', favShwTme: '3pm', favDesc: 'Deep Sea Giants'},
                {chnlID: 'img/chnl_img/Channels1.jpg', favScrn: 'img/chnl_prvws/banner5.jpg', favShwTme: '6pm', favDesc: 'Fifa Qualifier'},
                {chnlID: 'img/chnl_img/Channels11.jpg', favScrn: 'img/chnl_prvws/banner4.jpg', favShwTme: '7pm', favDesc: 'Lady Gaga Benefit Concert'},
                {chnlID: 'img/chnl_img/Channels9.jpg', favScrn: 'img/chnl_prvws/nicki-M.jpg', favShwTme: '9pm', favDesc: 'Interview with Nicki Minaj'}
            ];
            var usrSgstns = [
                {chnlID: 'img/chnl_img/Channels31.jpg', sgstdScrn: 'img/chnl_prvws/tribs.jpg', sgstdTme: '4am', sgstdDsc: 'Biography', sgstdDscImg: 'img/chnl_prvws_ovr/img1.jpg', sgstdDscCntnt: 'Dan is an old Scandinavian given name with disputed meaning. Dan is also a Hebrew given name, after Dan, the fifth son of Jacob with Bilhah and founder of the Israelite Tribe of Dan. '},
                {chnlID: 'img/chnl_img/Channels27.jpg', sgstdScrn: 'img/chnl_prvws/salsadancing.jpg', sgstdTme: '11pm', sgstdDsc: 'Salsa', sgstdDscImg: 'img/chnl_prvws_ovr/img3.jpg'},
                {chnlID: 'img/chnl_img/Channels12.jpg', sgstdScrn: 'img/chnl_prvws/Nowy-Dziennik-TV1.jpg', sgstdTme: '9am', sgstdDsc: 'Noticero', sgstdDscImg: 'img/chnl_prvws_ovr/img7.jpg'},
                {chnlID: 'img/chnl_img/Channels9.jpg', sgstdScrn: 'img/chnl_prvws/app-tv-remote.jpg', sgstdTme: '5am', sgstdDsc: 'Tutorial', sgstdDscImg: 'img/chnl_prvws_ovr/img2.jpg'},
                {chnlID: 'img/chnl_img/Channels21.jpg', sgstdScrn: 'img/chnl_prvws/banner2.jpg', sgstdTme: '12pm', sgstdDsc: 'Fifa Soccer', sgstdDscImg: 'img/chnl_prvws_ovr/img4.jpg'},
                {chnlID: 'img/chnl_img/Channels3.jpg', sgstdScrn: 'img/chnl_prvws/newsreport.jpg', sgstdTme: '10am', sgstdDsc: 'Euro News', sgstdDscImg: 'img/chnl_prvws_ovr/img5.jpg'},
                {chnlID: 'img/chnl_img/Channels27.jpg', sgstdScrn: 'img/chnl_prvws/salsadancing.jpg', sgstdTme: '11pm', sgstdDsc: 'Salsa', sgstdDscImg: 'img/chnl_prvws_ovr/img6.jpg'},
                {chnlID: 'img/chnl_img/Channels12.jpg', sgstdScrn: 'img/chnl_prvws/Nowy-Dziennik-TV1.jpg', sgstdTme: '9am', sgstdDsc: 'Noticero', sgstdDscImg: 'img/chnl_prvws_ovr/img3.jpg'},
                {chnlID: 'img/chnl_img/Channels9.jpg', sgstdScrn: 'img/chnl_prvws/app-tv-remote.jpg', sgstdTme: '5am', sgstdDsc: 'Tutorial', sgstdDscImg: 'img/chnl_prvws_ovr/img2.jpg'},
                {chnlID: 'img/chnl_img/Channels21.jpg', sgstdScrn: 'img/chnl_prvws/banner2.jpg', sgstdTme: '12pm', sgstdDsc: 'Fifa Soccer', sgstdDscImg: 'img/chnl_prvws_ovr/img1.jpg'},
                {chnlID: 'img/chnl_img/Channels3.jpg', sgstdScrn: 'img/chnl_prvws/newsreport.jpg', sgstdTme: '10am', sgstdDsc: 'Euro News', sgstdDscImg: 'img/chnl_prvws_ovr/img7.jpg'},
                {chnlID: 'img/chnl_img/Channels11.jpg', sgstdScrn: 'img/chnl_prvws/img1.jpg', sgstdTme: '9am', sgstdDsc: 'Animal Planet', sgstdDscImg: 'img/chnl_prvws_ovr/img6.jpg'}
            ];

            var usrScrnClasses = [
                {className: 'sgstdChnl'},
                {className: 'sgstdChnl_open'},
                {className: 'posNlne'},
                {className: 'front'},
                {className: 'back'}
            ];


            var usrScrnFctry = {};
            usrScrnFctry.getUsrData = function () {
                return usrMnScrn;
            };
            usrScrnFctry.getUsrFavs = function () {
                return usrFavs;
            };
            usrScrnFctry.getUsrSgstns = function () {
                return usrSgstns;
            };
            usrScrnFctry.getUsrClass = function () {
                return usrScrnClasses;
            };

            usrScrnFctry.sendUsrData = function () {

            };
            return usrScrnFctry;
        })


        .factory('usrShowsFctry', function () {
            var usrShws = [
                {chnlID: 'img/BigLogos/live-channels-big-_0032_beIN-n.png', shwBnr: 'img/shws/sports/liga.jpg', shwTitle: 'Spanish Primera Division Soccer', shwDesc: 'beIN Sports | es,en', shwDescCntnt: 'From Santiago Bernabeu Stadium in Madrid, Spain.'},
                {chnlID: 'img/BigLogos/live-channels-big-_0006_tvc-latino.png', shwBnr: 'img/shws/sports/boxeo.jpg', shwTitle: 'Boxeo', shwDesc: 'TYC Sports', shwDescCntnt: 'Mas de 60 veladas nacionales e internacionales poer ano. '},
                {chnlID: 'img/BigLogos/live-channels-big-_0033_beIN-Sports.png', shwBnr: 'img/shws/sports/copa.jpg', shwTitle: 'Copa America Chile', shwDesc: 'beIN Sports', shwDescCntnt: 'Watch Live on beIN Sports.'},
                {chnlID: 'img/BigLogos/live-channels-big-_0033_beIN-Sports.png', shwBnr: 'img/shws/sports/superbike.jpg', shwTitle: 'Super Bike', shwDesc: 'beIN Sports', shwDescCntnt: 'Watch live on beIN Sports.'},
                {chnlID: 'img/BigLogos/live-channels-big-_0006_tvc-latino.png', shwBnr: 'img/shws/sports/auto.jpg', shwTitle: 'Autimovilismo', shwDesc: 'TYC Sports', shwDescCntnt: 'TC 2000, Super TC 200 y Top Race v-6'},
                {chnlID: 'img/BigLogos/live-channels-big-_0006_tvc-latino.png', shwBnr: 'img/shws/sports/futbol.jpg', shwTitle: 'Futbol Argentino - Primera Division', shwDesc: 'TYC Sports', shwDescCntnt: '9 partidos exclusivos por fin de semana'}
            ];

            var usrShws1 = [
                {chnlID: 'img/BigLogos/live-channels-big-_0020_JBN.png', shwBnr: 'img/shws/ent/seinfeld.jpg', shwTitle: 'Seinfeld', shwDesc: 'JBN', shwDescCntnt: 'Amigos que viven en Manhatten se obsessionan de las cosas pequeñas. '},
                {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/ent/tucara.jpg', shwTitle: 'Tu Cara Me Suena España', shwDesc: 'COMING SOON', shwDescCntnt: ''},
                {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/ent/secreto.jpg', shwTitle: 'El Secreto', shwDesc: 'COMING SOON', shwDescCntnt: ''},
                {chnlID: 'img/BigLogos/live-channels-big-_0004_Layer-1.png', shwBnr: 'img/shws/ent/musica.jpg', shwTitle: 'The Regional Mexican Music Channel', shwDesc: 'Video Rola', shwDescCntnt: 'Conciertos, especiales, videos, exclusivos!'},
                {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/ent/septimo.jpg', shwTitle: 'La Ruleta Séptimo Aniversario', shwDesc: 'COMING SOON', shwDescCntnt: ''},
                {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/ent/costuras.jpg', shwTitle: 'El Tiempo Entre Costuras', shwDesc: 'COMING SOON', shwDescCntnt: ''}
            ];

            var usrShws2 = [
                {chnlID: 'img/BigLogos/live-channels-big-_0013_teleantiquioa.png', shwBnr: 'img/shws/news/formular.jpg', shwTitle: 'tele Fórmula', shwDesc: 'teleFórmula', shwDescCntnt: 'Entérate en directo toda la actualidad de México y el mundo por teleFórmula.'},
                {chnlID: 'img/BigLogos/live-channels-big-_0016_NTN24.png', shwBnr: 'img/shws/news/latarde.jpg', shwTitle: 'La Tarde', shwDesc: 'NTN24', shwDescCntnt: 'El Análisis, investigación y la actualidad agenda informativa'},
                {chnlID: 'img/BigLogos/live-channels-big-_0016_NTN24.png', shwBnr: 'img/shws/news/planeta.jpg', shwTitle: 'Planeta Gente', shwDesc: 'NTN24', shwDescCntnt: 'Las Noticias Del Mundo Del Entretenimiento'},
                {chnlID: 'img/BigLogos/live-channels-big-_0016_NTN24.png', shwBnr: 'img/shws/news/noticias.jpg', shwTitle: 'NTN24 Nuestra Tele Noticias', shwDesc: 'NTN24', shwDescCntnt: 'De Latino para latino.'},
                {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/news/lamanana.jpg', shwTitle: 'Noticias De La Mañana', shwDesc: 'Antena 3', shwDescCntnt: ''},
                {chnlID: 'img/BigLogos/live-channels-big-_0001_Layer-2.png', shwBnr: 'img/shws/news/espejo.jpg', shwTitle: 'Espejo Publico Prsentadores', shwDesc: 'Antena 3', shwDescCntnt: ''}
            ];

            var usrShwClasses = [
                {className: 'panel_clsd'},
                {className: 'panel_open'},
                {className: 'panel'},
                {className: 'panel-default'},
                {className: 'col-md-2'},
                {className: 'front'},
                {className: 'back'}
            ];

            var usrShwFctry = {};
            usrShwFctry.getUsrShws = function () {
                return usrShws;
            };
            usrShwFctry.getUsrShws1 = function () {
                return usrShws1;
            };
            usrShwFctry.getUsrShws2 = function () {
                return usrShws2;
            };
            usrShwFctry.getShwClasses = function () {
                return usrShwClasses;
            };
            return usrShwFctry;
        })


        .factory('usrNetworksFctry', function () {
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
        })


        .factory('usrDevicesFctry', function () {
            var usrDvcs = [
                {dvcNm: 'personal', dvcImg: 'img/dvcs/devices.gif', dvcDesc1: 'cellular device', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'},
                {dvcNm: 'gaming', dvcImg: 'img/dvcs/gameVector.gif', dvcDesc1: 'Playstation, Xbox, Computer', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'},
                {dvcNm: 'roku', dvcImg: 'img/dvcs/roku.gif', dvcDesc1: 'Roku-stick', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'},
                {dvcNm: 'tvbox', dvcImg: 'img/dvcs/Apple_TV.gif', dvcDesc1: 'AppleTV, AmazonTV', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'},
                {dvcNm: 'smartv', dvcImg: 'img/dvcs/smartTV.gif', dvcDesc1: 'Any SmartTV with Internet capabiities', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'},
            ];

            var usrDvcClasses = [
                {className: 'off'},
                {className: 'on'}
            ];

            var usrDvc = {};
            usrDvc.getUsrDvcs = function () {
                return usrDvcs;
            };
            usrDvc.getDvcClass = function () {
                return usrDvcClasses;
            };
            return usrDvc;
        })

        .factory('usrGuideFctry', function () {
            var _12pm = [
                {gdeChnl: 'img/chnl_img/Channels1.jpg', gdeTtl: 'tv show title1', gdeDesc: 'show description1'},
                {gdeChnl: 'img/chnl_img/Channels2.jpg', gdeTtl: 'tv show title2', gdeDesc: 'show description2'},
                {gdeChnl: 'img/chnl_img/Channels3.jpg', gdeTtl: 'tv show title3', gdeDesc: 'show description3'},
                {gdeChnl: 'img/chnl_img/Channels11.jpg', gdeTtl: 'tv show title1', gdeDesc: 'show description1'},
                {gdeChnl: 'img/chnl_img/Channels12.jpg', gdeTtl: 'tv show title2', gdeDesc: 'show description2'},
                {gdeChnl: 'img/chnl_img/Channels13.jpg', gdeTtl: 'tv show title3', gdeDesc: 'show description3'}
            ];
            var _1pm = [
                {gdeChnl: 'img/chnl_img/Channels4.jpg', gdeTtl: 'tv show title1a', gdeDesc: 'show description1a'},
                {gdeChnl: 'img/chnl_img/Channels5.jpg', gdeTtl: 'tv show title2a', gdeDesc: 'show description2a'},
                {gdeChnl: 'img/chnl_img/Channels6.jpg', gdeTtl: 'tv show title3a', gdeDesc: 'show description3a'}
            ];
            var _2pm = [
                {gdeChnl: 'img/chnl_img/Channels17.jpg', gdeTtl: 'tv show title1b', gdeDesc: 'show description1b'},
                {gdeChnl: 'img/chnl_img/Channels18.jpg', gdeTtl: 'tv show title2b', gdeDesc: 'show description2b'},
                {gdeChnl: 'img/chnl_img/Channels19.jpg', gdeTtl: 'tv show title3b', gdeDesc: 'show description3b'}
            ];
            var _3pm = [
                {gdeChnl: 'img/chnl_img/Channels24.jpg', gdeTtl: 'tv show title1c', gdeDesc: 'show description1c'},
                {gdeChnl: 'img/chnl_img/Channels25.jpg', gdeTtl: 'tv show title2c', gdeDesc: 'show description2c'},
                {gdeChnl: 'img/chnl_img/Channels26.jpg', gdeTtl: 'tv show title3c', gdeDesc: 'show description3c'}
            ];
            var _4pm = [
                {gdeChnl: 'img/chnl_img/Channels23.jpg', gdeTtl: 'tv show title1d', gdeDesc: 'show description1d'},
                {gdeChnl: 'img/chnl_img/Channels28.jpg', gdeTtl: 'tv show title2d', gdeDesc: 'show description2d'},
                {gdeChnl: 'img/chnl_img/Channels29.jpg', gdeTtl: 'tv show title3d', gdeDesc: 'show description3d'}
            ];
            var _5pm = [
                {gdeChnl: 'img/chnl_img/Channels4.jpg', gdeTtl: 'tv show title1e', gdeDesc: 'show description1e'},
                {gdeChnl: 'img/chnl_img/Channels15.jpg', gdeTtl: 'tv show title2e', gdeDesc: 'show description2e'},
                {gdeChnl: 'img/chnl_img/Channels16.jpg', gdeTtl: 'tv show title3e', gdeDesc: 'show description3e'}
            ];
            var _6pm = [
                {gdeChnl: 'img/chnl_img/Channels7.jpg', gdeTtl: 'tv show title1f', gdeDesc: 'show description1f'},
                {gdeChnl: 'img/chnl_img/Channels18.jpg', gdeTtl: 'tv show title2f', gdeDesc: 'show description2f'},
                {gdeChnl: 'img/chnl_img/Channels29.jpg', gdeTtl: 'tv show title3f', gdeDesc: 'show description3f'}
            ];


            var usrGdeFctry = {};
            usrGdeFctry.getGdeData1 = function () {
                return _12pm;
            };
            usrGdeFctry.getGdeData2 = function () {
                return _1pm;
            };
            usrGdeFctry.getGdeData3 = function () {
                return _2pm;
            };
            usrGdeFctry.getGdeData4 = function () {
                return _3pm;
            };
            usrGdeFctry.getGdeData5 = function () {
                return _4pm;
            };
            usrGdeFctry.getGdeData6 = function () {
                return _5pm;
            };
            usrGdeFctry.getGdeData7 = function () {
                return _6pm;
            };
            return usrGdeFctry;
        })


        .controller('myController', function ($scope) {
        })

        .controller('usrBnrsCntrlr', function ($scope, usrBnrsFctry) {

            $scope.en_Bnrs = [];
            $scope.sp_Bnrs = [];

            $('#slider').nivoSlider({
                pauseTime: 6000
            });

        })

        .controller('usrScrnsCntrlr', function ($scope, usrScrnsFctry) {
            $scope.usrMnScrn = {};
            $scope.usrFavs = [];
            $scope.usrSgstns = [];
            $scope.usrScrnClasses = {};
            $scope.usrCntnt = {};

            init();

            function init() {
                $scope.usrMnScrn = usrScrnsFctry.getUsrData();
                $scope.usrFavs = usrScrnsFctry.getUsrFavs();
                $scope.usrSgstns = usrScrnsFctry.getUsrSgstns();
                $scope.usrScrnClasses = usrScrnsFctry.getUsrClass();
            }

            $scope.selectedIndex = -1;
            $scope.itemClicked = function ($index) {
                $scope.selectedIndex = $index;
            };
        })


        .controller('usrShwsCntrlr', function ($scope, usrShowsFctry) {
            init();
            function init() {
                $scope.usrShws = usrShowsFctry.getUsrShws();
                $scope.usrShws1 = usrShowsFctry.getUsrShws1();
                $scope.usrShws2 = usrShowsFctry.getUsrShws2();
                $scope.usrShwClasses = usrShowsFctry.getShwClasses();
            }

            $scope.selectedIndex = -1;

            $scope.itemClicked = function ($index) {
                $scope.selectedIndex = $index;
            };

            $scope.itemClicked2 = function ($index) {
                $scope.selectedIndex2 = $index;
            };

            $scope.itemClicked3 = function ($index) {
                $scope.selectedIndex3 = $index;
            };
        })

        .controller('usrNtwrksCntrlr', function ($scope, usrNetworksFctry) {
            init();
            function init() {
                $scope.usrNtwrks = usrNetworksFctry.getUsrNtwrks();
                $scope.usrNtwrkClasses = usrNetworksFctry.getNtwrkClasses();
            };

            $scope.selectedIndex = 0;
            $scope.itemClicked = function ($index) {
                $scope.selectedIndex = $index;
            }
        })

        .controller('usrDevicesCntrlr', function ($scope, usrDevicesFctry) {
            init();
            function init() {
                $scope.usrDvcs = usrDevicesFctry.getUsrDvcs();
                $scope.usrDvcClasses = usrDevicesFctry.getDvcClass();
            }

            $scope.selectedIndex = 0;

            $scope.itemHovered = function ($index) {
                $scope.selectedIndex = $index;
            };
        })

        .controller('usrGuideCntrlr', function ($scope, usrGuideFctry) {
            var guideTime;
            init();
            function init() {
                $scope._12pm = usrGuideFctry.getGdeData1();
                $scope._1pm = usrGuideFctry.getGdeData2();
                $scope._2pm = usrGuideFctry.getGdeData3();
                $scope._3pm = usrGuideFctry.getGdeData4();
                $scope._4pm = usrGuideFctry.getGdeData5();
                $scope._5pm = usrGuideFctry.getGdeData6();
                $scope._6pm = usrGuideFctry.getGdeData7();
            }
        })
}(angular.module('app')));
