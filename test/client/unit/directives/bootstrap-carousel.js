describe('directive: bootstrapCarousel', function() {
    var elem, scope;

    beforeEach(module('app'));

    beforeEach(inject(function ($rootScope, $compile) {
        elem = angular.element('<div id="carousel-banner" class="carousel slide" bootstrap-carousel interval="5000"><ul class="carousel-inner"><li class="item active"><img src="images/banner.jpg" alt="..."><div class="carousel-caption3"><div class="caption-txt3"><h1 translate="HOME_UNBEATABLE_PRICE">Unbeatable price.</h1><h2 translate="HOME_PRICE">$14.99/mo</h2><h3 translate="HOME_NO_CONTRACTS_EVER">No contracts. Ever.</h3><button goto="/sign-up/paid" translate="HOME_JOIN_NOW">Join Now!</button><p translate="HOME_NO_CONTRACTS_CANCEL_ANYTIME">No contracts - cancel anytime!</p></div></div></li><li class="item"><img src="images/banner.jpg" alt="..."><div class="carousel-caption1"><div class="caption-txt1"><h1 translate="HOME_LOTS_OF_CHANNELS">Lot of Channels,</h1><h1 translate="HOME_ZERO_CONTRACTS">Zero Contracts,</h1><h1 translate="HOME_NO_HASSLES">No Hassles.</h1><button goto="/sign-up/free" translate="HOME_GET_MONTH_FREE">Get a Month FREE!</button><p translate="HOME_NO_CONTRACTS_CANCEL_ANYTIME">No contracts - cancel anytime!</p></div></div></li><li class="item"><img src="images/banner.jpg" alt="..."><div class="carousel-caption2"><div class="caption-txt2"><h1 translate="HOME_START">Start</h1><h1 translate="HOME_DAYSTREAMING">Daystreaming.</h1><h2 translate="HOME_LIVE_LOCAL_TV">Live, local television from over 20</h2><h2 translate="HOME_COUNTRIES_STREAMED">countries streamed direct to your TV</h2><h2 translate="HOME_OR_MOBILE_DEVICE">or mobile device.</h2><button goto="/sign-up/free" translate="HOME_GET_MONTH_FREE">Get a Month FREE!</button><p translate="HOME_NO_CONTRACTS_CANCEL_ANYTIME">No contracts - cancel anytime!</p></div></div></li><li class="item"><img src="images/banner.jpg" alt="..."><div class="carousel-caption4"><div class="caption-txt4"><h1 translate="HOME_LOVE_EDM">Love EDM? Get VIP</h1><h1 translate="HOME_ACCESS_TO_CONTENT">access to content</h1><h1 translate="HOME_LIKE_LIVE_ELECTRONICA">like live Electronica.</h1><h2 translate="HOME_YIPTV_HAS_CHANNELS">YipTV has channels that your cable</h2><h2 translate="HOME_PROVIDER_DOESNT">provider doesnt, like Clubbing TV.</h2><button goto="/sign-up/free" translate="HOME_GET_MONTH_FREE">Get a Month FREE!</button><p translate="HOME_NO_CONTRACTS_CANCEL_ANYTIME">No contracts - cancel anytime!</p></div></div></li></ul><ol class="carousel-indicators"><li data-target="#carousel-banner" data-slide-to="0" class="active"></li><li data-target="#carousel-banner" data-slide-to="1"></li><li data-target="#carousel-banner" data-slide-to="2"></li><li data-target="#carousel-banner" data-slide-to="3"></li></ol></div>');
        scope = $rootScope.$new();
        $compile(elem)(scope);
        scope.$digest();
    }));

    describe('bootstrapCarousel', function () {
        /*it('should set the interval for carousel slider', function () {
            spyOn(elem, 'carousel');
            expect(elem.carousel).toHaveBeenCalledWith({
                interval: 5000
            });
        });*/
    });

});
