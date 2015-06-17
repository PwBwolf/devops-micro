(function (app) {
    'use strict';

    app.factory('homePrefsSvc', [function () {
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
    }]);
}(angular.module('app')));
