const { Telegraf } = require('telegraf');

const { Keyboards } = require('./Keyboards');
const { Functions } = require('./Functions');

const kb = new Keyboards();

class Bot
{
    _defaultLang = Functions.getLangId('eng');
    _defaultState = Functions.getStateId('main_menu');
    _bot = null;

    constructor(token)
    {
        this._bot = new Telegraf(token);
    }

    getBot()
    {
        return this._bot;
    }

    async start(ctx)
    {
        let userId = ctx.message.chat.id;
        let user = Functions.selectUser(userId);
        let langId = user.lang_id;
        let stateId = user.state_id;
        //console.log(ctx.message.text);

        if (!langId)
            langId = this._defaultLang;
        if (!stateId)
            stateId = this._defaultState;
        Functions.insertUser(userId, langId, stateId);
        await ctx.telegram.sendMessage(userId, Functions.selectText('welcome_text', langId), {
            "reply_markup": kb.getMainMenu(langId),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'main_menu');
    }

    async onMessage(ctx)
    {
        let userId = ctx.message.chat.id;
        let text = ctx.message.text;
        let user = Functions.selectUser(userId);
        let langId = user.lang_id;
        let stateId = user.state_id;
        //console.log(ctx.message);
        if (stateId == Functions.getStateId('main_menu')) {
            // Main Menu
            if (text == Functions.selectText('search_btn', langId)) {
                // Search Btn On Click
                await Search.btnOnClick(ctx, userId, langId, kb);
            } else if (text == Functions.selectText('top_btn', langId)) {
                // Top Btn On Click
                await Top.btnOnClick(ctx, userId, langId, kb);
            }
        }
    }
}
module.exports = {
    Bot
};
