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
				
		
		var usrScrnFctry = {};
			usrScrnFctry.getUsrData = function(){ return usrMnScrn; };
			usrScrnFctry.getUsrFavs = function(){ return usrFavs; };
			usrScrnFctry.getUsrSgstns = function(){ return usrSgstns; };
			usrScrnFctry.getUsrClass = function(){ return usrScrnClasses; };
			
			
			usrScrnFctry.sendUsrData = function(){
			
			};
		return usrScrnFctry;
		
	})
	
	
	
	.factory('usrShowsFctry', function(){

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
			{ chnlID: "imgs/BigLogos/live-channels-big-_0001_Layer-2.png", shwBnr: "imgs/shws/ent/tucara.jpg", shwTitle: "Tu Cara Me Suena España", shwDesc: "COMING SOON", shwDescCntnt: "" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0001_Layer-2.png", shwBnr: "imgs/shws/ent/secreto.jpg", shwTitle: "El Secreto", shwDesc: "COMING SOON", shwDescCntnt: "" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0004_Layer-1.png", shwBnr: "imgs/shws/ent/musica.jpg", shwTitle: "The Regional Mexican Music Channel", shwDesc: "Video Rola", shwDescCntnt: "Conciertos, especiales, videos, exclusivos!" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0001_Layer-2.png", shwBnr: "imgs/shws/ent/septimo.jpg", shwTitle: "La Ruleta Séptimo Aniversario", shwDesc: "COMING SOON", shwDescCntnt: "" },
			{ chnlID: "imgs/BigLogos/live-channels-big-_0001_Layer-2.png", shwBnr: "imgs/shws/ent/costuras.jpg", shwTitle: "El Tiempo Entre Costuras", shwDesc: "COMING SOON", shwDescCntnt: "" }
		
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

		
		var usrNtwrks = [
			{ ntwrkNm: "beIN Sports", ntwrkID: "imgs/chnl_logos/live-tv-bein-sports.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0032_beIN-n.png", ntwrkAlt: "", ntwrkDesc: "Be a part of the world’s greatest sports programming with beIN Sports. This global network of sports channels is available in English and Spanish and showcases some of the world’s best sports including football and soccer from the United States, Italy, and Spain. In addition, catch some of the hottest events surrounding the Superbike FIM World Championship and FIA World Rallycross Championship! ", ntwrkDesc_1: "Tune into beIN Sports to watch La Liga, Ligue, Serie A, Russian Football, the Capital One Cup, World Cup Qualifiers, COPA American and so much more! Whether you want to catch the latest game or stay abreast of what is going on in some of the world’s largest tournaments, you can stream the events live with YipTV. Watch and listen as the games are broadcast and analyzed by some of the world’s best sportscasters, including professional soccer players, and seasoned sport journalists. ", ntwrkDesc_2: "Never miss your favorite sporting events from around the world again! Tune into beIN Sports in either English or Spanish and watch your favorite sports today!" },
			{ ntwrkNm: "beIN Sports Espanol", ntwrkID: "imgs/chnl_logos/live-tv-bein-sports-e.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0032_beIN-n.png", ntwrkAlt: "", ntwrkDesc: "The world’s best sports programming is available in Spanish! Get the latest stats on your favorite soccer and football players from around the world. Watch La Liga, Ligue, Serie A, Russian Football, The Capital One Cup, World Cup Qualifiers, COPA America, and more on beIN Sports Espanol! Watch your favorite sports live or catch the latest broadcast on the events surrounding these amazing sports. Want something a little more exciting? Check out the amazing Superbike FIM World Championship and FIA World Rallycross Championship live on beIN Sports Espanol!", ntwrkDesc_1: "Stream your favorite sporting events live wherever you have Wi-Fi, whether on your television, tablet, or Smartphone. This means you will never be without your favorite sports, no matter where you go! Check the latest scores, listen to some of the hottest announcers in the industry and enjoy your football, soccer, and bike racing sports today!", ntwrkDesc_2: "Tune into beIN Sports Espanol to get the latest information from around the world, including Spain, England, Italy, and the United States!" },
			{ ntwrkNm: "Canal Sur", ntwrkID: "imgs/chnl_logos/live-tv-canal-sur.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0026_canal-sur.png", ntwrkAlt: "", ntwrkDesc: "Canal Sur is known as the “Latin American Super Station!” With more than 20 years on air, this station brings you the latest and greatest Latin American content right to your television in the United States. Watch news broadcasts, political discussions, and reality programs based in Latin America for your viewing! ", ntwrkDesc_1: "In Latin America, Canal Sur is known as the most up-to-date and informative news channel and now you can have access to it on your television, tablet or Smartphone in the United States! Watch your favorite news programs to get the latest headlines or sit back and relax while you watch some of today’s top entertainment programming. Canal Sur is known as the best access for Americans to watch Latin American TV and now you can do it seamlessly with YipTV!" },
			{ ntwrkNm: "Maya TV", ntwrkID: "imgs/chnl_logos/live-tv-maya-tv.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0019_maya-tv.png", ntwrkAlt: "", ntwrkDesc: "Maya TV provides you with a great variety of programming straight from Honduras. Whether you want the latest breaking news, entertainment, or cultural shows, you will find them on Maya TV. Get your favorite programs on Maya TV streamed right to your television in the United States. " },
			{ ntwrkNm: "Clubbing TV", ntwrkID: "imgs/chnl_logos/live-tv-clubbing-tv.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0023_clubbing-tv.png", ntwrkAlt: "", ntwrkDesc: "Clubbing TV is the world’s first and only 24/7 HDTV channel exclusively dedicated to electronic music, DJs and Dance Music culture."  },
			{ ntwrkNm: "TyC Sports", ntwrkID: "imgs/chnl_logos/live-tv-tyc-sports.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0005_tyc-sports.png", ntwrkAlt: "", ntwrkDesc: "TyC Sports is the only sports channel you need when you want access to Latin America sports. Have up-close and personal access to the Argentinean first division and the Primera B division leagues. Get up-to-the-minute score updates, listen to professional broadcasts, and enjoy the analyses after the games with post-game coverage. ", ntwrkDesc_1: "One of the largest events taking place on TyC Sports is soccer! Get instant updates on your favorite team as well as watch shows centering around it. Watch shows like “Estudio Futbol,” “Despertate and Indirecto” as well as a live sports newscast to get the latest news in the soccer world.", ntwrkDesc_2: "You can also gain access to the professional basketball league in Argentina with “La Liga Nacional de Basquet” as well as updated information on the boxing matches that take place in Argentina and surrounding areas.", ntwrkDesc_3: "TyC Sports brings you the information you want about your favorite sports, streamed right to your TV or device with YipTV!" },
			{ ntwrkNm: "NTN 24", ntwrkID: "imgs/chnl_logos/live-tv-ntn24.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0016_NTN24.png", ntwrkAlt: "", ntwrkDesc: "NTN24 is your 24-hour access to the latest news. Compare it to channels like CNN and BBC World to get an idea of the quality news you will see and hear. NTN24 is one of the top rated news channels around the world with reporters stationed in 18 different countries as well as local reporters, no news goes untouched! ", ntwrkDesc_1: "On NTN24 you will find the latest breaking news, as well as plenty of analysis to help determine what is going on in the world. You will have access around-the-clock to the Hispanic news you want to hear, not just the news that will provide the highest ranking. NTN24 is the only network that covers quality Hispanic news in the United States.", ntwrkDesc_2: "In addition to the regular Hispanic news, you can enjoy shows like “Headlines Hour,” “The Afternoon,” “The Night,” and “Zoom to the News.” Turn to YipTV to get the latest and greatest Hispanic community information today!" },
			{ ntwrkNm: "Video Rola", ntwrkID: "imgs/chnl_logos/live-tv-video-rola.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0004_Layer-1.png", ntwrkAlt: "", ntwrkDesc: "Direct from Guadalajara, Videorola is one of the first ever music networks distributed throughout Mexico and the US.  They are one of the strongest performers on VOD with Comcast offering Live VJ’s hosting music videos, interviews with top artists, live concerts, a daily showbiz news and gossip program, and interactive call in-shows. Launched its HD signal in Mexico in July, 2013. Great ratings performance in both the US and Mexico. Owned by the largest MSO in Mexico:  MegaCable. Carried throughout US Cable:  Time Warner, Comcast, Cox, Charter, etc. Distributed throughout Central America" },
			{ ntwrkNm: "Canal America", ntwrkID: "imgs/chnl_logos/live-tv-america.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0028_America.png", ntwrkAlt: "", ntwrkDesc: "Get the latest on-air, live programming for the Hispanic community on Canal America! With live variety shows, comedies, musical events, and the latest news programming, there is something for everyone on Canal America. ", ntwrkDesc_1: "What sets Canal American apart from any other station is the live programing! Whether you are a night owl and want a channel that provides entertaining late night shows, such as the “Dante Night Show” with interviews, monologues, music, and more or you want to stay in tune with the news going around the Hispanic community, you will find live programming around the clock on Canal America.", ntwrkDesc_2: "Not just limited to nighttime entertainment and the news – you will also find thrilling live shows, such as “Courtroom” where you can watch live action in the courtroom with Mery De Los Rios or watch live specials that center around the issues surrounding the Hispanic community today.", ntwrkDesc_3: "Find everything you need to know and plenty of entertainment right here on Canal America!" },
			{ ntwrkNm: "AZ Clic", ntwrkID: "imgs/chnl_logos/live-tv-azclick.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0031_azclick.png", ntwrkAlt: "", ntwrkDesc: "Get the latest broadcasts from Mexico City live with AzClic. Watch your favorite music videos and catch the latest entertainment news; get behind-the-scenes information on your favorite celebrities, musicians, and bands around-the-clock; and even get inside looks at famous places where some of your favorite movies were made or where your favorite musicians grew up. AzClic programs are the place to be in the know on all of your favorite entertainment celebrities, movies, and songs!", ntwrkDesc_1: "Be in the know about the latest up and coming shows, movies, and songs with Show Zone, a 30-minute production that showcases the latest up-and-coming events. Do you love debates? Check out El Tribate where the experts and celebrities debate the latest controversial issues that are trending. Maybe you want to see up close and personal details on your favorite celebrities – you will find that on Solo Hits, which takes you through all of the details of the artists, what they are up to and even where they live! Don’t forget about late night programming where you can get the Spanish version of everything entertainment on El Hormiguero MX. ", ntwrkDesc_2: "Never miss “the next big thing” event or entertainment news again with AzClic programming! " },
			
			{ ntwrkNm: "AZCorazon", ntwrkID: "imgs/chnl_logos/live-tv-az-corazon.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0030_AZ-Corazon.png", ntwrkAlt: "", ntwrkDesc: "AzCorazon is a channel that contains real stories that women everywhere can identify with every day. Do you love drama, romance, and shows that portray intense problems of women of all ages? Then this channel is for you! You will find comedies, romance, and of course, incredible drama that will rope you right in making you want to see more!", ntwrkDesc_1: "The productions are internationally known and contain incredible acting abilities. This channel broadcasts more than 1,500 telenovela episodes every year, giving you more and more reasons to love it. Whether you love drama and sorrow filled episodes or comedic episodes that show an average family’s struggles and how they overcome them, you will find shows that you love on this channel!", ntwrkDesc_2: "Turn to AZCorazon on YipTV to get the latest love stories, dramas, and comedies that cannot be seen anywhere else. With more than 110 countries tuning in, there is something special to be sought on AZCorazon!" },
			{ ntwrkNm: "RT Espanol", ntwrkID: "imgs/chnl_logos/live-tv-rt-espaniol.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0014_RT-Esp.png", ntwrkAlt: "", ntwrkDesc: "RT Espanol provides today’s latest news, but with an edge that no other channel has yet to provide. You are not just going to hear and see the ordinary news on this channel. Instead, you will be privy to news and analysis that is overlooked by the mainstream news channels, giving you access to alternative news. RT Espanol has been the recipient of many awards, including the 2013 Monte Carlo TV Festival Award.", ntwrkDesc_1: "RT Espanol has been in existence since 2005, but has greatly enhanced its viewership. They are now a network of three channels offering global news in several languages, including English, Spanish, and Arabic. RT has viewers from around the world, totaling around 700 million people. RT gives you access to political, social, and economic news like no other channel has done before. If you are looking for news that no one else provides, you will find it on RT Espanol provided by YipTV!" },
			{ ntwrkNm: "RT News – English", ntwrkID: "imgs/chnl_logos/live-tv-rt.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0015_rt.png", ntwrkAlt: "", ntwrkDesc: "Get the latest news in a way that no other network provides it on RT News – English. This channel, which has been around since 2005 is gaining ground throughout the world. RT News – English used to strictly be available on YouTube, but is now a mainstream news channel that is available on YipTV. Get the answers you want to the occurrences going on around the world rather than hearing the same broadcast over and over again as is typical of the standard news channels.", ntwrkDesc_1: "RT English provides you with a different perspective on what is going on in the world, delivering news that no one else will cover. Tune in to watch newscasts, documentaries, interviews, and analyses of many different types of news from across the world. The news specialists provide not only the information that every other channel provides, but they dig deeper, giving you a behind-the-scenes look at what is going on. Join the 700 million other people that are already enjoying RT News – English with YipTV today!" },
			{ ntwrkNm: "Tele Antioquia", ntwrkID: "imgs/chnl_logos/live-tv-tele-antiquia.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0013_teleantiquioa.png", ntwrkAlt: "", ntwrkDesc: "Tele Antioquia is a Colombian channel that provides regional public television that is acceptable for the entire family. Watch documentaries, learn new skills, and enhance your cultural experience from the comfort of your own home. Watch captivating shows, such as “With the Governor” where you can listen to the governor speak once a week; “Wiki Kids” which is a popular kids’ show that portrays different views of things happening within the community; and “The Upper Hand,” where you can learn amazingly new and cultural cooking techniques.", ntwrkDesc_1: "Tele Antioquia is the channel that you can watch with the entire family day or night. Get in touch with your Colombia culture and feel like you are right at home. Enjoy the Colombian public television in the US with YipTV and your access to Wi-Fi!" },
			{ ntwrkNm: "Canal Antiestres", ntwrkID: "imgs/chnl_logos/live-tv-canal-antiestres.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0027____-Canal-Antiestres-.png", ntwrkAlt: "", ntwrkDesc: "Tune into Canal Antiestres for your around-the-clock Latin America humor and fun! This comedy channel provides endless hours of fun that is appropriate for all ages! ", ntwrkDesc_1: "Tune in bright and early to catch “Humorning” to get your day started off on the right foot with jokes, live calls, performances, and unforgettable stories that will have you laughing all day long. Throughout the day catch programs that cater to the younger crowd, such as “La Web o Nada” where the younger crowd can watch events surrounding today’s technology, or “Internecios” where you can watch some of the funniest occurrences happening on the internet today. For the sports fanatic that wants a good laugh or for those that just don’t the first thing about sports, check into “Despelotados” for some of the world’s funniest sports broadcasting.", ntwrkDesc_2: "One thing is for sure – you will find yourself laughing and having a good time every time you tune into Canal Antiestres and since it is suitable for all ages – it can be some quality family time too!" },
			{ ntwrkNm: "Tele Caribe", ntwrkID: "imgs/chnl_logos/live-tv-telecarib.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0012_telecarib.png", ntwrkAlt: "", ntwrkDesc: "Tele Caribe offers public service broadcasting from Colombia. You will find the most popular shows, latest documentaries and breaking news on this informative channel for all ages. Watch the most entertaining shows, learn something new with documentaries and how-to shows, and experience today’s latest technology from the comfort of your own home with live streaming of Colombian TV right to your television or tablet.", ntwrkDec_1: "Sit back, relax and enjoy shows like “Happy Day” which offers the latest tips on fashion, arts, health, and welfare of the Colombian people; watch cooking tips and history with “He Knows Quessep”; and watch live games on “Pilla La Nota.” You can also enjoy children’s programs, sports, interviews, and comedies. There is something for everyone in Tele Caribe and now you can stream it into your own home or with you on-the-go with YipTV!" },
			{ ntwrkNm: "El Cantinazo ", ntwrkID: "imgs/chnl_logos/live-tv-cantinanzo.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0024_cantinazo.png", ntwrkAlt: "", ntwrkDesc: "Get the latest music right on your television, tablet or Smartphone on El Cantinazo. Whether you love the oldies but goodies or want to hear today’s latest Colombian hits, you will find them on this channel. Listen to music, watch the latest videos and discover new talents around-the-clock! Now you can do more than just listen to your favorite Colombian music – you can watch it too! It is entertainment for all senses and something for the entire family to enjoy together!", ntwrkDesc_1: "In addition to music and traditional music videos, you can enjoy shows that include Las Noches de Valkiria, Muy Personal, El Ascensor, Cine y Despecho and Franja Motivacion y  Salud. Enjoy your favorite shows when you stream El Cantinazo live on YipTV!" },
			{ ntwrkNm: "Canal Tiempo", ntwrkID: "imgs/chnl_logos/live-tv-et-canal-tempo.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0029_ET-Cnal-Tempo.png", ntwrkAlt: "", ntwrkDesc: "El Tiempo TV brings you the latest news straight from Colombia. Whether you want to stay in tune with the world news, want access to special reports or have a favorite program that comes from Colombia, you can find it on Canal Tiempo. Get access to the latest events from halfway around the world from the comfort of your own home or while on-the-go; wherever you have access to Wi-Fi, whether 3G, 4G, or LTE, you can know what is going on in Colombia with YipTV!" },
			{ ntwrkNm: "Cosmovision", ntwrkID: "imgs/chnl_logos/live-tv-cosmovision.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0022_cosmovision.png", ntwrkAlt: "www.cosmovision.tv", ntwrkDesc: "Turn to Canal Cosmovision for your Latin TV sources. Learn about the latest events happening in Latin America, learn about the culture, and watch series on how to cook and craft just like they do in Latin America. Whether you desire news or entertainment, you will find it on Cosmovision. ", ntwrkDesc_1: "Cosmovision is a tightly knit family channel that brings you the perfect combination of culture, style, and news from the Latin American world. Learn fashion trends, health and beauty secrets, and the ways of the Hispanic people on this lifestyle channel that is perfect for the entire family!" }, 
			{ ntwrkNm: "Canal TRo", ntwrkID: "imgs/chnl_logos/live-tv-canal-tro.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0025_canal-tro.png", ntwrkAlt: "", ntwrkDesc: "Get access to Eastern Regional Television, otherwise known as TRO, with Canal TRo. This public television network based in Colombia has been on the air since 1997. With 18-hour a day broadcasts, you have access to the latest and most breaking news in Colombia. With Canal TRo, you have access to numerous cultural and educational programs, helping to elicit a cultural feeling in your home in the United States. ", ntwrkDesc_1: "Take advantage of the broad range of programming available on Canal TRo, such as morning programs that discuss today’s latest issues in Colombia, DIY programs with cultural projects straight from Colombia, or catch the latest sporting event news straight from Colombia", ntwrkDesc_2: "Canal TRo is your public broadcast network straight from Colombia, helping you to gain access to culture and experience that you desire." },
			
			{ ntwrkNm: "TELESUR", ntwrkID: "imgs/chnl_logos/live-tv-telesur.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0009_Telesur.png", ntwrkAlt: "", ntwrkDesc: "TeleSUR is the only news source you need for breaking news throughout the world. Focused in Latin America, TeleSUR has covered news stories from around the world, uncovering the truth for many incredible events. The news aired on this channel caters to everyone, young and old – giving everyone the information they need.", ntwrkDesc_1: "On TeleSUR you can watch shows like “Green Area” where issues with ecology and the environment are discussed; “Economic Impact” where the latest economic news from around the world is discussed; “Between Borders” which specializes on migration issues; and “Congener” which focuses on gender inequalities and what is being done to resolve them.", ntwrkDesc_2: "In addition to this great programming are the traditional news programs that air morning, noon, and night. Stay knowledgeable of the events going on around the world with TeleSUR streamed live with YipTV!" },
			{ ntwrkNm: "TVC LATINO", ntwrkID: "imgs/chnl_logos/live-tv-tvc-latino.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0006_tvc-latino.png", ntwrkAlt: "", ntwrkDesc: "TVC+ Latino is Mexican entertainment at its finest. You will find the most exciting Spanish content that includes sitcoms, news, sports, and music all on one channel! TVC+ Latino is a Mexican channel based in the United States, streaming the latest information for the Hispanic community. ", ntwrkDesc_1: "Watch your favorite Latino talk shows, get access to the Mexican Soccer League, and get all of the latest, breaking news in Spanish right at home. Every week this channel offers more than 30 hours of fresh content that appeals to every Hispanic generation in your family.", ntwrkDesc_2: "Get access to this great Hispanic culture channel on YipTV today!" },
			{ ntwrkNm: "TV Quisqueya", ntwrkID: "imgs/chnl_logos/live-tv-tv-quisqueya.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0007_Quisqueya.png", ntwrkAlt: "", ntwrkDesc: "Quisiqueya is alternative news for the Hispanic community at its best. With the perfect combination of entertainment and news, there is something for everyone on this channel. If you miss your Hispanic roots, especially if you’re from the Dominican Republic, this channel will bring you right back to them. ", ntwrkDesc_1: "Quisqueya brings entertainment that is suitable for the whole family. Watch entertaining shows as a family, catch the latest breaking news in the Hispanic community, or catch up on the latest sports on this channel. Quisqueya goes above and beyond what any other channel provides- their news reporters dig deeper and their analysts provide the information you want to hear – there is no hiding anything from the community with this alternative news channel. Get your Hispanic news and culture right on your TV, no matter how many millions of miles away you may be with YipTV!" }, 
			{ ntwrkNm: "Destinos TV", ntwrkID: "imgs/chnl_logos/live-tv-destino.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0021_Destino.png", ntwrkAlt: "", ntwrkDesc: "Experience travel around the world 24-hours a day with Destinos TV! Stream incredible shows right to your television, tablet, or Smartphone and get the latest information to plan the perfect vacation. With around-the-clock programming you are sure to find programs whenever you want, helping you to plan the vacation that fits your budget and your desires.", ntwrkDesc_1: "Watch shows like “Our American Continent” where you can discover places such as Ecuador, Chile, and Peru. Learn about their cultures and the vast differences among them. The show will provide you with just enough information to stir your desire to visit them. In “Cities of America” learn the stories behind some of the most famous cities in the US, then plan the perfect vacation that includes fun, culture, and education. In “On the Wine Routes” you can witness the best wine routes in Italy – the perfect show for any wine connoisseur. Of course, with all of these travels, you will need the perfect hotel, which you can learn about on “Hotels,” the show that offers advice on the hundreds of options you have at any destination." },
			{ ntwrkNm: "TELE PACIFICO", ntwrkID: "imgs/chnl_logos/live-tv-telepacirco.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0010_telepacirco.png", ntwrkAlt: "", ntwrkDesc: "Tele Pacifico offers public television broadcasting straight from the Southwest regions of Colombia. The channel is dedicated to providing quality and timely information regarding the development of the areas in both social and economic areas. The programs aired on Tele Pacifico are safe for all ages and are meant to entertain as well as educate your entire family. ", ntwrkDesc_1: "Let your kids enjoy shows like 5BIJAS, where kids go on amazing adventures and learn new lessons with each episode. For the adults in your family, enjoy shows like “Cronik with K Kike” which chronicles everyday issues in a fun and engaging way or the News channel where you can catch up with the latest occurrences in the Colombian Pacific.", ntwrkDesc_2: "No matter who you are trying to entertain, there is something education, entertaining, and exciting for everyone in your family on Tele Pacifico. Get access to it today with YipTV!" },
			{ ntwrkNm: "Tele Formula", ntwrkID: "imgs/chnl_logos/live-tv-teleformula.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0000_Layer-3.png", ntwrkAlt: "", ntwrkDesc: "Tele Formula provides quality, authentic Colombian Catholic television. They air programs that promote the Christian faith while entertaining families worldwide. They spread the word of the Gospel to the Hispanic community through a variety of avenues. They promote a feeling of peace, prosperity, and life throughout their wholesome programming around-the-clock.", ntwrkDesc_1: "Tune in any time of day or night to catch the latest religious shows airing on this Colombian TV channel. Whether you want to honor the Blessed Mother; adore the Eucharist; pray; get new insight and promote deep thought; or listen to the culmination of the issues facing the world, you can find these programs right on Tele Vid.", ntwrkDesc_2: "You will also find plenty of wholesome entertainment, health news, and cooking shows that will help you to better your life in many ways. Gain access to this channel on YipTV by streaming Tele Vid right on your television or device with Wi-Fi access!" },
			{ ntwrkNm: "TELE MEDELLIN", ntwrkID: "imgs/chnl_logos/live-tv-medellin.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0011_medellin.png", ntwrkAlt: "", ntwrkDesc: "This local, non-profit television channel broadcasts from Columbia, in the Valley of Aburra. On this channel you will experience city life in Columbia firsthand. Experience the art, culture, music and all of the latest news pertaining to sports, current events, the arts, and more. As an added bonus, they offer plenty of appropriate children’s programing to allow something for the entire family to watch. Whether you want to hear the latest, breaking news from Columbia, catch up on the latest trends, or sit back and watch a hilarious comedy, you can do so on this one channel. ", ntwrkDesc_1: "Enjoy shows like “Wilderness” where you can explore the sights and sounds of the nature in the Valley of Aburra; “Science Bike” where you can stay informed on the latest happenings in the scientific world with conferences and seminars; “Head On” where you can witness the discussions of some of the most important topics governing the area; and “Planet Plan” where you can see firsthand the changes being made to help save the environment. Watch all of this and so much more on Tele Medellin on YipTV!" },
			{ ntwrkNm: "MeioNorte", ntwrkID: "imgs/chnl_logos/live-tv-meinorte.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0018_meinorte.png", ntwrkAlt: "", ntwrkDesc: "TV Meio Norte brings Brazilian TV right to your television or Wi-Fi enabled device. Headquartered in Teresina, Piaui, MeioNorte brings you the latest Brazilian shows, news, and entertainment. Watch shows like “Authorities of Humor,” “Little School of Laughter,” and “70 minutes.” ", ntwrkDesc_1: "Stream TV MeioNorte for the entire family as you spend quality time watching Brazilian TV together, whether you want to catch up on the latest news or have a good laugh together, YipTV makes it easy to get your favorite channels delivered right to your home or with you on-the-go." }, 
			{ ntwrkNm: "YES", ntwrkID: "imgs/chnl_logos/live-tv-yes.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0003_yes.png", ntwrkAlt: "", ntwrkDesc: "Learn English the fun way with YES! This English television channel offers entertaining ways for people of all ages to learn the English language. There are different levels available for every learner to learn at their own pace. The shows are exciting and engaging, helping even the youngest learner stay excited.", ntwrkDesc_1: "Tune in any time of day or night to catch the latest religious shows airing on this Colombian TV channel. Whether you want to honor the Blessed Mother; adore the Eucharist; pray; get new insight and promote deep thought; or listen to the culmination of the issues facing the world, you can find these programs right on Tele Vid.", ntwrkDesc_2: "The methods used to teach English on YES are different than anywhere else. Viewers get to see, learn and experience the English language in a way that is fun, making them want to learn to speak English. Engage all of your senses, including listening, hearing, speaking, and reading as you learn the language that is so paramount to your success.", ntwrkDesc_3: "Just how do you learn with YES? It’s simple. You just sit in the comfort of your own home, watch the shows, listen and observe – soon enough you will be speaking English too. The lessons are created in a way that anyone from beginners to advanced students can master the English language.", ntwrkDesc_4: "Get access to YES with YipTV today!" },
			{ ntwrkNm: "ZOOM", ntwrkID: "imgs/chnl_logos/live-tv-zoom.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0002_zoom.png", ntwrkAlt: "", ntwrkDesc: "ZOOM is a National University Channel that broadcasts from Columbia. ZOOM consists of media from 48 different colleges and five higher education institutions. All content on ZOOM is created and produced by the universities. ", ntwrkDesc_1: "On ZOOM, you can watch shows such as “Frog Soup,” “Since U,” “He Prof,” and “High Command” among many others. ", ntwrkDesc_2: "Gain access to this priority University Channel on YipTV today!" },
			
			{ ntwrkNm: "Video Rola", ntwrkID: "imgs/chnl_logos/live-tv-video-rola.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0004_Layer-1.png", ntwrkAlt: "", ntwrkDesc: "Video Rola provides you with premier access to the Mexican music network. Watch your favorite music videos, gain access to exclusive interviews with your favorite stars, watch live concerts, and be entertained with the many shows. ", ntwrkDesc_1: "Watch shows like ATM con Rafa Valles; ATM con Marlene Contreras, Dedicadas, and Estelares or just stay up-to-date on your favorite artists. Video Rola is the only music channel that gives you up-to-the-minute access to the Mexican music network in the United States!" },
			{ ntwrkNm: "Mi Gente", ntwrkID: "imgs/chnl_logos/live-tv-mi-g-ente-tv.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0017_miGente-TV.png", ntwrkAlt: "", ntwrkDesc: "Mi Gente is your go-to channel for all of your favorite music. Listen to your favorite tunes, get the latest news on your favorite artists and go behind the scenes for an all-access pass to the entertainment world! A sampling of the artists found on Mi Gente include MYP Milton and Paola, Valeria Colmex, Jorge Luis Hortua, Danny Moreno, Malissa, and Gold Panche. ", ntwrkDesc_1: "Watch shows, such as Portada Mi Gente, Portada Boga, En Primer Plano, Mi Gente Presenta, Los Secretos de Mi Gente, and En Blanco y Negro on Mi Gente. Get all of the latest musical coverage from Central and South America right on YipTV!" }, 
			{ ntwrkNm: "JBN", ntwrkID: "imgs/chnl_logos/live-tv-jbn.png", ntwrkImg: "imgs/BigLogos/live-channels-big-_0020_JBN.png", ntwrkAlt: "", ntwrkDesc: "JBN International is a Honduras channel that provides programming for the entire family. Because of their distinct ratings that cater to people of all ages, races, and hobbies, they have gained top rankings throughout the world. Catch the latest news, listen to music, catch up on the latest entertainment news, laugh at a sitcom, watch sports, or enjoy a documentary aimed at children together. ", ntwrkDesc_1: "Just a sampling of the shows you can enjoy on JBN include “Mad Men,” “Scrubs,” and “Seinfeld.” In addition, you can catch the latest breaking news or catch up on your sports. JBN is a channel that you can stream all day long and never worry about its content not being appropriate for younger eyes and ears. One thing that sets JBN apart from the rest includes its positive messages that help to promote healthy minds and bodies with positive media messages that work to help parents with their job at keeping everyone healthy rather than fill children’s minds with things that work against these parameters. ", ntwrkDesc_2: "JBN is available on YipTV around-the-clock and you can have access to it today!" }
			
			
			
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
	
		var mnuBtns = ['pgCntnt', 'Shws', 'Ntwrks', 'Abt', 'Orders'];
		
		$('#docklogo').on('click', function(){
			$('html, body').animate({
				scrollTop: 0,
				
			}, 1500);
		});
		
		for(var j = 0; j < 5; j++){
			$('#'+mnuBtns[j]).on('click', function(){
	
				var dPg = $(this).attr('id');
				var dSite = $('html, body');
				    dSite.animate({
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
		var hroBnrsMap = hroBnrsCntnr.querySelectorAll("li area");
	    var mP = 'mbl_bnr_P', mL = 'mbl_bnr_L', tP = 'tblt_bnr_P', tL = 'tblt_bnr_L', dT = 'dsktp_bnr_L', othrBnrs, crntBnr;
		var enMblPImg = '../imgs/mbl/en/mbl_P_', enMblPImg_map = '',
			enMblLImg = '../imgs/mbl/en/mbl_L_', enMblLImg_map_1 = '../imgs/mbl/en/mbl_L_', enMblLImg_map_2 = '../imgs/mbl/en/mbl_L_', enMblLImg_map_3 = '../imgs/mbl/en/mbl_L_', enMblLImg_map_4 = '../imgs/mbl/en/mbl_L_', enMblLImg_map_5 = '../imgs/mbl/en/mbl_L_',
			enTbltImg = '../imgs/tblt/en/tblt_', enTbltImg_map_1 = '../imgs/tblt/en/tblt_', enTbltImg_map_2 = '../imgs/tblt/en/tblt_', enTbltImg_map_3 = '../imgs/tblt/en/tblt_', enTbltImg_map_4 = '../imgs/tblt/en/tblt_', enTbltImg_map_5 = '51,226,302,223,303,281,52,284',
			enDskTpImg = '../imgs/pc/en/dsktp_', enDskTpImg_map_1 = '47,573,611,572,609,702,45,702', enDskTpImg_map_2 = '105,504,605,505,610,621,102,619', enDskTpImg_map_3 = '153,566,464,565,464,656,153,658', enDskTpImg_map_4 = '505,564,825,564,823,659,506,659', enDskTpImg_map_5 = '607,566,104,564,105,450,605,449';
		
		console.log(hroBnrsMap.length);
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
				   //hroBnrsMap[h].setAttribute('coords', enMblPImg_map_+[h+1] );
			   }	
			   console.log('this window is '+value+'px wide. Its portrait mobile. So I\'ll use '+hroBnrs.length);
				   } else if(value > 400 && value <= 768){
				   
					   for(var h = 0; h < hroBnrs.length; h++){
						   hroBnrs[h].setAttribute('src', enMblLImg+[h+1]+'.jpg');
						   hroBnrs[h].setAttribute('width', '667px');
						   hroBnrs[h].setAttribute('height', '350px');
						   //hroBnrsMap[h].setAttribute('coords', enMblLImg_map_+[h+1] );
						   
					   }
					   
			       console.log('this window is '+value+'px Its landscape mobile.'+hroBnrs.length);
				   		} else if(value >= 769 && value <= 1024){
				   
						   for(var h = 0; h < hroBnrs.length; h++){
							   hroBnrs[h].setAttribute('src', enTbltImg+[h+1]+'.jpg');
							   hroBnrs[h].setAttribute('width', '1300px');
							   hroBnrs[h].setAttribute('height', '433px');
							   //hroBnrsMap[h].setAttribute('coords', enTbltImg_map_+[h+1] );
							   
						   }
					    console.log('this window is '+value+'px Its tablet view.'+hroBnrs.length);
					   		} else if( value > 1024 ){
			   
							   for(var h = 0; h < hroBnrs.length; h++){
								   hroBnrs[h].setAttribute('src', enDskTpImg+[h+1]+'.jpg');
								   hroBnrs[h].setAttribute('width', '2600px');
								   hroBnrs[h].setAttribute('height', '866');
								   //hroBnrsMap[h].setAttribute('coords', enDskTpImg_map_+[h+1] );
								   
							   }
							console.log('this window is '+value+'px Its Desktop view.'+hroBnrs.length);
		  }
			  
		});
		
			$('#slider').nivoSlider({
				pauseTime: 6000,
	
			});
		
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
			
		}
		
			
		
		
		///// =============================================== /////
		///// ========= SELECTED CHANNEL TRANSITION ========= /////
		///// =============================================== /////

		$scope.selectedIndex = -1; // Whatever the default selected index is, use -1 for no selection

	    $scope.itemClicked = function ($index) {

	    	$scope.selectedIndex = $index;
			

			/// --- FLIPCARD END --- ///
			
	    };
		
		
	
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

	    	$scope.selectedIndex = $index;
			
		}
	    $scope.itemClicked2 = function ($index) {

	    	$scope.selectedIndex2 = $index;
			
		}
	    $scope.itemClicked3 = function ($index) {

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
		
		init();
		function init(){
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