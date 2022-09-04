const { Telegraf } = require('telegraf');
const { Keyboards } = require('./Keyboards');
const { Functions } = require('./Functions');

const kb = new Keyboards();

class OfferGenerator()
{
    async inputDescription(ctx, userId, langId)
    {
        await ctx.telegram.sendMessage(userId, Functions.selectText('offer_description', langId), {
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'offer_description');
    }

    async inputPrice(ctx, userId, langId)
    {
        await ctx.telegram.sendMessage(userId, Functions.selectText('offer_price', langId), {
            "reply_markup": kb.getPriceKeyboard(langId),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'offer_price');
    }

    async inputPhoto(ctx, userId, langId)
    {
        await ctx.telegram.sendMessage(userId, Functions.selectText('offer_photo', langId), {
            "reply_markup": kb.getPhotoKeyboard(langId),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'offer_photo');
    }

    async inputAddress(ctx, userId, langId)
    {
        // let url = 'https://www.google.com/maps/search/';
        await ctx.telegram.sendMessage(userId, Functions.selectText('offer_address', langId), {
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'offer_address');
    }
}
module.exports = {
    OfferGenerator
};
