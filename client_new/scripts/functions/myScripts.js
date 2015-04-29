/// Javascript Document
(function(app){
	'use strict';
	//var app = angular.module('app');
	//var controllers = {};

	
	app.factory('usrBnrsFctry', function(){
		var en_Bnrs = [
			{ bnrID: '0001', bnrPath: 'imgs/pc/en/Hero_eng_beINSports.jpg', bnrPath_tblt: 'imgs/tblt/en/Hero_eng_beINSports.jpg', bnrPath_mbl: 'imgs/mbl/en/Hero_eng_beINSports.jpg' },
			{ bnrID: '0002', bnrPath: 'imgs/pc/en/Hero_eng_download.jpg', bnrPath_tblt: 'imgs/tblt/en/Hero_eng_download.jpg', bnrPath_mbl: 'imgs/mbl/en/Hero_eng_download.jpg' },
			{ bnrID: '0003', bnrPath: 'imgs/pc/en/Hero_eng_TryFee7psd.jpg', bnrPath_tblt: 'imgs/tblt/en/Hero_eng_TryFee7psd.jpg', bnrPath_mbl: 'imgs/mbl/en/Hero_eng_TryFee7psd.jpg' },
			{ bnrID: '0004', bnrPath: 'imgs/pc/en/Hero_eng_unbeatablePrice.jpg', bnrPath_tblt: 'imgs/tblt/en/Hero_eng_unbeatablePrice.jpg', bnrPath_mbl: 'imgs/mbl/en/Hero_eng_unbeatablePrice.jpg'  }
			
		];
		
		var en_pc_Bnrs = [
			{ bnrID: '0001', bnrPath: 'imgs/pc/en/Hero_eng_beINSports.jpg' },
			{ bnrID: '0002', bnrPath: 'imgs/pc/en/Hero_eng_download.jpg' },
			{ bnrID: '0003', bnrPath: 'imgs/pc/en/Hero_eng_TryFee7psd.jpg' },
			{ bnrID: '0004', bnrPath: 'imgs/pc/en/Hero_eng_unbeatablePrice.jpg' }
			
		];
		
		var en_tblt_Bnrs = [
			{ bnrID: '0001', bnrPath: 'imgs/tblt/en/Hero_eng_beINSports.jpg' },
			{ bnrID: '0002', bnrPath: 'imgs/tblt/en/Hero_eng_download.jpg' },
			{ bnrID: '0003', bnrPath: 'imgs/tblt/en/Hero_eng_TryFee7psd.jpg' },
			{ bnrID: '0004', bnrPath: 'imgs/tblt/en/Hero_eng_unbeatablePrice.jpg' }
			
		];
		
		var en_mbl_Bnrs = [
			{ bnrID: '0001', bnrPath: 'imgs/mbl/en/Hero_eng_beINSports.jpg' },
			{ bnrID: '0002', bnrPath: 'imgs/mbl/en/Hero_eng_download.jpg' },
			{ bnrID: '0003', bnrPath: 'imgs/mbl/en/Hero_eng_TryFee7psd.jpg' },
			{ bnrID: '0004', bnrPath: 'imgs/mbl/en/Hero_eng_unbeatablePrice.jpg' }
			
		];
		
		var sp_Bnrs = [
			{ bnrID: '0001', bnrPath: 'imgs/pc/sp/Hero_esp_beINSports.jpg' },
			{ bnrID: '0002', bnrPath: 'imgs/pc/sp/Hero_esp_download.jpg' },
			{ bnrID: '0003', bnrPath: 'imgs/pc/sp/Hero_esp_TryFee7psd.jpg' },
			{ bnrID: '0004', bnrPath: 'imgs/pc/sp/Hero_esp_unbeatablePrice.jpg' }
			
		];
		
		
		var usrPrfrdChnls = [
			{ chnl: "imgs/chnl_imgs/Channels1.jpg" }, { chnl: "imgs/chnl_imgs/Channels2.jpg" }, { chnl: "imgs/chnl_imgs/Channels3.jpg" },
			{ chnl: "imgs/chnl_imgs/Channels4.jpg" }, { chnl: "imgs/chnl_imgs/Channels5.jpg" }, { chnl: "imgs/chnl_imgs/Channels6.jpg" },
			{ chnl: "imgs/chnl_imgs/Channels7.jpg" }, { chnl: "imgs/chnl_imgs/Channels8.jpg" }, { chnl: "imgs/chnl_imgs/Channels9.jpg" },
			{ chnl: "imgs/chnl_imgs/Channels10.jpg" }, { chnl: "imgs/chnl_imgs/Channels11.jpg" }, { chnl: "imgs/chnl_imgs/Channels12.jpg" },
			{ chnl: "imgs/chnl_imgs/Channels13.jpg" }, { chnl: "imgs/chnl_imgs/Channels14.jpg" }, { chnl: "imgs/chnl_imgs/Channels15.jpg" },
			{ chnl: "imgs/chnl_imgs/Channels16.jpg" }, { chnl: "imgs/chnl_imgs/Channels17.jpg" }, { chnl: "imgs/chnl_imgs/Channels18.jpg" },
			{ chnl: "imgs/chnl_imgs/Channels19.jpg" }, { chnl: "imgs/chnl_imgs/Channels20.jpg" }, { chnl: "imgs/chnl_imgs/Channels21.jpg" },
			{ chnl: "imgs/chnl_imgs/Channels22.jpg" }, { chnl: "imgs/chnl_imgs/Channels23.jpg" }, { chnl: "imgs/chnl_imgs/Channels24.jpg" },
			{ chnl: "imgs/chnl_imgs/Channels25.jpg" }, { chnl: "imgs/chnl_imgs/Channels26.jpg" }, { chnl: "imgs/chnl_imgs/Channels27.jpg" },
			{ chnl: "imgs/chnl_imgs/Channels28.jpg" }, { chnl: "imgs/chnl_imgs/Channels29.jpg" }, { chnl: "imgs/chnl_imgs/Channels30.jpg" },
			{ chnl: "imgs/chnl_imgs/Channels31.jpg" }, { chnl: "imgs/chnl_imgs/Channels32.jpg" }
			
		];
		
		
		
		var usrBnrFctry = {};
			usrBnrFctry.getEnTbltBnrs = function(){ return en_tblt_Bnrs; };
			usrBnrFctry.getEnBnrs = function(){ return en_Bnrs; };
			usrBnrFctry.getSpBnrs = function(){ return sp_Bnrs; };
			
			usrBnrFctry.sendUsrData = function(){
			
			};
		return usrBnrFctry;
		
	})
	
	.factory('usrScrnsFctry', function(){
		var usrMnScrn = { mnView: "imgs/friend-banner.jpg", mnChnl: "imgs/apple-touch-icon.png"} ;
		var usrFavs = [
			{ chnlID: "imgs/chnl_imgs/Channels21.jpg", favScrn: 'imgs/chnl_prvws/natgeo.jpg', favShwTme: "3pm", favDesc: 'Deep Sea Giants' },
			{ chnlID: "imgs/chnl_imgs/Channels1.jpg", favScrn: 'imgs/chnl_prvws/banner5.jpg', favShwTme: "6pm", favDesc: 'Fifa Qualifier' },
			{ chnlID: "imgs/chnl_imgs/Channels11.jpg", favScrn: 'imgs/chnl_prvws/banner4.jpg', favShwTme: "7pm", favDesc: 'Lady Gaga Benefit Concert' },
			{ chnlID: "imgs/chnl_imgs/Channels9.jpg", favScrn: 'imgs/chnl_prvws/nicki-M.jpg', favShwTme: "9pm", favDesc: 'Interview with Nicki Minaj' }
		];
		var usrSgstns = [
			{ chnlID: "imgs/chnl_imgs/Channels31.jpg", sgstdScrn: "imgs/chnl_prvws/tribs.jpg", sgstdTme: "4am", sgstdDsc: "Biography", sgstdDscImg: "imgs/chnl_prvws_ovr/img1.jpg", sgstdDscCntnt: "Dan is an old Scandinavian given name with disputed meaning. Dan is also a Hebrew given name, after Dan, the fifth son of Jacob with Bilhah and founder of the Israelite Tribe of Dan. " },
			{ chnlID: "imgs/chnl_imgs/Channels27.jpg", sgstdScrn: "imgs/chnl_prvws/salsadancing.jpg", sgstdTme: "11pm", sgstdDsc: "Salsa", sgstdDscImg: "imgs/chnl_prvws_ovr/img3.jpg" },
			{ chnlID: "imgs/chnl_imgs/Channels12.jpg", sgstdScrn: "imgs/chnl_prvws/Nowy-Dziennik-TV1.jpg", sgstdTme: "9am", sgstdDsc: "Noticero", sgstdDscImg: "imgs/chnl_prvws_ovr/img7.jpg" },
			{ chnlID: "imgs/chnl_imgs/Channels9.jpg", sgstdScrn: "imgs/chnl_prvws/app-tv-remote.jpg", sgstdTme: "5am", sgstdDsc: "Tutorial", sgstdDscImg: "imgs/chnl_prvws_ovr/img2.jpg" },
			{ chnlID: "imgs/chnl_imgs/Channels21.jpg", sgstdScrn: "imgs/chnl_prvws/banner2.jpg", sgstdTme: "12pm", sgstdDsc: "Fifa Soccer", sgstdDscImg: "imgs/chnl_prvws_ovr/img4.jpg" },
			{ chnlID: "imgs/chnl_imgs/Channels3.jpg", sgstdScrn: "imgs/chnl_prvws/newsreport.jpg", sgstdTme: "10am", sgstdDsc: "Euro News", sgstdDscImg: "imgs/chnl_prvws_ovr/img5.jpg" },
			{ chnlID: "imgs/chnl_imgs/Channels27.jpg", sgstdScrn: "imgs/chnl_prvws/salsadancing.jpg", sgstdTme: "11pm", sgstdDsc: "Salsa", sgstdDscImg: "imgs/chnl_prvws_ovr/img6.jpg" },
			{ chnlID: "imgs/chnl_imgs/Channels12.jpg", sgstdScrn: "imgs/chnl_prvws/Nowy-Dziennik-TV1.jpg", sgstdTme: "9am", sgstdDsc: "Noticero", sgstdDscImg: "imgs/chnl_prvws_ovr/img3.jpg" },
			{ chnlID: "imgs/chnl_imgs/Channels9.jpg", sgstdScrn: "imgs/chnl_prvws/app-tv-remote.jpg", sgstdTme: "5am", sgstdDsc: "Tutorial", sgstdDscImg: "imgs/chnl_prvws_ovr/img2.jpg" },
			{ chnlID: "imgs/chnl_imgs/Channels21.jpg", sgstdScrn: "imgs/chnl_prvws/banner2.jpg", sgstdTme: "12pm", sgstdDsc: "Fifa Soccer", sgstdDscImg: "imgs/chnl_prvws_ovr/img1.jpg" },
			{ chnlID: "imgs/chnl_imgs/Channels3.jpg", sgstdScrn: "imgs/chnl_prvws/newsreport.jpg", sgstdTme: "10am", sgstdDsc: "Euro News", sgstdDscImg: "imgs/chnl_prvws_ovr/img7.jpg" },
			{ chnlID: "imgs/chnl_imgs/Channels11.jpg", sgstdScrn: "imgs/chnl_prvws/img1.jpg", sgstdTme: "9am", sgstdDsc: "Animal Planet", sgstdDscImg: "imgs/chnl_prvws_ovr/img6.jpg" }

		];
		
		var usrScrnClasses = [
				{ className: "sgstdChnl" }, 
				{ className: "sgstdChnl_open"}, 
				{ className: "posNlne" },
			    { className: "front"},
			    { className: "back"}
			];
				
		//var usrCntnt = { dCntnt: "here lies all the " };
		
		var usrScrnFctry = {};
			usrScrnFctry.getUsrData = function(){ return usrMnScrn; };
			usrScrnFctry.getUsrFavs = function(){ return usrFavs; };
			usrScrnFctry.getUsrSgstns = function(){ return usrSgstns; };
			usrScrnFctry.getUsrClass = function(){ return usrScrnClasses; };
			
			//usrScrnFctry.getUsrCntnt = function(){ return usrCntnt; };
			
			usrScrnFctry.sendUsrData = function(){
			
			};
		return usrScrnFctry;
		
	})
	
	
	
	.factory('usrShowsFctry', function(){
		
		/*
		var usrShws = [
					{ chnlID: "imgs/chnl_imgs/Channels21.jpg", favScrn: 'imgs/chnl_prvws/natgeo.jpg', favShwTme: "3pm", favDesc: 'Deep Sea Giants' },
					{ chnlID: "imgs/chnl_imgs/Channels1.jpg", favScrn: 'imgs/chnl_prvws/banner5.jpg', favShwTme: "6pm", favDesc: 'Fifa Qualifier' },
					{ chnlID: "imgs/chnl_imgs/Channels11.jpg", favScrn: 'imgs/chnl_prvws/banner4.jpg', favShwTme: "7pm", favDesc: 'Lady Gaga Benefit Concert' },
					{ chnlID: "imgs/chnl_imgs/Channels9.jpg", favScrn: 'imgs/chnl_prvws/nicki-M.jpg', favShwTme: "9pm", favDesc: 'Interview with Nicki Minaj' }
				];*/
		
		var usrShws = [
			{ chnlID: "imgs/BigLogos/live-channels-big-_0032_beIN-n.png", shwBnr: "imgs/shws/sports/liga.jpg", shwTitle: "Spanish Primera Division Soccer", shwDesc: "beIN Sports | es,en", shwDescCntnt: "From Santiago Bernabeu Stadium in Madrid, Spain." },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0006_tvc-latino.png", shwBnr: "imgs/shws/sports/boxeo.jpg", shwTitle: "Boxeo", shwDesc: "TYC Sports", shwDescCntnt: "Mas de 60 veladas nacionales e internacionales poer ano. " },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0033_beIN-Sports.png", shwBnr: "imgs/shws/sports/copa.jpg", shwTitle: "Copa America Chile", shwDesc: "beIN Sports", shwDescCntnt: "Watch Live on beIN Sports." },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0033_beIN-Sports.png", shwBnr: "imgs/shws/sports/superbike.jpg", shwTitle: "Super Bike", shwDesc: "beIN Sports", shwDescCntnt: "Watch live on beIN Sports." },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0006_tvc-latino.png", shwBnr: "imgs/shws/sports/auto.jpg", shwTitle: "Autimovilismo", shwDesc: "TYC Sports", shwDescCntnt: "TC 2000, Super TC 200 y Top Race v-6" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0006_tvc-latino.png", shwBnr: "imgs/shws/sports/futbol.jpg", shwTitle: "Futbol Argentino - Primera Division", shwDesc: "TYC Sports", shwDescCntnt: "9 partidos exclusivos por fin de semana" }
		
		];
		
		var usrShws1 = [
			{ chnlID: "imgs/BigLogos/live-channels-big-_0020_JBN.png", shwBnr: "imgs/shws/ent/seinfeld.jpg", shwTitle: "Seinfeld", shwDesc: "JBN", shwDescCntnt: "Amigos que viven en Manhatten se obsessionan de las cosas pequeñas. " },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0001_Layer-2.png", shwBnr: "imgs/shws/ent/tucara.jpg", shwTitle: "Tu Cara Me Suena España", shwDesc: "Antena 3", shwDescCntnt: "" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0001_Layer-2.png", shwBnr: "imgs/shws/ent/secreto.jpg", shwTitle: "El Secreto", shwDesc: "Antena 3", shwDescCntnt: "" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0004_Layer-1.png", shwBnr: "imgs/shws/ent/musica.jpg", shwTitle: "The Regional Mexican Music Channel", shwDesc: "Video Rola", shwDescCntnt: "Conciertos, especiales, videos, exclusivos!" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0001_Layer-2.png", shwBnr: "imgs/shws/ent/septimo.jpg", shwTitle: "La Ruleta Séptimo Aniversario", shwDesc: "Antena 3", shwDescCntnt: "" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0001_Layer-2.png", shwBnr: "imgs/shws/ent/costuras.jpg", shwTitle: "El Tiempo Entre Costuras", shwDesc: "Antena 3", shwDescCntnt: "" }
		
		];
		
		var usrShws2 = [
			{ chnlID: "imgs/BigLogos/live-channels-big-_0013_teleantiquioa.png", shwBnr: "imgs/shws/news/formular.jpg", shwTitle: "tele Fórmula", shwDesc: "teleFórmula", shwDescCntnt: "Entérate en directo toda la actualidad de México y el mundo por teleFórmula." },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0016_NTN24.png", shwBnr: "imgs/shws/news/latarde.jpg", shwTitle: "La Tarde", shwDesc: "NTN24", shwDescCntnt: "El Análisis, investigación y la actualidad agenda informativa" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0016_NTN24.png", shwBnr: "imgs/shws/news/planeta.jpg", shwTitle: "Planeta Gente", shwDesc: "NTN24", shwDescCntnt: "Las Noticias Del Mundo Del Entretenimiento" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0016_NTN24.png", shwBnr: "imgs/shws/news/noticias.jpg", shwTitle: "NTN24 Nuestra Tele Noticias", shwDesc: "NTN24", shwDescCntnt: "De Latino para latino." },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0001_Layer-2.png", shwBnr: "imgs/shws/news/lamanana.jpg", shwTitle: "Noticias De La Mañana", shwDesc: "Antena 3", shwDescCntnt: "" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0001_Layer-2.png", shwBnr: "imgs/shws/news/espejo.jpg", shwTitle: "Espejo Publico Prsentadores", shwDesc: "Antena 3", shwDescCntnt: "" }
		
		];
		
		
		
		var usrShwClasses = [
						{ className: "panel_clsd" }, 
						{ className: "panel_open" }, 
						{ className: "panel" },
					    { className: "panel-default" },
						{ className: "col-md-2" },
						{ className: "front" },
					    { className: "back" }
					];
		
		var usrShwFctry = {};
			usrShwFctry.getUsrShws = function(){ return usrShws; };
			usrShwFctry.getUsrShws1 = function(){ return usrShws1; };
			usrShwFctry.getUsrShws2 = function(){ return usrShws2; };
			usrShwFctry.getShwClasses = function(){ return usrShwClasses; };
			
		
		return usrShwFctry;
		
	})
	
	
	
	.factory('usrNetworksFctry', function(){
		
		/*
		var usrShws = [
					{ chnlID: "imgs/chnl_imgs/Channels21.jpg", favScrn: 'imgs/chnl_prvws/natgeo.jpg', favShwTme: "3pm", favDesc: 'Deep Sea Giants' },
					{ chnlID: "imgs/chnl_imgs/Channels1.jpg", favScrn: 'imgs/chnl_prvws/banner5.jpg', favShwTme: "6pm", favDesc: 'Fifa Qualifier' },
					{ chnlID: "imgs/chnl_imgs/Channels11.jpg", favScrn: 'imgs/chnl_prvws/banner4.jpg', favShwTme: "7pm", favDesc: 'Lady Gaga Benefit Concert' },
					{ chnlID: "imgs/chnl_imgs/Channels9.jpg", favScrn: 'imgs/chnl_prvws/nicki-M.jpg', favShwTme: "9pm", favDesc: 'Interview with Nicki Minaj' }
				];*/
		
		/*
		var usrNtwrks = [
			{ ntwrkNm: "AZ Clic", ntwrkID: "imgs/chnl_logos/Channels31.jpg", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Music videos of every genre for varied round-the-clock viewing, Az Mix throws a bit of everything into the mix. VJs and information capsules alternate with music videos of every genre for varied round-the-clock viewing. " },
			{ ntwrkNm: "AZ CORAZON", ntwrkID: "imgs/chnl_logos/Channels31.jpg", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Featuring a selection of our most well-loved productions and international hits, our original stories and world-class actors have captivated viewers the world over and revolutionized the world of television. Over 1,500 telenovela episodes a year that have garnered a following in over 110 countries. A channel that broadcasts one of the most popular genres in television 24 hours a day, 365 days a year. Stories and characters millions of women can identify with, mirroring real-life joys, sorrows and dilemmas." },
			{ ntwrkNm: "BeIn Sports", ntwrkID: "imgs/chnl_logos/Channels31.jpg", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Is a Global network of sports channels jointly owned and operated by Qatari Sports Investments (an affiliate of beIN Media Group). Launched two channels in the United.States (English and Spanish). In the United States, the network holds the rights package for Ligue 1, La Liga, Serie A, Russian Football Premier League, Football League Championship, Football League Cup, TIM Cup, Copa del Rey, Copa America, and 2014 FIFA World Cup qualification rounds in the Americas (CONMEBOL and CONCACAF). " },
			{ ntwrkNm: "BeIn Sports ñ", ntwrkID: "imgs/chnl_logos/Channels31.jpg", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Is a Global network of sports channels jointly owned and operated by Qatari Sports Investments (an affiliate of beIN Media Group). Launched two channels in the United.States (English and Spanish). In the United States, the network holds the rights package for Ligue 1, La Liga, Serie A, Russian Football Premier League, Football League Championship, Football League Cup, TIM Cup, Copa del Rey, Copa America, and 2014 FIFA World Cup qualification rounds in the Americas (CONMEBOL and CONCACAF)." },
			{ ntwrkNm: "CANAL AMERICA", ntwrkID: "imgs/chnl_logos/Channels31.jpg", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "América TeVé is an independent Spanish language television station based in Miami, with on-air distribution in the Miami, New York and Puerto Rico markets. América TeVé is committed to serving the diverse Hispanic community by providing high quality news programming and entertaining variety shows, produced live, every day."  },
			{ ntwrkNm: "CANAL ANTIESTRES", ntwrkID: "imgs/chnl_logos/Channels31.jpg", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Dan is an old Scandinavian given name with disputed meaning. " },
			{ ntwrkNm: "", ntwrkID: "imgs/chnl_logos/Channels31.jpg", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Dan is an old Scandinavian given name with disputed meaning. " },
			{ ntwrkNm: "", ntwrkID: "imgs/chnl_logos/Channels31.jpg", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Dan is an old Scandinavian given name with disputed meaning. " },
			{ ntwrkNm: "", ntwrkID: "imgs/chnl_logos/Channels31.jpg", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Dan is an old Scandinavian given name with disputed meaning. " }
			
			
			{ ntrwkNm: "beIN Sports", ntwrkID: "../yip/wp-content/uploads/2015/04/recording.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Is a Global network of sports channels jointly owned and operated by Qatari Sports Investments (an affiliate of beIN Media Group). Launched two channels in the United.States (English and Spanish). In the United States, the network holds the rights package for Ligue 1, La Liga, Serie A, Russian Football Premier League, Football League Championship, Football League Cup, TIM Cup, Copa del Rey, Copa America, and 2014 FIFA World Cup qualification rounds in the Americas (CONMEBOL and CONCACAF)." },
			
			
		];
		*/
		
		var usrNtwrks = [
			{ ntwrkNm: "beIN Sports", ntwrkID: "imgs/chnl_logos/live-tv-bein-sports.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Be a part of the world’s greatest sports programming with beIN Sports. This global network of sports channels is available in English and Spanish and showcases some of the world’s best sports including football and soccer from the United States, Italy, and Spain. In addition, catch some of the hottest events surrounding the Superbike FIM World Championship and FIA World Rallycross Championship! ", ntwrkDesc_1: "Tune into beIN Sports to watch La Liga, Ligue, Serie A, Russian Football, the Capital One Cup, World Cup Qualifiers, COPA American and so much more! Whether you want to catch the latest game or stay abreast of what is going on in some of the world’s largest tournaments, you can stream the events live with YipTV. Watch and listen as the games are broadcast and analyzed by some of the world’s best sportscasters, including professional soccer players, and seasoned sport journalists. ", ntwrkDesc_2: "Never miss your favorite sporting events from around the world again! Tune into beIN Sports in either English or Spanish and watch your favorite sports today!" },
			{ ntwrkNm: "beIN Sports Espanol", ntwrkID: "imgs/chnl_logos/live-tv-bein-sports-e.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "The world’s best sports programming is available in Spanish! Get the latest stats on your favorite soccer and football players from around the world. Watch La Liga, Ligue, Serie A, Russian Football, The Capital One Cup, World Cup Qualifiers, COPA America, and more on beIN Sports Espanol! Watch your favorite sports live or catch the latest broadcast on the events surrounding these amazing sports. Want something a little more exciting? Check out the amazing Superbike FIM World Championship and FIA World Rallycross Championship live on beIN Sports Espanol!", ntwrkDesc_1: "Stream your favorite sporting events live wherever you have Wi-Fi, whether on your television, tablet, or Smartphone. This means you will never be without your favorite sports, no matter where you go! Check the latest scores, listen to some of the hottest announcers in the industry and enjoy your football, soccer, and bike racing sports today!", ntwrkDesc_2: "Tune into beIN Sports Espanol to get the latest information from around the world, including Spain, England, Italy, and the United States!" },
			{ ntwrkNm: "Canal Sur", ntwrkID: "imgs/chnl_logos/live-tv-canal-sur.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Latin American Super Station - Building on its more than 20 year history of bringing top content to the US Novellas from Brazil & Colombia; Comedies from Peru; Variety and Reality programs from Argentina.  And political satire from all! Canal SUR is the point of reference for US Latinos looking for an option to the standard broadcast offerings. " },
			{ ntwrkNm: "Maya TV", ntwrkID: "imgs/chnl_logos/live-tv-maya-tv.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Maya TV Is the Honduran television channel with satellite signal coverage at the national level, transmitting frequency to air in major departments of the country: Francisco Morazán, Cortes and Atlantida. Maya TV brings viewers a varied programming in news, Entertainment and culture. The Sur channel broadcasts programs from Maya TV for the United States, which has become the channel of choice for our overseas compatriots." },
			{ ntwrkNm: "Clubbing TV", ntwrkID: "imgs/chnl_logos/live-tv-clubbing-tv.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: ""  },
			{ ntwrkNm: "TyC Sports", ntwrkID: "imgs/chnl_logos/live-tv-tyc-sports.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "The Biggest Sports Network from Latin America which Includes most of  the Argentinean first division as well as Primera B division games. " },
			{ ntwrkNm: "NTN 24", ntwrkID: "imgs/chnl_logos/live-tv-ntn24.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "NTN24 is your 24-hour access to the latest news. Compare it to channels like CNN and BBC World to get an idea of the quality news you will see and hear. NTN24 is one of the top rated news channels around the world with reporters stationed in 18 different countries as well as local reporters, no news goes untouched! ", ntwrkDesc_1: "On NTN24 you will find the latest breaking news, as well as plenty of analysis to help determine what is going on in the world. You will have access around-the-clock to the Hispanic news you want to hear, not just the news that will provide the highest ranking. NTN24 is the only network that covers quality Hispanic news in the United States.", ntwrkDesc_2: "In addition to the regular Hispanic news, you can enjoy shows like “Headlines Hour,” “The Afternoon,” “The Night,” and “Zoom to the News.” Turn to YipTV to get the latest and greatest Hispanic community information today!" },
			{ ntwrkNm: "Video Rola", ntwrkID: "imgs/chnl_logos/live-tv-video-rola.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Direct from Guadalajara, Videorola is one of the first ever music networks distributed throughout Mexico and the US.  They are one of the strongest performers on VOD with Comcast offering Live VJ’s hosting music videos, interviews with top artists, live concerts, a daily showbiz news and gossip program, and interactive call in-shows. Launched its HD signal in Mexico in July, 2013. Great ratings performance in both the US and Mexico. Owned by the largest MSO in Mexico:  MegaCable. Carried throughout US Cable:  Time Warner, Comcast, Cox, Charter, etc. Distributed throughout Central America" },
			{ ntwrkNm: "CANAL AMERICA", ntwrkID: "imgs/chnl_logos/live-tv-america.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "América TeVé is an independent Spanish language television station based in Miami, with on-air distribution in the Miami, New York and Puerto Rico markets. América TeVé is committed to serving the diverse Hispanic community by providing high quality news programming and entertaining variety shows, produced live, every day. " },

			{ ntwrkNm: "AZ Clic", ntwrkID: "imgs/chnl_logos/live-tv-azclick.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Get the latest broadcasts from Mexico City live with AzClic. Watch your favorite music videos and catch the latest entertainment news; get behind-the-scenes information on your favorite celebrities, musicians, and bands around-the-clock; and even get inside looks at famous places where some of your favorite movies were made or where your favorite musicians grew up. AzClic programs are the place to be in the know on all of your favorite entertainment celebrities, movies, and songs!", ntwrkDesc_1: "Be in the know about the latest up and coming shows, movies, and songs with Show Zone, a 30-minute production that showcases the latest up-and-coming events. Do you love debates? Check out El Tribate where the experts and celebrities debate the latest controversial issues that are trending. Maybe you want to see up close and personal details on your favorite celebrities – you will find that on Solo Hits, which takes you through all of the details of the artists, what they are up to and even where they live! Don’t forget about late night programming where you can get the Spanish version of everything entertainment on El Hormiguero MX. ", ntwrkDesc_2: "Never miss “the next big thing” event or entertainment news again with AzClic programming! " },
			{ ntwrkNm: "AZCorazon", ntwrkID: "imgs/chnl_logos/live-tv-az-corazon.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "AzCorazon is a channel that contains real stories that women everywhere can identify with every day. Do you love drama, romance, and shows that portray intense problems of women of all ages? Then this channel is for you! You will find comedies, romance, and of course, incredible drama that will rope you right in making you want to see more!", ntwrkDesc_1: "The productions are internationally known and contain incredible acting abilities. This channel broadcasts more than 1,500 telenovela episodes every year, giving you more and more reasons to love it. Whether you love drama and sorrow filled episodes or comedic episodes that show an average family’s struggles and how they overcome them, you will find shows that you love on this channel!", ntwrkDesc_2: "Turn to AZCorazon on YipTV to get the latest love stories, dramas, and comedies that cannot be seen anywhere else. With more than 110 countries tuning in, there is something special to be sought on AZCorazon!" },
			{ ntwrkNm: "RT Espanol", ntwrkID: "imgs/chnl_logos/live-tv-rt-espaniol.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "RT Espanol provides today’s latest news, but with an edge that no other channel has yet to provide. You are not just going to hear and see the ordinary news on this channel. Instead, you will be privy to news and analysis that is overlooked by the mainstream news channels, giving you access to alternative news. RT Espanol has been the recipient of many awards, including the 2013 Monte Carlo TV Festival Award.", ntwrkDesc_1: "RT Espanol has been in existence since 2005, but has greatly enhanced its viewership. They are now a network of three channels offering global news in several languages, including English, Spanish, and Arabic. RT has viewers from around the world, totaling around 700 million people. RT gives you access to political, social, and economic news like no other channel has done before. If you are looking for news that no one else provides, you will find it on RT Espanol provided by YipTV!" },
			{ ntwrkNm: "RT News – English", ntwrkID: "imgs/chnl_logos/live-tv-rt.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Get the latest news in a way that no other network provides it on RT News – English. This channel, which has been around since 2005 is gaining ground throughout the world. RT News – English used to strictly be available on YouTube, but is now a mainstream news channel that is available on YipTV. Get the answers you want to the occurrences going on around the world rather than hearing the same broadcast over and over again as is typical of the standard news channels.", ntwrkDesc_1: "RT English provides you with a different perspective on what is going on in the world, delivering news that no one else will cover. Tune in to watch newscasts, documentaries, interviews, and analyses of many different types of news from across the world. The news specialists provide not only the information that every other channel provides, but they dig deeper, giving you a behind-the-scenes look at what is going on. Join the 700 million other people that are already enjoying RT News – English with YipTV today!" },
			{ ntwrkNm: "Clubbing TV", ntwrkID: "imgs/chnl_logos/live-tv-clubbing-tv.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: ""  },
			{ ntwrkNm: "TyC Sports", ntwrkID: "imgs/chnl_logos/live-tv-tyc-sports.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "The Biggest Sports Network from Latin America which Includes most of  the Argentinean first division as well as Primera B division games. " },
			{ ntwrkNm: "NTN 24", ntwrkID: "imgs/chnl_logos/live-tv-ntn24.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "24-hour news network that compares to CNN & BBC World News coverage so complete - the Venezuelan government forced it off the air! One of the top rated networks on DIRECTV in the US. All live programming. Coverage of the US and the Americas. Reporters stationed in 18 different countries – staffed with local reporters. Analysis programs combined with breaking news. Only network in US covering Hispanic community organizations " },
			{ ntwrkNm: "Video Rola", ntwrkID: "imgs/chnl_logos/live-tv-video-rola.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "Direct from Guadalajara, Videorola is one of the first ever music networks distributed throughout Mexico and the US.  They are one of the strongest performers on VOD with Comcast offering Live VJ’s hosting music videos, interviews with top artists, live concerts, a daily showbiz news and gossip program, and interactive call in-shows. Launched its HD signal in Mexico in July, 2013. Great ratings performance in both the US and Mexico. Owned by the largest MSO in Mexico:  MegaCable. Carried throughout US Cable:  Time Warner, Comcast, Cox, Charter, etc. Distributed throughout Central America" },
			{ ntwrkNm: "CANAL AMERICA", ntwrkID: "imgs/chnl_logos/live-tv-america.png", ntwrkImg: "imgs/shws/bein_Bike.jpg", ntwrkAlt: "", ntwrkDesc: "América TeVé is an independent Spanish language television station based in Miami, with on-air distribution in the Miami, New York and Puerto Rico markets. América TeVé is committed to serving the diverse Hispanic community by providing high quality news programming and entertaining variety shows, produced live, every day. " }
			
			
		];
		
		
		var usrNtwrkClasses = [
						{ className: "off" }, 
						{ className: "on" }, 
						{ className: "front" },
					    { className: "back" }
					];
		
		var usrNtwrkFctry = {};
			usrNtwrkFctry.getUsrNtwrks = function(){ return usrNtwrks; };
			usrNtwrkFctry.getNtwrkClasses = function(){ return usrNtwrkClasses; };
			
		
		return usrNtwrkFctry;
		
	})
	
	
	.factory('usrDevicesFctry', function(){
		var usrDvcs = [
				{ dvcNm: 'personal', dvcImg: 'imgs/dvcs/devices.gif', dvcDesc1: 'cellular device', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.' },
				/*{ dvcNm: 'personal', dvcImg: 'for your eye\'s only', dvcDesc1: 'iPad, Kindle, Samsung, Nexus, Motorola', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.' },
				{ dvcNm: 'pc', dvcImg: 'for your eye\'s only', dvcDesc1: 'Desktop Mac/PC, Laptop', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.' },*/
				{ dvcNm: 'gaming', dvcImg: 'imgs/dvcs/gameVector.gif', dvcDesc1: 'Playstation, Xbox, Computer', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.' },
				{ dvcNm: 'roku', dvcImg: 'imgs/dvcs/roku.gif', dvcDesc1: 'Roku-stick', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.' },
				{ dvcNm: 'tvbox', dvcImg: 'imgs/dvcs/Apple_TV.gif', dvcDesc1: 'AppleTV, AmazonTV', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.' },
				{ dvcNm: 'smartv', dvcImg: 'imgs/dvcs/smartTV.gif', dvcDesc1: 'Any SmartTV with Internet capabiities', dvcDesc2: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.' },
			];
			
		var usrDvcClasses = [
				{ className: "off" }, 
				{ className: "on" }
			]; 
			
		var usrDvc = {};
			usrDvc.getUsrDvcs = function(){ return usrDvcs; };
			usrDvc.getDvcClass = function(){ return usrDvcClasses; };

			return usrDvc;
	})
	
	
	.factory('usrGuideFctry', function(){
		/*
		var usrGuide = { 
					gdeTme: [
						{ '_12pm': 
							[
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title1', gdeDesc:'show description1' },
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title2', gdeDesc:'show description2' },
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title3', gdeDesc:'show description3' },
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title4', gdeDesc:'show description4' }
							]
					 	},
						
						{ '1pm': 
							[
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title1a', gdeDesc:'show description1a' },
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title2a', gdeDesc:'show description2a' },
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title3a', gdeDesc:'show description3a' },
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title4a', gdeDesc:'show description4a' }
							]
					 	},
						
						{ '2pm': 
							[
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title1b', gdeDesc:'show description1b' },
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title2b', gdeDesc:'show description2b' },
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title3b', gdeDesc:'show description3b' },
								{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title4b', gdeDesc:'show description4b' }
							]
					 	}
					 
					]
				
				};
		
		
		var usrGuide = [
					{'_12pm': [
						{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title1', gdeDesc:'show description1' },
						{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title2', gdeDesc:'show description2' },
						{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title3', gdeDesc:'show description3' }
						
					]},
					{'_1pm': [
						{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title1a', gdeDesc:'show description1a' },
						{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title2a', gdeDesc:'show description2a' },
						{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title3a', gdeDesc:'show description3a' }
						
					]},
					{'_2pm': [
						{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title1b', gdeDesc:'show description1b' },
						{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title2b', gdeDesc:'show description2b' },
						{ gdeChnl:'imgs/apple-touch-icon.png', gdeTtl: 'tv show title3b', gdeDesc:'show description3b' }
						
					]}
					
					
				];
		*/
		
			
		var _12pm = [
				{ gdeChnl:'imgs/chnl_imgs/Channels1.jpg', gdeTtl: 'tv show title1', gdeDesc:'show description1' },
				{ gdeChnl:'imgs/chnl_imgs/Channels2.jpg', gdeTtl: 'tv show title2', gdeDesc:'show description2' },
				{ gdeChnl:'imgs/chnl_imgs/Channels3.jpg', gdeTtl: 'tv show title3', gdeDesc:'show description3' },
				{ gdeChnl:'imgs/chnl_imgs/Channels11.jpg', gdeTtl: 'tv show title1', gdeDesc:'show description1' },
				{ gdeChnl:'imgs/chnl_imgs/Channels12.jpg', gdeTtl: 'tv show title2', gdeDesc:'show description2' },
				{ gdeChnl:'imgs/chnl_imgs/Channels13.jpg', gdeTtl: 'tv show title3', gdeDesc:'show description3' }
		];
		var _1pm = [
				{ gdeChnl:'imgs/chnl_imgs/Channels4.jpg', gdeTtl: 'tv show title1a', gdeDesc:'show description1a' },
				{ gdeChnl:'imgs/chnl_imgs/Channels5.jpg', gdeTtl: 'tv show title2a', gdeDesc:'show description2a' },
				{ gdeChnl:'imgs/chnl_imgs/Channels6.jpg', gdeTtl: 'tv show title3a', gdeDesc:'show description3a' }
		];
		var _2pm = [
				{ gdeChnl:'imgs/chnl_imgs/Channels17.jpg', gdeTtl: 'tv show title1b', gdeDesc:'show description1b' },
				{ gdeChnl:'imgs/chnl_imgs/Channels18.jpg', gdeTtl: 'tv show title2b', gdeDesc:'show description2b' },
				{ gdeChnl:'imgs/chnl_imgs/Channels19.jpg', gdeTtl: 'tv show title3b', gdeDesc:'show description3b' }
		];
		var _3pm = [
				{ gdeChnl:'imgs/chnl_imgs/Channels24.jpg', gdeTtl: 'tv show title1c', gdeDesc:'show description1c' },
				{ gdeChnl:'imgs/chnl_imgs/Channels25.jpg', gdeTtl: 'tv show title2c', gdeDesc:'show description2c' },
				{ gdeChnl:'imgs/chnl_imgs/Channels26.jpg', gdeTtl: 'tv show title3c', gdeDesc:'show description3c' }
		];
		var _4pm = [
				{ gdeChnl:'imgs/chnl_imgs/Channels23.jpg', gdeTtl: 'tv show title1d', gdeDesc:'show description1d' },
				{ gdeChnl:'imgs/chnl_imgs/Channels28.jpg', gdeTtl: 'tv show title2d', gdeDesc:'show description2d' },
				{ gdeChnl:'imgs/chnl_imgs/Channels29.jpg', gdeTtl: 'tv show title3d', gdeDesc:'show description3d' }
		];
		var _5pm = [
				{ gdeChnl:'imgs/chnl_imgs/Channels4.jpg', gdeTtl: 'tv show title1e', gdeDesc:'show description1e' },
				{ gdeChnl:'imgs/chnl_imgs/Channels15.jpg', gdeTtl: 'tv show title2e', gdeDesc:'show description2e' },
				{ gdeChnl:'imgs/chnl_imgs/Channels16.jpg', gdeTtl: 'tv show title3e', gdeDesc:'show description3e' }
		];
		var _6pm = [
				{ gdeChnl:'imgs/chnl_imgs/Channels7.jpg', gdeTtl: 'tv show title1f', gdeDesc:'show description1f' },
				{ gdeChnl:'imgs/chnl_imgs/Channels18.jpg', gdeTtl: 'tv show title2f', gdeDesc:'show description2f' },
				{ gdeChnl:'imgs/chnl_imgs/Channels29.jpg', gdeTtl: 'tv show title3f', gdeDesc:'show description3f' }
		];
		
		
		
		var usrGdeFctry = {};
			usrGdeFctry.getGdeData1 = function(){ return _12pm; };
			usrGdeFctry.getGdeData2 = function(){ return _1pm; };
			usrGdeFctry.getGdeData3 = function(){ return _2pm; };
			usrGdeFctry.getGdeData4 = function(){ return _3pm; };
			usrGdeFctry.getGdeData5 = function(){ return _4pm; };
			usrGdeFctry.getGdeData6 = function(){ return _5pm; };
			usrGdeFctry.getGdeData7 = function(){ return _6pm; };
			
			
			/*usrGdeFctry.getGdeData_unit = function(){
				return usrGuide.gdeTme;
			};
			
			usrGdeFctry.sendGdeData = function(){
			
			};*/
		return usrGdeFctry;
		
	})
	
	
	.controller('myController', function($scope){
		
		/// === orig === ////
		$scope.usrDataFile = {
			"bnr": "vws/usrBnr.html",
			"shws": "vws/usrShws.html",
			"ntwrks": "vws/usrNtwrks.html",
			"dvcs": "vws/usrDvcs.html",
			"abt": "vws/usrAbt.html",
			"app": "vws/usrApp.html",
			"ftr": "vws/usrFtrMnu.html"
		};
		

	/// ====   PAGE AND BUTTON FUNCTIONS   ==== ///
	
		var mnuBtns = ['pgCntnt', 'Shws', 'Ntwrks', 'Device', 'Orders'];
		//var cntntBxs = ['Home_Bx', 'About_Bx', 'Menu_Bx', 'Event_Bx', 'Order_Bx'];
		
		$('#docklogo').on('click', function(){
			$('html, body').animate({
				scrollTop: 0,
				
			}, 1500);
		});
		
		for(var j = 0; j < 5; j++){
			$('#'+mnuBtns[j]).on('click', function(){
				//var dBtn = $(this).attr('id').split("_")[0];
				//$('#'+dBtn+'_Bx').css('transform', 'translateY(0px)');
				//var dBtnName = $(this).html();
				var dPg = $(this).attr('id');
				//console.log(dPg);
				var dSite = $('html, body');
				//$('a').click(function() {
				    dSite.animate({
				        //scrollTop: $( $.attr(this, 'href') ).offset().top
						//scrollTop: $( $.attr(this, 'id') ).offsetTop
						//$('[id="'+dBtn+'_Bx"]' ).offsetTop
						scrollTop: $('#'+dPg+'_Bx').offset().top - 30
					}, 1500 );
				   console.log(dPg);
					//});
					
					//alert(dBtn);
					return false;

			});
		};
	
		

	})
	
	.controller('usrBnrsCntrlr', function($scope, usrBnrsFctry){
		
		$scope.en_Bnrs = [];
		$scope.sp_Bnrs = [];
		
		//var hroBnrs = $("ul [id*='_bnr_']");
		var hroBnrsCntnr = document.getElementById('carousel-banner');
		var hroBnrs = hroBnrsCntnr.querySelectorAll("li img");
	    var mP = 'mbl_bnr_P', mL = 'mbl_bnr_L', tP = 'tblt_bnr_P', tL = 'tblt_bnr_L', dT = 'dsktp_bnr_L', othrBnrs, crntBnr;
		var enMblPImg = '../imgs/mbl/en/mbl_P_';
		var enMblLImg = '../imgs/mbl/en/mbl_L_';
		var enTbltImg = '../imgs/tblt/en/tblt_';
		var enDskTpImg = '../imgs/pc/en/dsktp_';
		
		
		init();
		function init(){
			$scope.en_Bnrs = usrBnrsFctry.getEnBnrs();
			$scope.sp_Bnrs = usrBnrsFctry.getSpBnrs();
		}
		
		$scope.$watch(function(){
		       return window.innerWidth;
		    }, function(value) {
		       console.log(value);
			   
			  
		  if(value < 400){
			   //$scope.en_Bnr = usrBnrsFctry.getEnTbltBnrs();
			   for(var h = 0; h < hroBnrs.length; h++){
				   hroBnrs[h].setAttribute('src', enMblPImg+[h+1]+'.jpg');
				   hroBnrs[h].setAttribute('width', '400px');
				   hroBnrs[h].setAttribute('height', '330px');
			   }	
			   console.log('this window is '+value+'px wide. Its portrait mobile. So I\'ll use '+hroBnrs.length);
				   } else if(value > 400 && value <= 768){
				   
					   for(var h = 0; h < hroBnrs.length; h++){
						   hroBnrs[h].setAttribute('src', enMblLImg+[h+1]+'.jpg');
						   hroBnrs[h].setAttribute('width', '667px');
						   hroBnrs[h].setAttribute('height', '350px');
					   }
					   
			       console.log('this window is '+value+'px Its landscape mobile.'+hroBnrs.length);
				   		} else if(value >= 769 && value <= 1024){
				   
						   for(var h = 0; h < hroBnrs.length; h++){
							   hroBnrs[h].setAttribute('src', enTbltImg+[h+1]+'.jpg');
							   hroBnrs[h].setAttribute('width', '1300px');
							   hroBnrs[h].setAttribute('height', '433px');
						   }
					    console.log('this window is '+value+'px Its tablet view.'+hroBnrs.length);
					   		} else if( value > 1024 ){
			   
							   for(var h = 0; h < hroBnrs.length; h++){
								   hroBnrs[h].setAttribute('src', enDskTpImg+[h+1]+'.jpg');
								   hroBnrs[h].setAttribute('width', '2600px');
								   hroBnrs[h].setAttribute('height', '866');
							   }
							console.log('this window is '+value+'px Its Desktop view.'+hroBnrs.length);
		  }
			  
		});
		
		//$(document).load(function(){
			$('#slider').nivoSlider({
				pauseTime: 6000,
				//effect: 'slideInLeft',
				//slices: 0
			
			});
			//});
		
	})
	
	.controller('usrScrnsCntrlr', function($scope, usrScrnsFctry){
		
		
		$scope.usrMnScrn = {};
		$scope.usrFavs = [];
		$scope.usrSgstns = [];
		$scope.usrScrnClasses = {};
		$scope.usrCntnt = {};
		
		init();
		function init(){
			$scope.usrMnScrn = usrScrnsFctry.getUsrData();
			$scope.usrFavs = usrScrnsFctry.getUsrFavs();
			$scope.usrSgstns = usrScrnsFctry.getUsrSgstns();
			$scope.usrScrnClasses = usrScrnsFctry.getUsrClass();
			//$scope.usrCntnt = usrScrnsFctry.getUsrCntnt();
			
		}
		
			
		
		
		///// =============================================== /////
		///// ========= SELECTED CHANNEL TRANSITION ========= /////
		///// =============================================== /////

		$scope.selectedIndex = -1; // Whatever the default selected index is, use -1 for no selection

	    $scope.itemClicked = function ($index) {
			//console.log($index);
			//$index.preventDefault();
	    	$scope.selectedIndex = $index;
			

			/// --- FLIPCARD END --- ///
			
	    };
		
		
		
		///// ============================================== /////
		///// ======== TOKEN AUTHENTICATION SEGMENT ======== /////
		///// ============================================== /////
		
			/*
			var key = "uFhpKCsBgF9KLlHT0E9rmQ";
			var dKey = "";
			var gen = 5;
			var error = "";
			
			var trnBck = 60 * 10;
			var mDate = new Date();
			//var gTime = mDate.getTime();
			var sTime = Date.parse(mDate)/1000;
			var sTime = sTime - trnBck;
			//var sTime = "1428600830";
			console.log(sTime);
			///var time = mDate.AddSeconds(1268927156 );
			//alert(gTime);
			
			//alert(mDate +" - "+ sTime);
			var timespan = 60 * 20;
			var eTime = sTime + timespan;
			
			//var uri = "http://yiptv-cosmovision.hls.adaptive.level3.net/hls-live/yiptvlive-cosmovision/_definst_/live.m3u8";
			//var uri = "http://yiptv-tele_pacifico.hls.adaptive.level3.net/hls-live/yiptvlive-tele_pacifico/_definst_/live.m3u8?";
			//var uri = "http://yiptv-cosmovision.hls.adaptive.level3.net/hls-live/yiptvlive-cosmovision/_definst_/live.m3u8?valid_from=1428345514&valid_to=1428346714&hash=5d05c22b69a1bd753935d"
			//var nStime = "1428425595", nEtime = "1428426795";
			//var uri = "/hls-live/yiptvlive-cosmovision/_definst_/live.m3u8";
			var uri = "/yiptv4/beinengov/appleman.m3u8";
				uri += "?valid_from="+sTime+"&valid_to="+eTime;
				//uri += "valid_from="+nStime+"&valid_to="+nEtime;
			
			//console.log(sTime +" - "+ eTime+" - "+timespan+" = "+ uri );
			//var stime = "20150405080000";
			//var etime = "20150408080000";
			
			
		
			if  (gen < 0 || gen > 9){
				error = "ERROR: Invalid GEN value";
			}
				if (key.length < 20 || key.length > 64){
					error = "ERROR: Invalid key length";
				}
					if (uri.length < 1){
						error = "ERROR: No URI provided";
					}
						if (error.length > 0) {
							document.getElementById('errTest').innerHTML = error;
						} else {
							var hmac = Crypto.HMAC(Crypto.SHA1, uri, key);
							if (hmac.length > 20) {
								hmac = hmac.substr(0, 20);
							}
							document.getElementById('errTest').innerHTML ="<a href='" +uri+"&hash="+gen+hmac+"'> click here </a>";
							//document.getElementById('errTest').innerHTML ="<a href='" +uri+"&hash=6c40d041b87e693f441ec'> click here </a>";
							
						}
	
	*/
				
	///// ================================================ /////
	///// ============ JWPLAYER MODULE SCRIPT ============ /////
	///// ================================================ /////
	
	/*
	jwplayer("myPlayer").setup({
		// good for fullScrn //
		// width: "100%",    //
		// aspectratio: "16:9"//
		width: 902,
		height: 370,
		sources: [
			{ file: "http://yiptv-tele_pacifico.hls.adaptive.level3.net/hls-live/yiptvlive-tele_pacifico/_definst_/live.m3u8?valid_from=1428425595&valid_to=1428426795&hash=9a27255dde110c8c18c0a" }
			//{ file: "http://yiptv4-live.hls.adaptive.level3.net"+uri+"&hash=5"+hmac }
			//{ file:  }
		],
		rtmp: {
			bufferlength: 3
			//securetoken: "ge8Cjn0YTcUYqU6xSmVgpA",
		},
		primary: 'flash',
        modes: [
            { 
				'type': 'flash', 
				'src': 'js/jwplayer/jwplayer.flash.swf' 
			}
        ],
		image: "imgs/friend-banner.jpg",
		androidhls: true,
		autostart: false,
		fallback: false
		
	});
		*/
	
	///// ================================================ /////
	
	
	})
	
	
	
	.controller('usrShwsCntrlr', function($scope, usrShowsFctry){
		//var dShws;
		
		init();
		function init(){
			$scope.usrShws = usrShowsFctry.getUsrShws();
			$scope.usrShws1 = usrShowsFctry.getUsrShws1();
			$scope.usrShws2 = usrShowsFctry.getUsrShws2();
			$scope.usrShwClasses = usrShowsFctry.getShwClasses();

		}
		
		$scope.selectedIndex = -1; // Whatever the default selected index is, use -1 for no selection
		
		
	    $scope.itemClicked = function ($index) {
			//console.log($index);
			//$index.preventDefault();
	    	$scope.selectedIndex = $index;
			
		}
	    $scope.itemClicked2 = function ($index) {
			//console.log($index);
			//$index.preventDefault();
	    	$scope.selectedIndex2 = $index;
			
		}
	    $scope.itemClicked3 = function ($index) {
			//console.log($index);
			//$index.preventDefault();
	    	$scope.selectedIndex3 = $index;
			
		}
		
			/// --- FLIPCARD END --- ///
		
	})
	
	
	.controller('usrNtwrksCntrlr', function($scope, usrNetworksFctry){
		
		init();
		function init(){
			$scope.usrNtwrks = usrNetworksFctry.getUsrNtwrks();
			$scope.usrNtwrkClasses = usrNetworksFctry.getNtwrkClasses();
		
		};
		
		$scope.selectedIndex = 0; // Whatever the default selected index is, use -1 for no selection

	    $scope.itemClicked = function ($index) {
			//console.log($index);
			//$index.preventDefault();
	    	$scope.selectedIndex = $index;
			
		}
			/// --- FLIPCARD END --- ///
		
		
	})
	
	
	.controller('usrDevicesCntrlr', function($scope, usrDevicesFctry){
		
		init();
		function init(){
			$scope.usrDvcs = usrDevicesFctry.getUsrDvcs();
			$scope.usrDvcClasses = usrDevicesFctry.getDvcClass();
			
		}
		
		///// ========= SELECTED CHANNEL TRANSITION ========= /////

		$scope.selectedIndex = 0; // Whatever the default selected index is, use -1 for no selection

	    $scope.itemHovered = function ($index) {
			//console.log($index);
			//$index.preventDefault();
	    	$scope.selectedIndex = $index;
			

			/// --- FLIPCARD END --- ///
			
	    };
		
	})
	
	
	.controller('usrGuideCntrlr', function($scope, usrGuideFctry){
		//$scope.usrDataPrefs = 
		var guideTime;
		
		//$scope.usrGuide = [];
		//$scope._12pm = [];
		//$scope.usrGuide.gdeTme = guideTime;
		
		init();
		function init(){
			//$scope.usrGuide = usrGuideFctry.getGdeData();
			$scope._12pm = usrGuideFctry.getGdeData1();
			$scope._1pm = usrGuideFctry.getGdeData2();
			$scope._2pm = usrGuideFctry.getGdeData3();
			$scope._3pm = usrGuideFctry.getGdeData4();
			$scope._4pm = usrGuideFctry.getGdeData5();
			$scope._5pm = usrGuideFctry.getGdeData6();
			$scope._6pm = usrGuideFctry.getGdeData7();
			//$scope.guideTime = usrGuideFctry.getGdeData_unit();
		}
		
	})
	
	

/*
*
* /// OPTION THREE FOR BINDING DATA ///
*
*

	controllers.myController = function($scope){
		$scope.isPopupVisible = false;

		$scope.showPopup = function(email){
			$scope.isPopupVisible = true;
			$scope.selectedEmail = email;
	
		}	

		$scope.closePopup = function(){
			$scope.isPopupVisible = false;
		}
		
		$scope.emails = [
			{ from: 'Danny', subject: 'for your eye\'s only', date: 'March 17' },
			{ from: 'David', subject: 'for your eye\'s only', date: 'March 18' },
			{ from: 'Dorothy', subject: 'for your eye\'s only', date: 'March 19' }
		]; 
		
		$scope.addCustomer = function(){
			$scope.emails.push({
				from: $scope.newCustomer.from,
				subject: $scope.newCustomer.subject,
				date: $scope.newCustomer.date
			});
		};
	
	}
	
	
	myDemoApp.controller(controllers);
	*/

}(angular.module('app')));