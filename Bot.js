const { Telegraf } = require('telegraf');

const { Keyboards } = require('./Keyboards');
const { Functions } = require('./Functions');

const kb = new Keyboards();

class Bot
{
    _defaultState = Functions.selectState('start').id;
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
        let countryId = user.country_id;
        let cityId = user.city_id;
        // console.log(user);

        if (!stateId)
            stateId = this._defaultState;
        Functions.insertUser(userId, stateId);
        // console.log(userId, langId, stateId, Functions.selectState('main_menu'));
        if (!langId) {
            // select Language
            this.selectLanguage(ctx, userId);
        } else if (countryId && cityId) {
            // Main Menu
            this.mainMenu(ctx, userId, langId);
        } else if (!countryId) {
            // select Country
            this.selectCountry(ctx, userId, langId);
        } else if (!cityId) {
            // select City
            this.selectCity(ctx, userId, langId, user.country_id);
        }
    }

    async onMessage(ctx)
    {
        let userId = ctx.message.chat.id;
        let text = ctx.message.text;
        let user = Functions.selectUser(userId);
        let langId = user.lang_id;
        let stateId = user.state_id;
        // console.log(text);
        if (stateId == Functions.selectState('select_language').id) {
            // select Country
            let lang = Functions.selectLanguageByValue(text);
            // console.log(country, text, langId);
            if (lang) {
                Functions.updateUserLang(userId, lang.id);
                this.selectCountry(ctx, userId, lang.id);
            } else {
                this.selectLanguage(ctx, userId);
            }
        } else if (stateId == Functions.selectState('select_country').id) {
            // select Country
            let country = Functions.selectCountryByValue(text, langId);
            // console.log(country, text, langId);
            if (country) {
                Functions.updateUserCountry(userId, country.id);
                this.selectCity(ctx, userId, langId, country.id);
            } else {
                this.selectCountry(ctx, userId, langId);
            }
        } else if (stateId == Functions.selectState('select_city').id) {
            // select Country
            let city = Functions.selectCityByValue(text, langId);
            // console.log(country, text, langId);
            if (city) {
                Functions.updateUserCity(userId, city.id);
                this.mainMenu(ctx, userId, langId);
            } else {
                this.selectCity(ctx, userId, langId, user.country_id);
            }
        }
    }

    async selectLanguage(ctx, userId)
    {
        let langId = Functions.selectLanguage('eng').id;
        let text = Functions.selectText('select_language', langId);
        await ctx.telegram.sendMessage(userId, text, {
            "reply_markup": kb.getLanguageMenu(langId),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'select_language');
    }

    async selectCountry(ctx, userId, langId)
    {
        let countries = Functions.selectCountries(langId);
        let text = '';
        for (let i = 0; i < countries.length; i++) {
            // let flag = countries[i].value.match(/^[^\s]*?(?=\s)/isug);
            // if (flag)
            //     flag = flag[0];
            // let country = countries[i].value.match(/(?<=\s).*?$/isug);
            // if (country)
            //     country = country[0];
            // text += flag + ' <code>' + country + '</code>' + '\n';
            text += '<code>' + countries[i].value + '</code>' + '\n';
        }
        text += '\n' + Functions.selectText('select_country', langId);
        await ctx.telegram.sendMessage(userId, text, {
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'select_country');
    }

    async selectCity(ctx, userId, langId, countryId)
    {
        let cities = Functions.selectCities(langId, countryId);
        let text = '';
        for (let i = 0; i < cities.length; i++) {
            text += '<code>' + cities[i].value + '</code>' + '\n';
        }
        text += '\n' + Functions.selectText('select_city', langId);
        await ctx.telegram.sendMessage(userId, text, {
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'select_city');
    }

    async mainMenu(ctx, userId, langId)
    {
        await ctx.telegram.sendMessage(userId, Functions.selectText('welcome_text', langId), {
            "reply_markup": kb.getMainMenu(langId),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'main_menu');
    }
}
module.exports = {
    Bot
};
