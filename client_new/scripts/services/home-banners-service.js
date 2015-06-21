(function (app) {
    'use strict';

    app.factory('homePrefsSvc', [function () {
        var en_Bnrs = [
            {bnrID: '0001', bnrPath: 'images/pc/en/Hero_eng_beINSports.jpg', bnrPath_tblt: 'images/tblt/en/Hero_eng_beINSports.jpg', bnrPath_mbl: 'images/mbl/en/Hero_eng_beINSports.jpg'},
            {bnrID: '0002', bnrPath: 'images/pc/en/Hero_eng_download.jpg', bnrPath_tblt: 'images/tblt/en/Hero_eng_download.jpg', bnrPath_mbl: 'images/mbl/en/Hero_eng_download.jpg'},
            {bnrID: '0003', bnrPath: 'images/pc/en/Hero_eng_TryFee7psd.jpg', bnrPath_tblt: 'images/tblt/en/Hero_eng_TryFee7psd.jpg', bnrPath_mbl: 'images/mbl/en/Hero_eng_TryFee7psd.jpg'},
            {bnrID: '0004', bnrPath: 'images/pc/en/Hero_eng_unbeatablePrice.jpg', bnrPath_tblt: 'images/tblt/en/Hero_eng_unbeatablePrice.jpg', bnrPath_mbl: 'images/mbl/en/Hero_eng_unbeatablePrice.jpg'}
        ];

        var en_pc_Bnrs = [
            {bnrID: '0001', bnrPath: 'images/pc/en/Hero_eng_beINSports.jpg'},
            {bnrID: '0002', bnrPath: 'images/pc/en/Hero_eng_download.jpg'},
            {bnrID: '0003', bnrPath: 'images/pc/en/Hero_eng_TryFee7psd.jpg'},
            {bnrID: '0004', bnrPath: 'images/pc/en/Hero_eng_unbeatablePrice.jpg'}
        ];

        var en_tblt_Bnrs = [
            {bnrID: '0001', bnrPath: 'images/tblt/en/Hero_eng_beINSports.jpg'},
            {bnrID: '0002', bnrPath: 'images/tblt/en/Hero_eng_download.jpg'},
            {bnrID: '0003', bnrPath: 'images/tblt/en/Hero_eng_TryFee7psd.jpg'},
            {bnrID: '0004', bnrPath: 'images/tblt/en/Hero_eng_unbeatablePrice.jpg'}
        ];

        var en_mbl_Bnrs = [
            {bnrID: '0001', bnrPath: 'images/mbl/en/Hero_eng_beINSports.jpg'},
            {bnrID: '0002', bnrPath: 'images/mbl/en/Hero_eng_download.jpg'},
            {bnrID: '0003', bnrPath: 'images/mbl/en/Hero_eng_TryFee7psd.jpg'},
            {bnrID: '0004', bnrPath: 'images/mbl/en/Hero_eng_unbeatablePrice.jpg'}
        ];

        var sp_Bnrs = [
            {bnrID: '0001', bnrPath: 'images/pc/sp/Hero_esp_beINSports.jpg'},
            {bnrID: '0002', bnrPath: 'images/pc/sp/Hero_esp_download.jpg'},
            {bnrID: '0003', bnrPath: 'images/pc/sp/Hero_esp_TryFee7psd.jpg'},
            {bnrID: '0004', bnrPath: 'images/pc/sp/Hero_esp_unbeatablePrice.jpg'}
        ];

        var usrPrfrdChnls = [
            {chnl: 'images/chnl_images/Channels1.jpg'}, {chnl: 'images/chnl_images/Channels2.jpg'}, {chnl: 'images/chnl_images/Channels3.jpg'},
            {chnl: 'images/chnl_images/Channels4.jpg'}, {chnl: 'images/chnl_images/Channels5.jpg'}, {chnl: 'images/chnl_images/Channels6.jpg'},
            {chnl: 'images/chnl_images/Channels7.jpg'}, {chnl: 'images/chnl_images/Channels8.jpg'}, {chnl: 'images/chnl_images/Channels9.jpg'},
            {chnl: 'images/chnl_images/Channels10.jpg'}, {chnl: 'images/chnl_images/Channels11.jpg'}, {chnl: 'images/chnl_images/Channels12.jpg'},
            {chnl: 'images/chnl_images/Channels13.jpg'}, {chnl: 'images/chnl_images/Channels14.jpg'}, {chnl: 'images/chnl_images/Channels15.jpg'},
            {chnl: 'images/chnl_images/Channels16.jpg'}, {chnl: 'images/chnl_images/Channels17.jpg'}, {chnl: 'images/chnl_images/Channels18.jpg'},
            {chnl: 'images/chnl_images/Channels19.jpg'}, {chnl: 'images/chnl_images/Channels20.jpg'}, {chnl: 'images/chnl_images/Channels21.jpg'},
            {chnl: 'images/chnl_images/Channels22.jpg'}, {chnl: 'images/chnl_images/Channels23.jpg'}, {chnl: 'images/chnl_images/Channels24.jpg'},
            {chnl: 'images/chnl_images/Channels25.jpg'}, {chnl: 'images/chnl_images/Channels26.jpg'}, {chnl: 'images/chnl_images/Channels27.jpg'},
            {chnl: 'images/chnl_images/Channels28.jpg'}, {chnl: 'images/chnl_images/Channels29.jpg'}, {chnl: 'images/chnl_images/Channels30.jpg'},
            {chnl: 'images/chnl_images/Channels31.jpg'}, {chnl: 'images/chnl_images/Channels32.jpg'}
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
